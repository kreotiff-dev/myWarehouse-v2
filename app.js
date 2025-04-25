import express from 'express';
import dotenv from 'dotenv';
import receivingRoutes from './routes/receiving.js';
import locationsRoutes from './routes/locations.js';
import placementCartRoutes from './routes/placementCarts.js';
import inventoryRoutes from './routes/inventory.js';
import productsRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import pickingRoutes from './routes/picking.js';
import pickingCartRoutes from './routes/pickingCarts.js';
import packingRoutes from './routes/packing.js';
import shippingRoutes from './routes/shipping.js';
import { setupApiDocs } from './swagger.js';

// Загружаем переменные окружения
dotenv.config();

const app = express();

app.use(express.json());

// Определяем текущий домен из окружения или используем дефолтный
const hostname = process.env.API_HOSTNAME;
const protocol = process.env.API_PROTOCOL;

console.log(`API will be served at ${protocol}://${hostname}`);

// Устанавливаем middleware для указания hostname в swagger
app.use((req, res, next) => {
  req.apiHostname = hostname;
  req.apiProtocol = protocol;
  next();
});

setupApiDocs(app);

// Убираем повторный вызов express.json()
// app.use(express.json()); - дублирование, уже есть в начале

app.use('/wms/v1/receiving', receivingRoutes);
app.use('/wms/v1/locations', locationsRoutes);
app.use('/wms/v1/placement-carts', placementCartRoutes);
app.use('/wms/v1/inventory', inventoryRoutes);
app.use('/wms/v1/products', productsRoutes);
app.use('/wms/v1/orders', ordersRoutes);
app.use('/wms/v1/picking', pickingRoutes);
app.use('/wms/v1/picking-carts', pickingCartRoutes);
app.use('/wms/v1/packing', packingRoutes);
app.use('/wms/v1/shipping', shippingRoutes);

export default app;