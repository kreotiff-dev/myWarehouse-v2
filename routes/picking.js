import express from 'express';
import * as pickingController from '../controllers/picking.js';

const router = express.Router();

router.get('/', pickingController.getPickingTasks);
router.post('/', pickingController.createPickingTask);
router.post('/:id/start', pickingController.startPickingTask);
router.post('/:id/scan-location', pickingController.scanLocation);
router.post('/:id/pick', pickingController.pickItem);

export default router;