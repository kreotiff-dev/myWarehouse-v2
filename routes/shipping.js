// routes/shipping.js
import express from 'express';
import * as shippingController from '../controllers/shipping.js';
import { authMiddleware, workerRoleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authMiddleware);
// Доступ только для worker и admin
router.use(workerRoleMiddleware);

/**
 * @swagger
 * /shipping:
 *   get:
 *     summary: Получить список заданий на отправку
 *     description: Возвращает список всех заданий на отправку товаров с возможностью фильтрации по статусу
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [created, in_progress, completed, cancelled]
 *         description: Фильтр по статусу задания на отправку
 *     responses:
 *       200:
 *         description: Успешное получение списка заданий на отправку
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShippingTask'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', shippingController.getShippingTasks);

/**
 * @swagger
 * /shipping:
 *   post:
 *     summary: Создать задание на отправку
 *     description: Создает новое задание на отправку для указанных заказов
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderIds
 *             properties:
 *               orderIds:
 *                 type: array
 *                 description: Список ID заказов для отправки
 *                 items:
 *                   type: string
 *                   example: "60d21b4667d0d8992e610c85"
 *               carrier:
 *                 type: string
 *                 description: Название перевозчика
 *                 example: "DHL"
 *               trackingNumber:
 *                 type: string
 *                 description: Номер отслеживания (опционально)
 *                 example: "DHL1234567890"
 *               assignedTo:
 *                 type: string
 *                 description: ID сотрудника, ответственного за отправку
 *                 example: "emp-001"
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *                 description: Запланированная дата отправки
 *                 example: "2025-03-15T14:00:00Z"
 *     responses:
 *       201:
 *         description: Задание на отправку успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShippingTask'
 *       400:
 *         description: Неверные данные запроса или заказы не в подходящем статусе
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Один или несколько заказов не найдены
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
router.post('/', shippingController.createShippingTask);

/**
 * @swagger
 * /shipping/{id}:
 *   get:
 *     summary: Получить задание на отправку по ID
 *     description: Возвращает подробную информацию о конкретном задании на отправку
 *     tags: [Shipping]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID задания на отправку
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Успешное получение информации о задании на отправку
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShippingTask'
 *       404:
 *         description: Задание на отправку не найдено
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
router.get('/:id', shippingController.getShippingTaskById);

/**
 * @swagger
 * /shipping/{id}/start:
 *   post:
 *     summary: Начать выполнение задания на отправку
 *     description: Изменяет статус задания на отправку на "в процессе" и фиксирует время начала
 *     tags: [Shipping]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID задания на отправку
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Задание на отправку успешно начато
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShippingTask'
 *       400:
 *         description: Неверный статус задания
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Задание на отправку не найдено
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
router.post('/:id/start', shippingController.startShippingTask);

/**
 * @swagger
 * /shipping/{id}/complete:
 *   post:
 *     summary: Завершить задание на отправку
 *     description: Завершает задание на отправку, обновляет статус заказов и фиксирует информацию о отправке
 *     tags: [Shipping]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID задания на отправку
 *         example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trackingNumber
 *             properties:
 *               trackingNumber:
 *                 type: string
 *                 description: Номер отслеживания
 *                 example: "DHL1234567890"
 *               notes:
 *                 type: string
 *                 description: Дополнительные заметки
 *                 example: "Отправлено с курьером"
 *               actualWeight:
 *                 type: number
 *                 description: Фактический вес отправления (кг)
 *                 example: 5.2
 *     responses:
 *       200:
 *         description: Задание на отправку успешно завершено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShippingTask'
 *       400:
 *         description: Неверный статус задания или данные запроса
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Задание на отправку не найдено
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
router.post('/:id/complete', shippingController.completeShippingTask);

/**
 * @swagger
 * /shipping/{id}/cancel:
 *   post:
 *     summary: Отменить задание на отправку
 *     description: Отменяет задание на отправку и возвращает заказы в предыдущий статус
 *     tags: [Shipping]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID задания на отправку
 *         example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Причина отмены
 *                 example: "Клиент отменил заказ"
 *     responses:
 *       200:
 *         description: Задание на отправку успешно отменено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShippingTask'
 *       400:
 *         description: Неверный статус задания или данные запроса
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Задание на отправку не найдено
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
router.post('/:id/cancel', shippingController.cancelShippingTask);

export default router;