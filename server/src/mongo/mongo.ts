import * as mongoose from 'mongoose';

import config from '../config';

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
    console.error(e);
    connection = null;
  }
}