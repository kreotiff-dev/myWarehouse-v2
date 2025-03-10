// routes/orders.js
import express from 'express';
import * as ordersController from '../controllers/orders.js';

const router = express.Router();

router.get('/', ordersController.getOrders);
router.post('/', ordersController.createOrder);
router.get('/:id', ordersController.getOrderById);
router.patch('/:id/status', ordersController.updateOrderStatus);
router.post('/:id/reserve', ordersController.reserveItems);

export default router;