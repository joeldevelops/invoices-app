import * as userService from '../../src/users/users.service';
import userModel from '../../src/users/users.model';
import { DuplicateUserError, UserNotFoundError } from '../../src/users';

import * as mockingoose from 'mockingoose';

const testUser = {
  firstname: 'Joel',
  lastname: 'Milligan',
  email: 'joeldevelops@gmail.com',
  password: 'bingus4000'
}
const testId = '42';

describe('users.service.ts', () => {

  describe('getUserById', () => {

    test('should return a user document from the model', async () => {
      mockingoose(userModel).toReturn(testUser, 'findOne');
      const res = await userService.getUserById(testId);
      expect(res.firstname).toBe(testUser.firstname);
    });
  });

  describe('getUserByEmail', () => {

    test('should return a user document from the model by email', async () => {
      mockingoose(userModel).toReturn(testUser, 'findOne');
      const res = await userService.getUserByEmail(testUser.email);
      expect(res.firstname).toBe(testUser.firstname);
    });
  });

  describe('createUser', () => {

    test('should throw DuplicateUserErrror when the user to create already exists', async () => {
      mockingoose(userModel).toReturn(testUser, 'findOne');

      let error;
      try {
        await userService.createUser(testUser);
      }
      catch (e) {
        error = e;
      }

      expect(error instanceof DuplicateUserError).toBe(true);
    });

    test('should create user is no matching user exists', async () => {
      mockingoose(userModel)
        .toReturn(false, 'findOne')
        .toReturn(testUser, 'create');
      const res = await userService.createUser(testUser);
      expect(res.firstname).toBe(testUser.firstname);
    });
  });

  describe('updateUser', () => {

    test('should throw UserNotFound when the user to update can not be found', async () => {
      mockingoose(userModel).toReturn(false, 'findOne');

      let error;
      try {
        await userService.updateUser(testId, testUser);
      }
      catch (e) {
        error = e;
      }

      expect(error instanceof UserNotFoundError).toBe(true);
    });

    test('should return an updated user if the user already exists', async () => {
      mockingoose(userModel)
        .toReturn(testUser, 'findOne')
        .toReturn(testUser, 'findOneAndUpdate');
      const res = await userService.updateUser(testId, testUser);
      expect(res.firstname).toBe(testUser.firstname);
    });
  });
});