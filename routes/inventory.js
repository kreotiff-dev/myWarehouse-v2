import express from 'express';
import * as inventoryController from '../controllers/inventory.js';
import { authMiddleware, workerRoleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Применяем middleware аутентификации ко всем маршрутам
router.use(authMiddleware);
// Доступ только для worker и admin
router.use(workerRoleMiddleware);

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Получить список всех товаров на складе
 *     description: Возвращает полный список всех товаров на складе с информацией о их количестве и расположении
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешное получение списка товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inventory'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', inventoryController.getInventory);

/**
 * @swagger
 * /inventory/adjust:
 *   post:
 *     summary: Корректировка остатков товара
 *     description: Позволяет скорректировать фактическое количество товара в конкретной ячейке
 *     tags: [Inventory]
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
 *               - locationId
 *               - actualQuantity
 *             properties:
 *               sku:
 *                 type: string
 *                 description: SKU продукта
 *                 example: "PROD-001"
 *               locationId:
 *                 type: string
 *                 description: ID ячейки хранения
 *                 example: "60d21b4667d0d8992e610c85"
 *               actualQuantity:
 *                 type: number
 *                 description: Фактическое количество товара
 *                 example: 25
 *               notes:
 *                 type: string
 *                 description: Примечания к корректировке
 *                 example: "Обнаружена недостача при инвентаризации"
 *     responses:
 *       200:
 *         description: Остатки успешно скорректированы
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sku:
 *                   type: string
 *                 productName:
 *                   type: string
 *                 locationId:
 *                   type: string
 *                 locationBarcode:
 *                   type: string
 *                 previousQuantity:
 *                   type: number
 *                 actualQuantity:
 *                   type: number
 *                 adjustment:
 *                   type: number
 *                 notes:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Неверные данные запроса
 *       404:
 *         description: Товар или ячейка не найдены
 *       500:
 *         description: Ошибка сервера
 */
router.post('/adjust', inventoryController.adjustInventory);

/**
 * @swagger
 * /inventory/invoices/{invoiceId}/items/{itemId}/place:
 *   post:
 *     summary: Размещение товара на склад
 *     description: Размещает товар из приемки на указанную ячейку склада
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID накладной
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара в накладной
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locationId
 *               - quantity
 *             properties:
 *               locationId:
 *                 type: string
 *                 description: ID ячейки для размещения
 *                 example: "60d21b4667d0d8992e610c85"
 *               quantity:
 *                 type: number
 *                 description: Количество для размещения
 *                 example: 10
 *     responses:
 *       200:
 *         description: Товар успешно размещен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inventory:
 *                   type: object
 *                   properties:
 *                     sku:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     locationId:
 *                       type: string
 *                 location:
 *                   $ref: '#/components/schemas/Location'
 *       400:
 *         description: Неверные данные запроса
 *       404:
 *         description: Накладная, товар или ячейка не найдены
 *       500:
 *         description: Ошибка сервера
 */
router.post('/invoices/:invoiceId/items/:itemId/place', inventoryController.placeItem);

export default router;