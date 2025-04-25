import express from 'express';
import * as locationsController from '../controllers/locations.js';
import { authMiddleware, workerRoleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authMiddleware);
// Доступ только для worker и admin
router.use(workerRoleMiddleware);

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Получить список всех ячеек
 *     description: Возвращает полный список всех ячеек склада с их параметрами
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешное получение списка ячеек
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', locationsController.getLocations);

/**
 * @swagger
 * /locations/{id}:
 *   get:
 *     summary: Получить ячейку по ID
 *     description: Возвращает детальную информацию о конкретной ячейке склада
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ячейки
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Успешное получение информации о ячейке
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Ячейка не найдена
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
router.get('/:id', locationsController.getLocationById);

/**
 * @swagger
 * /locations:
 *   post:
 *     summary: Создать новую ячейку
 *     description: Создает новую ячейку на складе с указанными параметрами
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - barcode
 *               - zone
 *               - aisle
 *               - rack
 *               - level
 *               - position
 *               - capacity
 *             properties:
 *               barcode:
 *                 type: string
 *                 description: Уникальный штрихкод ячейки
 *                 example: "LOC-A01-B02-C03"
 *               zone:
 *                 type: string
 *                 description: Зона склада
 *                 example: "A"
 *               aisle:
 *                 type: string
 *                 description: Проход
 *                 example: "01"
 *               rack:
 *                 type: string
 *                 description: Стеллаж
 *                 example: "B"
 *               level:
 *                 type: string
 *                 description: Уровень
 *                 example: "02"
 *               position:
 *                 type: string
 *                 description: Позиция
 *                 example: "C03"
 *               capacity:
 *                 type: number
 *                 description: Вместимость ячейки
 *                 example: 100
 *     responses:
 *       201:
 *         description: Ячейка успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
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
router.post('/', locationsController.createLocation);

export default router;