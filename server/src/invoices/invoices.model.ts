import * as mongoose from 'mongoose';

import { Invoice } from '.';

// @ts-ignore
interface MongoInvoice extends Invoice, mongoose.Document {
}

const invoiceSchema: mongoose.Schema = new mongoose.Schema({
  name: String,
  dueAt: Date,
  userId: String,
  lineItems: [{
    name: String,
    description: String,
    hoursBilled: Number,
    billableRate: Number,
    cost: Number
  }],
  history: [{
    status: String,
    at: Date,
    notes: String
  }],
  payments: [{
    paymentAmount: Number,
    at: Date,
    notes: String
  }],
  v: Number
});

export default mongoose.model<MongoInvoice>('invoice', invoiceSchema);