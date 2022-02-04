import {
  CLOSED_STATUSES,
  GoodsLineItem,
  HistoryItem,
  HoursLineItem,
  Invoice,
  InvoiceClosedError,
  InvoiceInput,
  InvoiceStatus,
  PaymentItem
} from '.';
import invoices from './invoices.model';

export const calculateTotal = (lineItems: [HoursLineItem & GoodsLineItem]): number =>  {
  let total = 0;
  lineItems.forEach(item => {
    if (item.billableRate) {
      total += (item.billableRate * item.hoursBilled);
    }
    else if (item.cost) {
      total += item.cost;
    }
  });

  // Taxes could be calculated here

  return total;
}

export const getInvoicesByUser = async (userId: string): Promise<Invoice[]> => {
  return invoices.find({ userId });
};

export const getLateInvoicesByUser = async (userId: string): Promise<Invoice[]> => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return invoices.find({
    userId,
    dueAt: {
      $lte: new Date(new Date(yesterday).setHours(23, 59, 59, 99))
    }
  });
};

export const getInvoiceById = async (invoiceId: string): Promise<Invoice> => {
  return invoices.findOne({ _id: invoiceId });
};

export const addInvoice = async (userId: string, invoiceInput: InvoiceInput): Promise<Invoice> => {
  const invoice: Invoice = invoiceInput as any;
  invoice.userId = userId;
  invoice.dueAt = new Date(invoice.dueAt);

  const initialHistory: HistoryItem = {
    status: InvoiceStatus.OPEN,
    at: new Date()
  }

  invoice.history = [initialHistory];

  const newInvoice = await invoices.create(invoice);

  // email logic would go here. Something like nodemailer could work but should be separate service.

  return newInvoice;
};

export const updateInvoice = async (id: string, updates: any): Promise<Invoice> => {
  return invoices.findOneAndUpdate({ _id: id }, updates);
}

export const payInvoice = async (id: string, paymentAmount: number): Promise<Invoice> => {
  const invoice: Invoice = await invoices.findById(id);

  const invoiceClosed = (CLOSED_STATUSES.includes(invoice.history[0].status));
  if (invoiceClosed) {
    throw new InvoiceClosedError(
      `User is trying to pay closed invoice in state: ${invoice.history[0].status}`
    );
  }

  const total = calculateTotal(invoice.lineItems);
  const currentTime = new Date();

  const payment: PaymentItem = {
    paymentAmount,
    at: currentTime
  }

  if (invoice.payments) {
    invoice.payments.push(payment);
  }
  else {
    invoice.payments = [payment];
  }

  const payHistory: HistoryItem = {
    // If payment is not for the full amount then update the invoice and exit.
    status: (paymentAmount < total) ? InvoiceStatus.PARTIAL_PAYMENT : InvoiceStatus.PAID,
    at: currentTime
  }

  // Insert at beginning
  invoice.history.unshift(payHistory);

  const updated = await updateInvoice(id, invoice);
  return updated;
}