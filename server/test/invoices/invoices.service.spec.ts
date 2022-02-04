import * as invoiceService from '../../src/invoices/invoices.service';
import invoicesModel from '../../src/invoices/invoices.model';
import { InvoiceClosedError } from '../../src/invoices';

import * as mockingoose from 'mockingoose';

const testInvoice = {
  name: 'Bill for Housekeeping',
  lineItems: [],
  dueAt: new Date('10-02-2022'),
  userId: '42'
}
const testInvoiceWithHistory = {
  name: 'Bill for construction costs',
  lineItems: [{
    name: 'Hammer',
    cost: 2.5
  }],
  dueAt: new Date('10-03-2022'),
  userId: '42',
  history: [{
    status: 'open',
    at: new Date()
  }]
}
const testClosedInvoice = {
  name: 'Bill for groceries',
  lineItems: [{
    name: 'Orange',
    cost: 2.5
  }],
  history: [{
    status: 'paid',
    at: new Date()
  }]
}
const testId = '42';
const testUserId = 'youcancallmeAl'

describe('invoices.service.ts', () => {

  describe('getInvoiceByUser', () => {

    test('should return multiple invoice documents from the model based on user', async () => {
      mockingoose(invoicesModel).toReturn([testInvoice], 'find');
      const res = await invoiceService.getInvoicesByUser(testUserId);
      expect(res[0].name).toBe(testInvoice.name);
    });
  });

  describe('getLateInvoiceByUser', () => {

    test('should return multiple late invoice documents from the model based on user', async () => {
      mockingoose(invoicesModel).toReturn([testInvoice], 'find');
      const res = await invoiceService.getLateInvoicesByUser(testUserId);
      expect(res[0].name).toBe(testInvoice.name);
    });
  });

  describe('getInvoiceById', () => {

    test('should return an invoice document from the model', async () => {
      mockingoose(invoicesModel).toReturn(testInvoice, 'findOne');
      const res = await invoiceService.getInvoiceById(testId);
      expect(res.name).toBe(testInvoice.name);
    });
  });

  describe('addInvoice', () => {

    test('should create a new invoice and fill out the first history element', async () => {
      mockingoose(invoicesModel).toReturn(testInvoiceWithHistory, 'create');
      const res = await invoiceService.addInvoice(testUserId, testInvoiceWithHistory as any);
      expect(res.name).toBe(testInvoiceWithHistory.name);
      expect(res.history[0].status).toBe('open')
    });
  });

  describe('updateInvoice', () => {

    test('should return an updated invoice', async () => {
      mockingoose(invoicesModel).toReturn(testInvoice, 'findOneAndUpdate');
      const res = await invoiceService.updateInvoice(testId, testInvoice);
      expect(res.name).toBe(testInvoice.name);
    });
  });

  describe('payInvoice', () => {

    test('should throw an error when trying to pay a closed invoice', async () => {
      mockingoose(invoicesModel).toReturn(testClosedInvoice, 'findOne');

      let error;
      try {
        await invoiceService.payInvoice(testId, 3.0);
      }
      catch (e) {
        error = e;
      }

      expect(error instanceof InvoiceClosedError).toBe(true);
    });

    test('should call update invoice and add the payment status update', async () => {
      mockingoose(invoicesModel)
        .toReturn(testInvoiceWithHistory, 'findOne')
        .toReturn(testInvoiceWithHistory, 'findOneAndUpdate');

      const res = await invoiceService.payInvoice(testId, 3.0);

      expect(res.name).toBe(testInvoiceWithHistory.name);
    });
  });

});