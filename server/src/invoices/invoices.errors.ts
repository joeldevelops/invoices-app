export class InvoiceClosedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvoiceClosedError';
  }
}