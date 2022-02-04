import * as mongoose from 'mongoose';
import * as winston from 'winston';

import config from '../config';

const logger = winston.loggers.get('app-logger');

let mongoUri;

if (config.mongo.connectionString) {
  mongoUri = config.mongo.connectionString;
}
else {
  mongoUri = `mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.database}`;
}

let connection = null;

export const initMongoConnection = async () => {
  try {
    if (!connection) {
      connection = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
  }
  catch (e) {
    connection = null;
    throw new Error(e.message); // Bubble up
  }
}