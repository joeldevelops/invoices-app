import * as mongoose from 'mongoose';

import { User } from '.';

// @ts-ignore
export interface MongoUser extends User, mongoose.Document {
}

const userSchema: mongoose.Schema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  role: String
});

export default mongoose.model<MongoUser>('user', userSchema);