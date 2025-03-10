import express from 'express';
import * as locationsController from '../controllers/locations.js';

const router = express.Router();

router.get('/', locationsController.getLocations);
router.get('/:id', locationsController.getLocationById);
router.post('/', locationsController.createLocation);

export default router;