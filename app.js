import express from 'express';
import receivingRoutes from './routes/receiving.js';

const app = express();

app.use(express.json());
app.use('/wms/v1/receiving', receivingRoutes);

export default app;