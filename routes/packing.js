// routes/packing.js
import express from 'express';
import * as packingController from '../controllers/packing.js';

const router = express.Router();

router.get('/', packingController.getPackingTasks);
router.post('/', packingController.createPackingTask);
router.get('/:id', packingController.getPackingTaskById);
router.post('/:id/start', packingController.startPackingTask);
router.post('/:id/complete', packingController.completePackingTask);

export default router;