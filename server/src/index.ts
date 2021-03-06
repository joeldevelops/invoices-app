import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import * as express from 'express';
import * as cors from 'cors';
import { json } from 'body-parser';
import * as path from 'path';
import { CronJob } from 'cron';

import config from './config';

import * as winston from 'winston';
const logger = winston.loggers.add('app-logger', {
  level: config.logLevel,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
});

import { initMongoConnection } from './mongo';

import authController from './auth/auth.controller';
import invoicesController from './invoices/invoices.controller';
import usersController from './users/users.controller';

import updateDailyInvoices from './scheduler/scheduler.service'

(async () => {
  let app = express();

  app.use(cors());
  app.use(json());

  app.get('/liveness', (req, res) => res.json('ok'));
  app.get('/readiness', async (req, res) => {
    try {
      await initMongoConnection(); // Connect after startup, should be the only point
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

  app.get('*', express.static(path.join(__dirname, '..', '..', '..', 'build')))
  app.get('*', express.static('public'))

  app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', '..', '..', 'build', 'index.html'));
  });

  app.listen(config.port, async() => {
    console.log("App running on port: ", config.port);

    await initMongoConnection(); // For ease of use

    await updateDailyInvoices(); // Also for ease of use

    // Job runs every night at midnight for that day
    let checkInvoiceJob = new CronJob('0 0 0 * * *', async () => {
      await updateDailyInvoices();
    }, null, true, 'America/New_York')
  });
})();