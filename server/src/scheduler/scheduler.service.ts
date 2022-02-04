// Bad approach, but done for brevity
import invoicesModel from "../invoices/invoices.model";
import { InvoiceStatus, HistoryItem } from "../invoices";

import * as winston from 'winston';

const logger = winston.loggers.get('app-logger');

const updateDueInvoices = async (): Promise<void> => {

  const dueHistoryItem: HistoryItem = {
    status: InvoiceStatus.DUE,
    at: new Date()
  }

  // Only update for items due today
  await invoicesModel.updateMany({
    dueAt: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lt: new Date(new Date().setHours(23, 59, 59, 99))
    }
  },
  {
    $push: {
      history: {
        $each: [dueHistoryItem],
        $position: 0
      }
    }
  });
}

const updateLateInvoices = async (): Promise<void> => {

  const lateHistoryItem: HistoryItem = {
    status: InvoiceStatus.PAST_DUE,
    at: new Date()
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Only update for items due yesterday
  await invoicesModel.updateMany({
    dueAt: {
      $gt: new Date(new Date(yesterday).setHours(0, 0, 0, 0)),
      $lt: new Date(new Date(yesterday).setHours(23, 59, 59, 99))
    }
  },
  {
    $push: {
      history: {
        $each: [lateHistoryItem],
        $position: 0
      },
    }
  });
}

// This function should kick off a process to notify a user via
// an email that their invoice is due or late.
export default async (): Promise<void> => {
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