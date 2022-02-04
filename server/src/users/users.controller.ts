import { Router } from 'express';
import * as winston from 'winston';

import { Auth } from '../auth';

import { DuplicateUserError, User, UserNotFoundError } from '.';
import * as usersService from './users.service';

const logger = winston.loggers.get('app-logger');

const auth = new Auth();
const router = Router();

// Allow access without auth.
router.post('/v1.0/users/register', async (req, res) => {
  const user: User = req.body;

  let createdUser;
  try {
    createdUser = await usersService.createUser(user);
  }
  catch (e) {
    logger.error(e);
    if (e instanceof DuplicateUserError) {
      return res.status(400).send('A user with that email already exists.')
    }

    return res.status(500).send('An error occurred when creating the user.');
  }

  return res.json(createdUser);
});

// Only validate jwt past this point
router.use(auth.validateJwt());

router.get('/v1.0/users/:id', auth.isUserOrAdmin(), async (req, res) => {
  const userId: string = req.params.id;

  let user;
  try {
    user = await usersService.getUserById(userId);
  }
  catch (e) {
    logger.error(e);
    return res.status(500).send('An error occurred when getting users.');
  }

  return res.json(user);
});

router.put('/v1.0/users/:id', auth.isUserOrAdmin(), async (req, res) => {
  const userId: string = req.params.id;
  const userUpdates: User = req.body;

  let user;
  try {
    user = await usersService.updateUser(userId, userUpdates);
  }
  catch (e) {
    logger.error(e);
    if (e instanceof UserNotFoundError) {
      res.status(400).send(`Unable to get user with ID: ${userId}`);
    }

    return res.status(500).send('An error occurred when updating user.');
  }

  return res.json(user);
});

export default router;