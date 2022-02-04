import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import * as express from 'express';
import * as cors from 'cors';
import { json } from 'body-parser';
import * as path from 'path';

import * as winston from 'winston';
const logger = winston.loggers.add('app-logger', {
  level: config.logLevel,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
});

import config from './config';

import { initMongoConnection } from './mongo';

import authController from './auth/auth.controller';
import invoicesController from './invoices/invoices.controller';
import usersController from './users/users.controller';

(async () => {
  let app = express();

  app.use(express.static(path.join(__dirname, '..', '..', '..', 'build')))
  app.use(express.static('public'))

  app.use(cors());
  app.use(json());

  app.get('/liveness', (req, res) => res.json('ok'));
  app.get('/readiness', async (req, res) => {
    try {
      await initMongoConnection(); // Connect after startup
    }
    catch (e) {
      logger.error(e);
      return res.status(500).json(e.message);
    }

    res.json('ok');
  });

  app.use('/api', authController);
  app.use('/api', usersController);
  app.use('/api', invoicesController);

  app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '..', '..', '..', 'build', 'index.html'));
  });

  app.listen(config.port, () => {
    console.log("App running on port: ", config.port);
  });
})();