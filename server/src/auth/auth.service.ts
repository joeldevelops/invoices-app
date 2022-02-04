import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { LoginInfo } from "."
import * as userService from '../users/users.service';

import config from '../config';

export const comparePassword = async (login: LoginInfo): Promise<string> => {
  const user = await userService.getUserByEmail(login.email);
  if (!user) {
    throw new Error('Incorrect email');
  }

  const validPassword = await bcrypt.compare(login.password, user.password);
  if (!validPassword) {
    throw new Error('Incorrect password');
  }
  
  const issuedAt = Date.now();
  const payload = {
    iat: issuedAt,
    name: user.firstname + " " + user.lastname,
    role: user.role
  };
  const key = config.auth.privateKey;
  const options: jwt.SignOptions = {
    expiresIn: 43200000,
    subject: user.id
  }

  const token = jwt.sign(payload, key, options);
  return token;
}