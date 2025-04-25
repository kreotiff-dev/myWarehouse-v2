import express from 'express';
import * as receivingController from '../controllers/receiving.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authMiddleware);

/**
 * @swagger
 * /receiving:
 *   get:
 *     summary: Получить список накладных приёмки
 *     description: Возвращает список всех накладных приёмки товаров
 *     tags: [Receiving]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешное получение списка накладных
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', receivingController.getInvoices);

/**
 * @swagger
 * /receiving:
 *   post:
 *     summary: Создать новую накладную приёмки
 *     description: Создает новую накладную для приёмки товаров на склад
 *     tags: [Receiving]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoiceNumber
 *               - items
 *             properties:
 *               invoiceNumber:
 *                 type: string
 *                 description: Уникальный номер накладной
 *                 example: "INV-12345"
 *               barcode:
 *                 type: string
 *                 description: Штрихкод накладной
 *                 example: "4607123456780"
 *               items:
 *                 type: array
 *                 description: Список товаров для приёмки
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - productId
 *                     - sku
 *                     - name
 *                     - expectedQuantity
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Уникальный ID товара в накладной
 *                       example: "item-001"
 *                     productId:
 *                       type: string
 *                       description: Внешний ID товара
 *                       example: "EXT-001"
 *                     sku:
 *                       type: string
 *                       description: SKU товара
 *                       example: "PROD-001"
 *                     name:
 *                       type: string
 *                       description: Наименование товара
 *                       example: "Смартфон XYZ"
 *                     barcode:
 *                       type: string
 *                       description: Штрихкод товара
 *                       example: "4607123456789"
 *                     expectedQuantity:
 *                       type: number
 *                       description: Ожидаемое количество товара
 *                       example: 10
 *     responses:
 *       201:
 *         description: Накладная успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
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
router.post('/', receivingController.createInvoice);

/**
 * @swagger
 * /receiving/{invoiceId}/scan:
 *   post:
 *     summary: Начать обработку накладной
 *     description: Изменяет статус накладной на "в процессе приёмки"
 *     tags: [Receiving]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID накладной
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Обработка накладной успешно начата
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Накладная не найдена
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
router.post('/:invoiceId/scan', receivingController.scanInvoice);

/**
 * @swagger
 * /receiving/{invoiceId}/items/{itemId}/scan:
 *   post:
 *     summary: Сканировать товар в накладной
 *     description: Сканирует штрихкод товара при приёмке для подтверждения его наличия
 *     tags: [Receiving]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID накладной
 *         example: "60d21b4667d0d8992e610c85"
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара в накладной
 *         example: "item-001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - barcode
 *             properties:
 *               barcode:
 *                 type: string
 *                 description: Сканируемый штрихкод товара
 *                 example: "4607123456789"
 *     responses:
 *       200:
 *         description: Товар успешно отсканирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 productId:
 *                   type: string
 *                 sku:
 *                   type: string
 *                 name:
 *                   type: string
 *                 barcode:
 *                   type: string
 *                 expectedQuantity:
 *                   type: number
 *                 status:
 *                   type: string
 *                   example: "scanned"
 *       400:
 *         description: Штрихкод не соответствует товару
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Накладная или товар не найдены
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
router.post('/:invoiceId/items/:itemId/scan', receivingController.scanItem);

/**
 * @swagger
 * /receiving/{invoiceId}/items/{itemId}/count:
 *   post:
 *     summary: Подсчёт количества товара
 *     description: Фиксирует фактическое количество товара при приёмке и опционально привязывает к тележке размещения
 *     tags: [Receiving]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID накладной
 *         example: "60d21b4667d0d8992e610c85"
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара в накладной
 *         example: "item-001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - actualQuantity
 *             properties:
 *               actualQuantity:
 *                 type: number
 *                 description: Фактическое количество товара
 *                 example: 8
 *               placementCartId:
 *                 type: string
 *                 description: ID тележки размещения (опционально)
 *                 example: "60d21b4667d0d8992e610c86"
 *     responses:
 *       200:
 *         description: Количество товара успешно зафиксировано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 productId:
 *                   type: string
 *                 sku:
 *                   type: string
 *                 name:
 *                   type: string
 *                 barcode:
 *                   type: string
 *                 expectedQuantity:
 *                   type: number
 *                 actualQuantity:
 *                   type: number
 *                 status:
 *                   type: string
 *                   example: "counted"
 *                 placementCartId:
 *                   type: string
 *       404:
 *         description: Накладная, товар или тележка размещения не найдены
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
router.post('/:invoiceId/items/:itemId/count', receivingController.countItem);

/**
 * @swagger
 * /receiving/{invoiceId}/complete:
 *   post:
 *     summary: Завершить приёмку накладной
 *     description: Завершает процесс приёмки накладной и фиксирует итоговый статус
 *     tags: [Receiving]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID накладной
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Приёмка накладной успешно завершена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Не все товары посчитаны или другая ошибка при завершении
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Накладная не найдена
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
router.post('/:invoiceId/complete', receivingController.completeInvoice);

export default router;