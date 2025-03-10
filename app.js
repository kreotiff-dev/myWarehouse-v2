import express from 'express';
import receivingRoutes from './routes/receiving.js';
import locationsRoutes from './routes/locations.js';
import placementCartRoutes from './routes/placementCarts.js';
import inventoryRoutes from './routes/inventory.js';

const app = express();

app.use(express.json());
app.use('/wms/v1/receiving', receivingRoutes);
app.use('/wms/v1/locations', locationsRoutes);
app.use('/wms/v1/placement-carts', placementCartRoutes);
app.use('/wms/v1/inventory', inventoryRoutes);

export default app;