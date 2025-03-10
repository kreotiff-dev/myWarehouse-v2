import express from 'express';
import * as receivingController from '../controllers/receiving.js';

const router = express.Router();

router.get('/', receivingController.getInvoices);
router.post('/', receivingController.createInvoice);
router.post('/:invoiceId/scan', receivingController.scanInvoice);
router.post('/:invoiceId/items/:itemId/scan', receivingController.scanItem);
router.post('/:invoiceId/items/:itemId/count', receivingController.countItem); // Добавлено
router.post('/:invoiceId/complete', receivingController.completeInvoice);

export default router;