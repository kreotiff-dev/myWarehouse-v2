import express from 'express';
import * as placementCartController from '../controllers/placementCart.js';

const router = express.Router();

router.post('/', placementCartController.createPlacementCart);

export default router;