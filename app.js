import express from 'express';
import receivingRoutes from './routes/receiving.js';
import locationsRoutes from './routes/locations.js';
import placementCartRoutes from './routes/placementCarts.js';
import inventoryRoutes from './routes/inventory.js';
import productsRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import pickingRoutes from './routes/picking.js';

const app = express();

app.use(express.json());
app.use('/wms/v1/receiving', receivingRoutes);
app.use('/wms/v1/locations', locationsRoutes);
app.use('/wms/v1/placement-carts', placementCartRoutes);
app.use('/wms/v1/inventory', inventoryRoutes);
app.use('/wms/v1/products', productsRoutes);
app.use('/wms/v1/orders', ordersRoutes);
app.use('/wms/v1/picking', pickingRoutes);

export default app;