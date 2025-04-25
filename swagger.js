import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import redoc from 'redoc-express';
import dotenv from 'dotenv';

// Загружаем переменные окружения на старте
dotenv.config();

// Определяем хост и протокол из переменных окружения
const DEFAULT_HOSTNAME = process.env.API_HOSTNAME || 'localhost:3000';
const DEFAULT_PROTOCOL = process.env.API_PROTOCOL || 'http';

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
        url: '{protocol}://{hostname}/wms/v1',
        description: 'API server',
        variables: {
          protocol: {
            enum: ['http', 'https'],
            default: DEFAULT_PROTOCOL
          },
          hostname: {
            default: DEFAULT_HOSTNAME
          }
        }
      },
    ],
    tags: [
      { name: 'Auth', description: 'Авторизация и управление пользователями' },
      { name: 'Inventory', description: 'Операции с товарными запасами' },
      { name: 'Locations', description: 'Управление ячейками склада' },
      { name: 'Orders', description: 'Работа с заказами' },
      { name: 'Picking', description: 'Процесс сборки заказов' },
      { name: 'Packing', description: 'Процесс упаковки заказов' },
      { name: 'Receiving', description: 'Приёмка товаров' },
      { name: 'Products', description: 'Управление каталогом товаров' },
      { name: 'Shipping', description: 'Отправка заказов' },
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

// Функция для генерации спецификации с учетом текущего хоста
function generateSpecs(req) {
  // Используем значения из запроса, если доступны, или из переменных окружения
  const hostname = req?.apiHostname || DEFAULT_HOSTNAME;
  const protocol = req?.apiProtocol || DEFAULT_PROTOCOL;
  
  console.log(`Generating Swagger specs with hostname: ${hostname}, protocol: ${protocol}`);
  
  // Клонируем опции и обновляем hostname и protocol
  const currentOptions = JSON.parse(JSON.stringify(options));
  currentOptions.definition.servers[0].variables.hostname.default = hostname;
  currentOptions.definition.servers[0].variables.protocol.default = protocol;
  
  return swaggerJsdoc(currentOptions);
}

// Предварительная генерация для экспорта с использованием значений по умолчанию
const specs = swaggerJsdoc(options);

// Функция настройки для приложения Express
export function setupApiDocs(app) {
  // Предоставление JSON-спецификации для Redoc с учетом текущего хоста
  app.get('/api-docs/swagger.json', (req, res) => {
    const currentSpecs = generateSpecs(req);
    res.json(currentSpecs);
  });
  
  // Маршрут для Swagger UI
  app.use('/api-docs/swagger', swaggerUi.serve, (req, res) => {
    const currentSpecs = generateSpecs(req);
    const uiHtml = swaggerUi.generateHTML(currentSpecs);
    res.send(uiHtml);
  });
  
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