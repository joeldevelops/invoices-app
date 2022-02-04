export class Invoice {
  name: string;
  lineItems: [HoursLineItem & GoodsLineItem];
  dueAt: Date;
  history: [HistoryItem] // Includes created/updated timestamps
  userId: string; // Technically should be ObjectId type

  payments?: [PaymentItem]
  id?: string;
  v?: number;
}

export class InvoiceInput {
  name: string;
  lineItems: [HoursLineItem & GoodsLineItem];
  dueAt: Date;
}

export class InvoiceUpdate {
  dueAt?: Date;
  lineItems?: [HoursLineItem & GoodsLineItem];
  status?: InvoiceStatus;
}

export class HoursLineItem {
  name: string;
  description: string;
  hoursBilled: number;
  billableRate: number;
}

export class GoodsLineItem {
  name: string;
  description: string;
  cost: number;
}

export class HistoryItem {
  status: InvoiceStatus;

  // Looking at this field will tell you when the invoice was created or updated
  at: Date;
  notes?: string;
}

export class PaymentItem {
  paymentAmount: number;
  at: Date;
  notes?: string;
}

export enum InvoiceStatus {
  OPEN = 'open',
  PARTIAL_PAYMENT = 'partial payment',
  DUE = 'due',
  PAST_DUE = 'past due',
  COLLECTIONS = 'collections',
  PAID = 'paid',
  FORGIVEN = 'forgiven'
}

export const CLOSED_STATUSES = [
  InvoiceStatus.COLLECTIONS,
  InvoiceStatus.FORGIVEN,
  InvoiceStatus.PAID
]