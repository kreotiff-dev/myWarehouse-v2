import express from 'express';
import * as pickingController from '../controllers/picking.js';
import { authMiddleware, workerRoleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authMiddleware);
// Доступ только для worker и admin
router.use(workerRoleMiddleware);

/**
 * @swagger
 * /picking:
 *   get:
 *     summary: Получить список заданий на сборку
 *     description: Возвращает список всех заданий на сборку с возможностью фильтрации по статусу
 *     tags: [Picking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [created, assigned, in_progress, completed, cancelled]
 *         description: Фильтр по статусу задания на сборку
 *     responses:
 *       200:
 *         description: Успешное получение списка заданий на сборку
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PickingTask'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', pickingController.getPickingTasks);

/**
 * @swagger
 * /picking:
 *   post:
 *     summary: Создать задание на сборку
 *     description: Создает новое задание на сборку для указанных заказов
 *     tags: [Picking]
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
 *                 description: Список ID заказов для сборки
 *                 items:
 *                   type: string
 *                   example: "60d21b4667d0d8992e610c85"
 *               assignedTo:
 *                 type: string
 *                 description: ID сотрудника, ответственного за сборку
 *                 example: "emp-001"
 *     responses:
 *       201:
 *         description: Задание на сборку успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PickingTask'
 *       400:
 *         description: Неверные данные запроса или статус заказов
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
router.post('/', pickingController.createPickingTask);

/**
 * @swagger
 * /picking/{id}/start:
 *   post:
 *     summary: Начать сборку
 *     description: Начинает выполнение задания на сборку, привязывает тележку сборки
 *     tags: [Picking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID задания на сборку
 *         example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickingCartId
 *             properties:
 *               pickingCartId:
 *                 type: string
 *                 description: ID тележки сборки
 *                 example: "60d21b4667d0d8992e610c86"
 *     responses:
 *       200:
 *         description: Сборка успешно начата
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   $ref: '#/components/schemas/PickingTask'
 *                 pickingCart:
 *                   $ref: '#/components/schemas/PickingCart'
 *       400:
 *         description: Неверный статус задания или тележка недоступна
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Задание на сборку или тележка не найдены
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
router.post('/:id/start', pickingController.startPickingTask);

/**
 * @swagger
 * /picking/{id}/scan-location:
 *   post:
 *     summary: Сканировать ячейку при сборке
 *     description: Проверяет соответствие штрихкода ячейки при сборке товара
 *     tags: [Picking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID задания на сборку
 *         example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locationBarcode
 *               - pickingItemId
 *             properties:
 *               locationBarcode:
 *                 type: string
 *                 description: Штрихкод сканируемой ячейки
 *                 example: "LOC-A01-01-01"
 *               pickingItemId:
 *                 type: string
 *                 description: ID элемента сборки в задании
 *                 example: "60d21b4667d0d8992e610c87"
 *     responses:
 *       200:
 *         description: Ячейка успешно просканирована
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 orderId:
 *                   type: string
 *                 orderItemId:
 *                   type: string
 *                 productId:
 *                   type: string
 *                 sku:
 *                   type: string
 *                 name:
 *                   type: string
 *                 quantity:
 *                   type: number
 *                 pickedQuantity:
 *                   type: number
 *                 locationId:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [pending, in_progress, picked, cancelled]
 *       400:
 *         description: Штрихкод ячейки не соответствует ожидаемому
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Location barcode does not match"
 *                 expected:
 *                   type: string
 *                   example: "LOC-A01-01-01" 
 *                 received:
 *                   type: string
 *                   example: "LOC-A01-01-02"
 *       404:
 *         description: Задание на сборку, элемент сборки или ячейка не найдены
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
router.post('/:id/scan-location', pickingController.scanLocation);

/**
 * @swagger
 * /picking/{id}/pick:
 *   post:
 *     summary: Собрать товар
 *     description: Выполняет сборку товара из ячейки и размещение в тележку
 *     tags: [Picking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID задания на сборку
 *         example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickingItemId
 *               - quantity
 *               - pickingCartId
 *             properties:
 *               pickingItemId:
 *                 type: string
 *                 description: ID элемента сборки в задании
 *                 example: "60d21b4667d0d8992e610c87"
 *               quantity:
 *                 type: number
 *                 description: Количество собираемого товара
 *                 example: 5
 *               pickingCartId:
 *                 type: string
 *                 description: ID тележки сборки
 *                 example: "60d21b4667d0d8992e610c86"
 *     responses:
 *       200:
 *         description: Товар успешно собран
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pickingItem:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     status:
 *                       type: string
 *                     pickedQuantity:
 *                       type: number
 *                 remainingQuantity:
 *                   type: number
 *                   description: Оставшееся количество для сборки
 *                 pickingCart:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     status:
 *                       type: string
 *                     itemCount:
 *                       type: number
 *                 inventory:
 *                   type: object
 *                   properties:
 *                     remaining:
 *                       type: number
 *       400:
 *         description: Неверный статус, превышение доступного количества или другие ошибки
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Задание на сборку, элемент сборки или тележка не найдены
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
router.post('/:id/pick', pickingController.pickItem);

export default router;