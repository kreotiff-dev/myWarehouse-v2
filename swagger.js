import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import redoc from 'redoc-express';

// Получаем значения из переменных окружения
const DEFAULT_PROTOCOL = process.env.API_PROTOCOL || 'http';
const DEFAULT_HOSTNAME = process.env.API_HOSTNAME || 'localhost:3001';
const currentVersion = process.env.npm_package_version || '1.0.0';
const versionDate = new Date().toISOString().split('T')[0];

// Опции для Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🚀 WMS API - Идеальный полигон для изучения API тестирования',
      version: `${currentVersion} (${versionDate})`,
      description: `🚀 **WMS API — Полигон для изучения API тестирования**

Реальная бизнес-система для практики тестирования API

## 🎯 Что ты получишь, изучая это API:

📦 **Реальные бизнес-процессы**
Складские операции, управление товарами, обработка заказов

🔧 **Сложные workflow'ы**
От приёма товара до отгрузки заказа

✅ **Аутентификация**
JWT токены, роли пользователей

🔍 **Валидация данных**
Проверка корректности входящих параметров

## 📚 Документация и обучение

📖 **Подробнее о процессах:** [Читай документацию WMS](https://evgenii-sychev.gitbook.io/evgenii-sychev-learning-qa/)

**Для корректного прохождения процессов важно изучать документацию. Если сталкиваетесь с трудностями - обратитесь к документации!**

## 🎓 Курс Postman - с нуля до профи!

🔥 **Хочешь стать экспертом по API тестированию?** У меня есть полноценный курс по Postman!

📚 **Курс Postman:** [https://qa-study.ru/postman](https://qa-study.ru/postman)

**Научись автоматизировать рутинные задачи и писать автотесты в Postman!**

## 📞 Контакты и ресурсы

📱 **Телеграм:** [@EugSych](https://t.me/EugSych)
📺 **Канал:** [@pro_mir_it](https://t.me/pro_mir_it)

---

🎯 Этот API специально подготовлен для обучения тестированию. Все endpoint'ы работают и готовы к изучению!`,
      contact: {
        name: 'Евгений Сычёв',
        url: 'https://qa-study.ru/postman',
        email: 'admin@testerhub.ru',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'https://sklad.testerhub.ru/wms/v1',
        description: 'Локальная разработка'
      }
    ],
    tags: [
      { name: 'Auth', description: 'Авторизация и управление пользователями' },
      { name: 'Inventory', description: 'Операции с товарными запасами' },
      { name: 'Locations', description: 'Управление ячейками склада' },
      { name: 'Orders', description: 'Работа с заказами' },
      { name: 'Picking', description: 'Процесс сборки заказов' },
      { name: 'PickingCarts', description: 'Управление тележками сборки' },
      { name: 'Packing', description: 'Процесс упаковки заказов' },
      { name: 'PlacementCarts', description: 'Управление тележками размещения' },
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

// Функция для генерации спецификации
function generateSpecs() {
  return swaggerJsdoc(options);
}

// Предварительная генерация для экспорта с использованием значений по умолчанию
const specs = swaggerJsdoc(options);

// Функция настройки API документации
export function setupApiDocs(app) {
  // Маршрут для получения JSON спецификации
  app.get('/api-docs/swagger.json', (req, res) => {
    const currentSpecs = generateSpecs();
    res.json(currentSpecs);
  });

  // Маршрут для Swagger UI
  app.use('/api-docs/swagger', swaggerUi.serve);
  app.get('/api-docs/swagger', swaggerUi.setup(generateSpecs(), {
      customCss: `
        .swagger-ui .info {
          background: #ffffff;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 25px;
          border: 1px solid #e9ecef;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        /* Заголовок - простой черный текст */
        .swagger-ui .info .title {
          color: #000000 !important;
          font-size: 2em !important;
          text-align: center;
          margin-bottom: 20px;
          font-weight: 600;
        }
        
        /* Описание - простой черный текст */
        .swagger-ui .info .description {
          color: #000000 !important;
          font-size: 1em;
          line-height: 1.6;
        }
        
        /* Версия API - простой дизайн */
        .swagger-ui .info .version {
          color: #6c757d !important;
          font-weight: 500;
          background: #f8f9fa;
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid #dee2e6;
          display: inline-block;
          margin: 10px 0;
        }
        
        /* Заголовки - простой дизайн */
        .swagger-ui .info .description h1,
        .swagger-ui .info .description h2,
        .swagger-ui .info .description h3 {
          color: #000000 !important;
          border-bottom: 1px solid #dee2e6;
          padding-bottom: 8px;
          margin-top: 25px;
          margin-bottom: 15px;
          font-weight: 600;
        }
        
        .swagger-ui .info .description h1 {
          font-size: 1.6em;
          text-align: center;
          color: #000000 !important;
        }
        
        .swagger-ui .info .description h2 {
          font-size: 1.4em;
          color: #495057 !important;
        }
        
        .swagger-ui .info .description h3 {
          font-size: 1.2em;
          color: #6c757d !important;
        }
        
        /* Списки - простой дизайн */
        .swagger-ui .info .description ul,
        .swagger-ui .info .description ol {
          background: #f8f9fa;
          padding: 15px 25px;
          border-radius: 8px;
          margin: 15px 0;
          border: 1px solid #e9ecef;
        }
        
        .swagger-ui .info .description li {
          margin: 8px 0;
          color: #495057;
        }
        
        /* Выделенный текст */
        .swagger-ui .info .description strong {
          color: #495057;
          font-weight: 600;
        }
        
        .swagger-ui .info .description em {
          color: #6c757d;
          font-style: italic;
        }
        
        /* Ссылки - простой дизайн */
        .swagger-ui .info .description a {
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid #007bff;
          transition: all 0.2s ease;
        }
        
        .swagger-ui .info .description a:hover {
          color: #0056b3;
          border-bottom-color: #0056b3;
        }
        
        /* Разделители */
        .swagger-ui .info .description hr {
          border: none;
          height: 1px;
          background: #dee2e6;
          margin: 25px 0;
        }
        
        /* Секции эндпоинтов - простой дизайн */
        .swagger-ui .opblock-tag {
          background: #f8f9fa !important;
          color: #495057 !important;
          border-radius: 8px !important;
          margin: 15px 0 !important;
          padding: 15px 20px !important;
          border: 1px solid #dee2e6 !important;
        }
        
        .swagger-ui .opblock-tag .opblock-tag-section {
          color: #495057 !important;
          font-weight: 600 !important;
          font-size: 1.1em !important;
        }
        
        /* Контактная информация - скрываем некрасивую */
        .swagger-ui .info .contact {
          display: none !important;
        }
        
        /* Схема */
        .swagger-ui .scheme-container {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          border: 1px solid #dee2e6;
        }
      `,
      customSiteTitle: '🚀 WMS API - Идеальный полигон для изучения API тестирования',
      customfavIcon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDJMMjggMTZMMTYgMzBMMCAxNkwxNiAyWiIgZmlsbD0iIzY2N0VlQSIvPgo8L3N2Zz4K',

      swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showRequestHeaders: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
        requestInterceptor: (req) => {
          // Добавляем заголовок для отслеживания
          req.headers['X-API-Testing-Course'] = 'Postman from zero to pro';
          return req;
        }
      }
    }));
  
  // Маршрут для Redoc
  app.get('/api-docs', redoc({
    title: '🚀 WMS API - Идеальный полигон для изучения API тестирования',
    specUrl: '/api-docs/swagger.json',
    redocOptions: {
      theme: { 
        colors: { primary: { main: '#007bff' } },
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
