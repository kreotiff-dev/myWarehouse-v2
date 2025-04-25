// routes/orders.js
import express from 'express';
import * as ordersController from '../controllers/orders.js';
import { authMiddleware, workerRoleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authMiddleware);
// Доступ только для worker и admin
router.use(workerRoleMiddleware);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Получить список заказов
 *     description: Возвращает список заказов с возможностью фильтрации по статусу
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, processing, picking, picked, packed, shipped, delivered, cancelled]
 *         description: Фильтр по статусу заказа
 *     responses:
 *       200:
 *         description: Успешное получение списка заказов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', ordersController.getOrders);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Создать новый заказ
 *     description: Создает новый заказ в системе с указанными товарами
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderNumber
 *               - items
 *             properties:
 *               orderNumber:
 *                 type: string
 *                 description: Уникальный номер заказа
 *                 example: "ORD-12345"
 *               externalOrderId:
 *                 type: string
 *                 description: Внешний идентификатор заказа
 *                 example: "EXT-12345"
 *               customer:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Иван Иванов"
 *                   address:
 *                     type: string
 *                     example: "г. Москва, ул. Примерная, д.1"
 *                   phone:
 *                     type: string
 *                     example: "+7 999 123-45-67"
 *                   email:
 *                     type: string
 *                     example: "example@example.com"
 *               priority:
 *                 type: number
 *                 description: Приоритет заказа (выше число = выше приоритет)
 *                 example: 1
 *               items:
 *                 type: array
 *                 description: Список товаров заказа
 *                 items:
 *                   type: object
 *                   required:
 *                     - sku
 *                     - quantity
 *                   properties:
 *                     sku:
 *                       type: string
 *                       description: SKU товара
 *                       example: "PROD-001"
 *                     quantity:
 *                       type: number
 *                       description: Количество товара
 *                       example: 2
 *     responses:
 *       201:
 *         description: Заказ успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Неверные данные запроса
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
router.post('/', ordersController.createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Получить заказ по ID
 *     description: Возвращает подробную информацию о конкретном заказе
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID заказа
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Успешное получение информации о заказе
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Заказ не найден
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
router.get('/:id', ordersController.getOrderById);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Обновить статус заказа
 *     description: Изменяет статус указанного заказа
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID заказа
 *         example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 description: Новый статус заказа
 *                 enum: [new, processing, picking, picked, packed, shipped, delivered, cancelled]
 *                 example: "picking"
 *     responses:
 *       200:
 *         description: Статус заказа успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Неверные данные запроса
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Заказ не найден
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
router.patch('/:id/status', ordersController.updateOrderStatus);

/**
 * @swagger
 * /orders/{id}/reserve:
 *   post:
 *     summary: Резервировать товары для заказа
 *     description: Резервирует товары на складе для выполнения заказа
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID заказа
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Товары успешно зарезервированы
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Items reserved successfully"
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sku:
 *                         type: string
 *                         example: "PROD-001"
 *                       required:
 *                         type: number
 *                         example: 2
 *                       available:
 *                         type: number
 *                         example: 10
 *                       status:
 *                         type: string
 *                         example: "reserved"
 *       400:
 *         description: Ошибка резервирования или недостаточно товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Insufficient inventory for some items"
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sku:
 *                         type: string
 *                       required:
 *                         type: number
 *                       available:
 *                         type: number
 *                       status:
 *                         type: string
 *                         example: "insufficient"
 *       404:
 *         description: Заказ не найден
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
router.post('/:id/reserve', ordersController.reserveItems);

export default router;