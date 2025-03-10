import express from 'express';
import * as productsController from '../controllers/products.js';

const router = express.Router();

// Базовые маршруты для товаров
router.get('/', productsController.getProducts);
router.post('/', productsController.createProduct);
router.get('/:id', productsController.getProductById);
router.get('/barcode/:barcode', productsController.getProductByBarcode);

export default router;