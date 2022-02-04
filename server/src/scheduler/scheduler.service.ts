// Bad approach, but done for brevity
import invoicesModel from "../invoices/invoices.model";
import { InvoiceStatus, HistoryItem } from "../invoices";

import * as winston from 'winston';

const logger = winston.loggers.get('app-logger');

const updateDueInvoices = async () => {

  const dueHistoryItem: HistoryItem = {
    status: InvoiceStatus.DUE,
    at: new Date()
  }

  await invoicesModel.updateMany({
    dueAt: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lt: new Date(new Date().setHours(23, 59, 59, 99))
    }
  },
  {
    $set: {
      $push: {
        history: {
          $each: dueHistoryItem,
          $position: 0
        }
      }
    }
  });
}

const updateLateInvoices = async () => {

  const lateHistoryItem: HistoryItem = {
    status: InvoiceStatus.PAST_DUE,
    at: new Date()
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await invoicesModel.updateMany({
    dueAt: {
      $gte: new Date(new Date(yesterday).setHours(0, 0, 0, 0)),
      $lt: new Date(new Date(yesterday).setHours(23, 59, 59, 99))
    }
  },
  {
    $set: {
      $push: {
        history: {
          $each: lateHistoryItem,
          $position: 0
        }
      }
    }
  });
}

export default async () => {
  try {
    await updateDueInvoices();
  }
  catch (e) {
    logger.error(e);
  }

  try {
    await updateLateInvoices();
  }
  catch (e) {
    logger.error(e);
  }
}