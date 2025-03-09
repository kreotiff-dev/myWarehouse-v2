import express from 'express';
import receivingRoutes from './routes/receiving.js';
import locationsRoutes from './routes/locations.js';

const app = express();

app.use(express.json());
app.use('/wms/v1/receiving', receivingRoutes);
app.use('/wms/v1/locations', locationsRoutes);

export default app;