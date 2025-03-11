import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import redoc from 'redoc-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WMS API',
      version: '1.0.0',
      description: 'API документация системы управления складом',
      contact: {
        name: 'API Support',
        email: 'support@wms-system.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/wms/v1',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Inventory', description: 'Операции с товарными запасами' },
      { name: 'Locations', description: 'Управление ячейками склада' },
      { name: 'Orders', description: 'Работа с заказами' },
      { name: 'Picking', description: 'Процесс сборки заказов' },
      { name: 'Packing', description: 'Процесс упаковки заказов' },
      { name: 'Receiving', description: 'Приёмка товаров' },
      { name: 'Products', description: 'Управление каталогом товаров' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js', './models/*.js', './schemas.js'],
};

// Генерация спецификации
const specs = swaggerJsdoc(options);

// Функция настройки для приложения Express
export function setupApiDocs(app) {
  // Предоставление JSON-спецификации для Redoc
  app.get('/api-docs/swagger.json', (req, res) => {
    res.json(specs);
  });
  
  // Маршрут для Swagger UI
  app.use('/api-docs/swagger', swaggerUi.serve, swaggerUi.setup(specs));
  
  // Маршрут для Redoc
  app.get('/api-docs', redoc({
    title: 'WMS API Documentation',
    specUrl: '/api-docs/swagger.json',
    redocOptions: {
      theme: { 
        colors: { primary: { main: '#2c974b' } },
        typography: { fontSize: '16px' }
      }
    }
  }));
  
  
  return specs;
}

export default {
  specs,
  setupApiDocs
};