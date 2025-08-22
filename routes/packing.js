// routes/packing.js
import express from 'express';
import * as packingController from '../controllers/packing.js';
import { authMiddleware, workerRoleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authMiddleware);
// Доступ только для worker и admin
router.use(workerRoleMiddleware);

/**
 * @swagger
 * /packing:
 *   get:
 *     summary: Получить список заданий на упаковку
 *     description: Возвращает список всех заданий на упаковку с возможностью фильтрации по статусу
 *     tags: [Packing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [created, in_progress, completed, cancelled]
 *         description: Фильтр по статусу задания на упаковку
 *     responses:
 *       200:
 *         description: Успешное получение списка заданий на упаковку
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PackingTask'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', packingController.getPackingTasks);

/**
 * @swagger
 * /packing:
 *   post:
 *     summary: Создать задание на упаковку
 *     description: Создает новое задание на упаковку для указанного заказа
 *     tags: [Packing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID заказа для упаковки
 *                 example: "60d21b4667d0d8992e610c85"
 *               pickingTaskId:
 *                 type: string
 *                 description: ID задания на сборку (опционально)
 *                 example: "60d21b4667d0d8992e610c86"
 *               pickingCartId:
 *                 type: string
 *                 description: ID тележки сборки (опционально)
 *                 example: "60d21b4667d0d8992e610c87"
 *               assignedTo:
 *                 type: string
 *                 description: ID сотрудника, ответственного за упаковку
 *                 example: "emp-001"
 *     responses:
 *       201:
 *         description: Задание на упаковку успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PackingTask'
 *       400:
 *         description: Неверные данные запроса
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Заказ, задание на сборку или тележка не найдены
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
router.post('/', packingController.createPackingTask);

/**
 * @swagger
 * /packing/{id}:
 *   get:
 *     summary: Получить задание на упаковку по ID
 *     description: Возвращает подробную информацию о конкретном задании на упаковку
 *     tags: [Packing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID задания на упаковку
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Успешное получение информации о задании на упаковку
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PackingTask'
 *       404:
 *         description: Задание на упаковку не найдено
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
router.get('/:id', packingController.getPackingTaskById);

/**
 * @swagger
 * /packing/{id}/start:
 *   post:
 *     summary: Начать упаковку
 *     description: Изменяет статус задания на упаковку на "in_progress" и фиксирует время начала
 *     tags: [Packing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID задания на упаковку
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Упаковка успешно начата
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PackingTask'
 *       400:
 *         description: Неверный статус задания
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Задание на упаковку не найдено
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
router.post('/:id/start', packingController.startPackingTask);

/**
 * @swagger
 * /packing/{id}/complete:
 *   post:
 *     summary: Завершить упаковку
 *     description: Завершает задание на упаковку, обновляет статус заказа и освобождает тележку сборки
 *     tags: [Packing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID задания на упаковку
 *         example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weight
 *               - packageType
 *             properties:
 *               weight:
 *                 type: number
 *                 description: Вес упаковки
 *                 example: 2.5
 *               packageType:
 *                 type: string
 *                 description: Тип упаковки
 *                 enum: [box, envelope, pallet, other]
 *                 example: "box"
 *     responses:
 *       200:
 *         description: Упаковка успешно завершена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PackingTask'
 *       400:
 *         description: Неверный статус задания или данные запроса
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Задание на упаковку не найдено
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
router.post('/:id/complete', packingController.completePackingTask);

export default router;