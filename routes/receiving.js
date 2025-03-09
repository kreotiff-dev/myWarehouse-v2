import express from 'express';
import * as receivingController from '../controllers/receiving.js';

const router = express.Router();

router.get('/invoices', receivingController.getInvoices);
router.post('/invoices', receivingController.createInvoice);
router.post('/invoices/:invoiceId/scan', receivingController.scanInvoice);
router.post('/invoices/:invoiceId/items/:itemId/scan', receivingController.scanItem);
router.post('/invoices/:invoiceId/items/:itemId/count', receivingController.countItem);
router.post('/invoices/:invoiceId/complete', receivingController.completeInvoice);

export default router;