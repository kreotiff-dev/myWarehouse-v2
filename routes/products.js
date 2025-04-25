import express from 'express';
import * as productsController from '../controllers/products.js';
import { authMiddleware, workerRoleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authMiddleware);
// Доступ только для worker и admin
router.use(workerRoleMiddleware);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Получить список товаров
 *     description: Возвращает список всех товаров с возможностью фильтрации по категории и наличию на складе
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Фильтр по категории товаров
 *         example: "Электроника"
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Фильтр по наличию товаров на складе (true - только товары в наличии)
 *         example: true
 *     responses:
 *       200:
 *         description: Успешное получение списка товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', productsController.getProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Создать новый товар
 *     description: Добавляет новый товар в каталог продуктов
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sku
 *               - name
 *               - productId
 *             properties:
 *               sku:
 *                 type: string
 *                 description: Уникальный SKU товара
 *                 example: "PROD-001"
 *               productId:
 *                 type: string
 *                 description: Внешний идентификатор товара
 *                 example: "EXT-001"
 *               name:
 *                 type: string
 *                 description: Наименование товара
 *                 example: "Смартфон XYZ"
 *               barcode:
 *                 type: string
 *                 description: Штрихкод товара
 *                 example: "4607123456789"
 *               category:
 *                 type: string
 *                 description: Категория товара
 *                 example: "Электроника"
 *               dimensions:
 *                 type: object
 *                 description: Габариты товара
 *                 properties:
 *                   length:
 *                     type: number
 *                     description: Длина (см)
 *                     example: 15
 *                   width:
 *                     type: number
 *                     description: Ширина (см)
 *                     example: 7.5
 *                   height:
 *                     type: number
 *                     description: Высота (см)
 *                     example: 1.5
 *                   weight:
 *                     type: number
 *                     description: Вес (кг)
 *                     example: 0.2
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Неверные данные запроса или товар с таким SKU уже существует
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', productsController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     description: Возвращает подробную информацию о товаре, включая данные о запасах и расположении
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Успешное получение информации о товаре
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Product'
 *                 - type: object
 *                   properties:
 *                     stockQuantity:
 *                       type: number
 *                       description: Общее количество товара на складе
 *                       example: 25
 *                     locations:
 *                       type: array
 *                       description: Информация о размещении товара
 *                       items:
 *                         type: object
 *                         properties:
 *                           locationId:
 *                             type: string
 *                             example: "60d21b4667d0d8992e610c86"
 *                           quantity:
 *                             type: number
 *                             example: 10
 *                           locationInfo:
 *                             type: object
 *                             properties:
 *                               barcode:
 *                                 type: string
 *                                 example: "LOC-A01-01-01"
 *                               zone:
 *                                 type: string
 *                                 example: "A"
 *                               aisle:
 *                                 type: string
 *                                 example: "01"
 *                               rack:
 *                                 type: string
 *                                 example: "01"
 *                               level:
 *                                 type: string
 *                                 example: "01"
 *                               position:
 *                                 type: string
 *                                 example: "01"
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', productsController.getProductById);

/**
 * @swagger
 * /products/barcode/{barcode}:
 *   get:
 *     summary: Получить товар по штрихкоду
 *     description: Возвращает информацию о товаре по его штрихкоду
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: barcode
 *         required: true
 *         schema:
 *           type: string
 *         description: Штрихкод товара
 *         example: "4607123456789"
 *     responses:
 *       200:
 *         description: Успешное получение информации о товаре
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/barcode/:barcode', productsController.getProductByBarcode);

export default router;