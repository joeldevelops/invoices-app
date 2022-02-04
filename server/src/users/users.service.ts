import * as bcrypt from 'bcrypt';

import { Roles } from '../auth';

import {
  DuplicateUserError,
  User,
  UserNotFoundError
} from '.';
import users from './users.model';

export const getUserById = async (userId: string): Promise<User> => {
  return users.findOne({ _id: userId });
}

export const getUserByEmail = async (email: string): Promise<User> => {
  return users.findOne({ email: email });
}

export const createUser = async (newUser: User): Promise<User> => {
  const existingUser = await users.findOne({ email: newUser.email });
  if (existingUser) {
    throw new DuplicateUserError(
      `User with email: ${newUser.email} already exists`
    );
  }

  // Default claims for a new user.
  // Admin is selected here to allow a given user to view the
  // full functionality of the app.
  newUser.role = Roles.ADMIN;

  const salt = await bcrypt.genSalt(15);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  return users.create(newUser);
};

export const updateUser = async (userId: string, userUpdates: User): Promise<User> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new UserNotFoundError(
      `Unable to find user with ID: ${userId}`
    );
  }

  const updates = Object.assign({}, user, userUpdates);

  return users.findOneAndUpdate({ _id: userId }, updates);
};