import { Router } from 'express';

import { Auth, Roles } from '../auth';

import { Invoice, InvoiceInput, InvoiceUpdate } from '.';
import * as invoicesService from './invoices.service';

const auth = new Auth();
const router = Router();

router.use(auth.validateJwt());

router.get('/v1.0/invoices', 
  auth.hasPermission([Roles.ADMIN, Roles.USER]),
  async (req: any, res) => {
    const userId: string = req.user.sub;

    let invoices;
    try {
      invoices = await invoicesService.getInvoicesByUser(userId);
    }
    catch (e) {
      return res.status(500).json('An error occurred when getting invoices.')
    }
      
    return res.json(invoices);
  }
);

router.get('/v1.0/invoices/:id', 
  auth.hasPermission([Roles.ADMIN, Roles.USER]),
  async (req, res) => {
    let invoice;
    try {
      invoice = await invoicesService.getInvoiceById(req.params.id);
    }
    catch (e) {
      return res.status(500).json('An error occurred when getting invoice by ID.')
    }

    return res.json(invoice);
  }
);

router.post('/v1.0/invoices/:id/pay', 
  auth.hasPermission([Roles.ADMIN, Roles.USER]),
  async (req: any, res) => {
    const userId: string = req.user.sub;
    const { invoiceId, paymentAmount } = req.body;

    let paidInvoice;
    try {
      paidInvoice = await invoicesService.payInvoice(invoiceId, paymentAmount);
    }
    catch (e) {
      return res.status(500).json('An error occurred when paying invoice.')
    }

    return res.status(200).json({ invoiceId: paidInvoice.id });
  }
)

router.post('/v1.0/invoices', 
  auth.hasPermission([Roles.ADMIN]),
  async (req: any, res) => {
    const userId: string = req.user.sub;
    const invoice: InvoiceInput = req.body;

    let newInvoice;
    try {
      newInvoice = await invoicesService.addInvoice(userId, invoice);
    }
    catch (e) {
      return res.status(500).json('An error occurred when creating the invoice.')
    }

    return res.status(201).json({ invoiceId: newInvoice.id });
  }
);

router.put('/v1.0/invoices', 
  auth.hasPermission([Roles.ADMIN, Roles.USER]),
  async (req: any, res) => {
    const userId: string = req.user.sub;
    const updates: InvoiceUpdate = req.body;

    let updatedInvoice;
    try {
      updatedInvoice = await invoicesService.updateInvoice(userId, updates);
    }
    catch (e) {
      return res.status(500).json('An error occurred when updating the invoice.')
    }

    return res.status(201).json({ invoiceId: updatedInvoice.id });
  }
);

export default router;