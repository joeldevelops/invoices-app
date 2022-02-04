import * as jwt from 'jsonwebtoken';
import * as winston from 'winston';
import config from '../config';

const logger = winston.loggers.get('app-logger');

export class Jwt {
  private key: string;

  // Key should come from a key gen service. It should change every few hours.
  constructor() {
    this.key = config.auth.privateKey;
  }

  // TODO: Map decoded values to user info
  async verify(token: string) {
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        this.key,
        {
          clockTolerance: 3,
        })
    }
    catch (e) {
      logger.debug(e.message);
      throw new Error("Could not decode or verify token.");
    }
    return decoded;
  }
}