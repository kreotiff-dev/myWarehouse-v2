// routes/pickingCarts.js
import express from 'express';
import * as pickingCartsController from '../controllers/pickingCart.js';

const router = express.Router();

router.get('/', pickingCartsController.getPickingCarts);
router.post('/', pickingCartsController.createPickingCart);
router.get('/:id', pickingCartsController.getPickingCartById);
router.patch('/:id/status', pickingCartsController.updatePickingCartStatus);

export default router;