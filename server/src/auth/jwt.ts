import * as jwt from 'jsonwebtoken';
import config from '../config';

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
      console.error(e.message);
      throw new Error("Could not decode or verify token.");
    }
    return decoded;
  }
}