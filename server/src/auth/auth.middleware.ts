import { Jwt } from "./jwt";

export enum Header {
  AUTH = 'authorization'
}

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export class Auth {

  private jwt: Jwt;

  constructor() {
    this.jwt = new Jwt();
  }

  validateJwt() {
    return async (req, res, next) => {

      let valid = false;
      try {
        const token = this.getToken(req.headers);

        const user = await this.jwt.verify(token);
          
        req.user = user;
        valid = true;
      }
      catch (e) {
        console.error(e.message);
      }

      return valid ? next() : res.status(403).send('No token available.');
    }
  }

  hasPermission(required: string | string[]) {
    return (req, res, next) => {
      if (typeof required === 'string') {
        required = [required];
      }

      // Check needed permissions against user JWT claims.
      let hasAccess = required.some(role => role === req.user.role);

      return hasAccess ? next() : res.status(403).send('User is forbidden.')
    }
  }

  // Can only be used on routes with :id or :userId specified
  isUserOrAdmin() {
    return (req, res, next) => {
      let valid;
      let userId = req.params.id || req.params.userId;
      const userError = new Error('User is not admin or document owner.')

      if (req.user.role === Roles.ADMIN) {
        valid = true;
      }
      else if (!userId) {
        valid = false;
      }
      else if (userId === req.user.sub) {
        valid = true;
      }

      return valid ? next() : res.status(403).send(userError.message);
    }
  }

  private getToken(headers: any) {
    if (headers && headers[Header.AUTH]) {
      const auth = headers[Header.AUTH] 
        ? headers[Header.AUTH] 
        : headers[Header.AUTH.toLowerCase()];
      return auth.split(' ')[1];
    }
    else {
      throw new Error('Could not get a token from the request headers.');
    }
  }
}