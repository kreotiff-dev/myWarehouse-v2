// routes/shipping.js
import express from 'express';
import * as shippingController from '../controllers/shipping.js';

const router = express.Router();

router.get('/', shippingController.getShippingTasks);
router.post('/', shippingController.createShippingTask);
router.get('/:id', shippingController.getShippingTaskById);
router.post('/:id/start', shippingController.startShippingTask);
router.post('/:id/complete', shippingController.completeShippingTask);
router.post('/:id/cancel', shippingController.cancelShippingTask);

export default router;