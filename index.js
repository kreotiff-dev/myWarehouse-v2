import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Documentation (Redoc): http://localhost:${PORT}/api-docs`);
      console.log(`API Documentation (Swagger UI): http://localhost:${PORT}/api-docs/swagger`);
      console.log(`Postman Examples Demo: http://localhost:${PORT}/api-docs/examples`);
      console.log(`Идеальный полигон для изучения API тестирования!`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();