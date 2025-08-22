import express from 'express';
import * as placementCartController from '../controllers/placementCart.js';
import { authMiddleware, workerRoleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authMiddleware);
// Доступ только для worker и admin
router.use(workerRoleMiddleware);

/**
 * @swagger
 * /placement-carts:
 *   get:
 *     summary: Получить список тележек размещения
 *     description: Возвращает список всех тележек размещения с возможностью фильтрации по статусу
 *     tags: [PlacementCarts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [free, occupied]
 *         description: Фильтр по статусу тележки размещения
 *     responses:
 *       200:
 *         description: Успешное получение списка тележек размещения
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PlacementCart'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', placementCartController.getPlacementCarts);

/**
 * @swagger
 * /placement-carts/{id}:
 *   get:
 *     summary: Получить тележку размещения по ID
 *     description: Возвращает подробную информацию о конкретной тележке размещения
 *     tags: [PlacementCarts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID тележки размещения
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Успешное получение информации о тележке размещения
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlacementCart'
 *       404:
 *         description: Тележка размещения не найдена
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
router.get('/:id', placementCartController.getPlacementCartById);

/**
 * @swagger
 * /placement-carts:
 *   post:
 *     summary: Создать новую тележку размещения
 *     description: Создает новую пустую тележку размещения со статусом "free"
 *     tags: [PlacementCarts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Тележка размещения успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlacementCart'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', placementCartController.createPlacementCart);

export default router;