// routes/pickingCarts.js
import express from 'express';
import * as pickingCartsController from '../controllers/pickingCart.js';

const router = express.Router();

/**
 * @swagger
 * /picking-carts:
 *   get:
 *     summary: Получить список тележек сборки
 *     description: Возвращает список всех тележек сборки с возможностью фильтрации по статусу
 *     tags: [PickingCarts]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [free, assigned, in_use, complete]
 *         description: Фильтр по статусу тележки сборки
 *     responses:
 *       200:
 *         description: Успешное получение списка тележек сборки
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PickingCart'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', pickingCartsController.getPickingCarts);

/**
 * @swagger
 * /picking-carts:
 *   post:
 *     summary: Создать новую тележку сборки
 *     description: Создает новую тележку сборки с уникальным штрихкодом
 *     tags: [PickingCarts]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Дополнительное описание тележки (опционально)
 *                 example: "Тележка для крупногабаритных товаров"
 *     responses:
 *       201:
 *         description: Тележка сборки успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PickingCart'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', pickingCartsController.createPickingCart);

/**
 * @swagger
 * /picking-carts/{id}:
 *   get:
 *     summary: Получить тележку сборки по ID
 *     description: Возвращает подробную информацию о конкретной тележке сборки
 *     tags: [PickingCarts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID тележки сборки
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Успешное получение информации о тележке сборки
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PickingCart'
 *       404:
 *         description: Тележка сборки не найдена
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
router.get('/:id', pickingCartsController.getPickingCartById);

/**
 * @swagger
 * /picking-carts/{id}/status:
 *   patch:
 *     summary: Обновить статус тележки сборки
 *     description: Изменяет статус тележки сборки и, при необходимости, очищает связанную информацию
 *     tags: [PickingCarts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID тележки сборки
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
 *                 description: Новый статус тележки сборки
 *                 enum: [free, assigned, in_use, complete]
 *                 example: "free"
 *     responses:
 *       200:
 *         description: Статус тележки сборки успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PickingCart'
 *       400:
 *         description: Неверный статус тележки
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Тележка сборки не найдена
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
router.patch('/:id/status', pickingCartsController.updatePickingCartStatus);

export default router;