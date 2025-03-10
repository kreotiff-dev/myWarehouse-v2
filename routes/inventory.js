import express from 'express';
import * as inventoryController from '../controllers/inventory.js';

const router = express.Router();

router.get('/', inventoryController.getInventory);
router.post('/invoices/:invoiceId/items/:itemId/place', inventoryController.placeItem);

export default router;