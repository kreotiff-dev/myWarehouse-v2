/**
 * @swagger
 * components:
 *   schemas:
 *     Inventory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *         sku:
 *           type: string
 *           description: SKU продукта
 *           example: "PROD-001"
 *         quantity:
 *           type: number
 *           description: Количество товара
 *           example: 10
 *         locationId:
 *           type: string
 *           description: ID ячейки размещения
 *           example: "60d21b4667d0d8992e610c86"
 *         status:
 *           type: string
 *           enum: [placed]
 *           description: Статус размещения
 *           example: "placed"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания записи
 *           example: "2025-03-12T10:00:00Z"
 *     
 *     Location:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *         barcode:
 *           type: string
 *           description: Уникальный штрихкод ячейки
 *           example: "LOC-A01-01-01"
 *         zone:
 *           type: string
 *           description: Зона склада
 *           example: "A"
 *         aisle:
 *           type: string
 *           description: Проход
 *           example: "01"
 *         rack:
 *           type: string
 *           description: Стеллаж
 *           example: "01"
 *         level:
 *           type: string
 *           description: Уровень
 *           example: "01"
 *         position:
 *           type: string
 *           description: Позиция
 *           example: "01"
 *         status:
 *           type: string
 *           enum: [available, occupied, reserved]
 *           description: Статус ячейки
 *           example: "available"
 *         capacity:
 *           type: number
 *           description: Вместимость ячейки
 *           example: 100
 *         usedCapacity:
 *           type: number
 *           description: Использованная вместимость
 *           example: 30
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания ячейки
 *           example: "2025-03-01T10:00:00Z"
 *     
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *         sku:
 *           type: string
 *           description: Уникальный SKU товара
 *           example: "PROD-001"
 *         productId:
 *           type: string
 *           description: Внешний идентификатор товара
 *           example: "EXT-001"
 *         name:
 *           type: string
 *           description: Наименование товара
 *           example: "Смартфон XYZ"
 *         barcode:
 *           type: string
 *           description: Штрихкод товара
 *           example: "4607123456789"
 *         category:
 *           type: string
 *           description: Категория товара
 *           example: "Электроника"
 *         dimensions:
 *           type: object
 *           description: Габариты товара
 *           properties:
 *             length:
 *               type: number
 *               description: Длина (см)
 *               example: 15
 *             width:
 *               type: number
 *               description: Ширина (см)
 *               example: 7.5
 *             height:
 *               type: number
 *               description: Высота (см)
 *               example: 1.5
 *             weight:
 *               type: number
 *               description: Вес (кг)
 *               example: 0.2
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания товара
 *           example: "2025-02-15T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Дата обновления товара
 *           example: "2025-03-10T14:30:00Z"
 *     
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *         orderNumber:
 *           type: string
 *           description: Уникальный номер заказа
 *           example: "ORD-12345"
 *         externalOrderId:
 *           type: string
 *           description: Внешний идентификатор заказа
 *           example: "EXT-12345"
 *         customer:
 *           type: object
 *           description: Информация о клиенте
 *           properties:
 *             name:
 *               type: string
 *               example: "Иван Иванов"
 *             address:
 *               type: string
 *               example: "г. Москва, ул. Примерная, д. 1"
 *             phone:
 *               type: string
 *               example: "+7 999 123-45-67"
 *             email:
 *               type: string
 *               example: "example@example.com"
 *         status:
 *           type: string
 *           enum: [new, processing, picking, picked, packed, shipped, delivered, cancelled]
 *           description: Статус заказа
 *           example: "new"
 *         priority:
 *           type: number
 *           description: Приоритет заказа (выше число = выше приоритет)
 *           example: 1
 *         items:
 *           type: array
 *           description: Список товаров в заказе
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID товара
 *                 example: "60d21b4667d0d8992e610c86"
 *               sku:
 *                 type: string
 *                 description: SKU товара
 *                 example: "PROD-001"
 *               name:
 *                 type: string
 *                 description: Наименование товара
 *                 example: "Смартфон XYZ"
 *               quantity:
 *                 type: number
 *                 description: Количество товара
 *                 example: 2
 *               pickedQuantity:
 *                 type: number
 *                 description: Собранное количество
 *                 example: 0
 *               status:
 *                 type: string
 *                 enum: [pending, reserved, picked, packed, cancelled]
 *                 description: Статус товара в заказе
 *                 example: "pending"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания заказа
 *           example: "2025-03-10T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Дата обновления заказа
 *           example: "2025-03-10T14:30:00Z"
 *     
 *     Invoice:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *         invoiceNumber:
 *           type: string
 *           description: Уникальный номер накладной
 *           example: "INV-12345"
 *         barcode:
 *           type: string
 *           description: Штрихкод накладной
 *           example: "4607123456780"
 *         status:
 *           type: string
 *           enum: [new, in_progress, accepted, accepted_with_discrepancies]
 *           description: Статус накладной
 *           example: "new"
 *         items:
 *           type: array
 *           description: Список товаров в накладной
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Уникальный ID товара в накладной
 *                 example: "item-001"
 *               productId:
 *                 type: string
 *                 description: Внешний ID товара
 *                 example: "EXT-001"
 *               sku:
 *                 type: string
 *                 description: SKU товара
 *                 example: "PROD-001"
 *               name:
 *                 type: string
 *                 description: Наименование товара
 *                 example: "Смартфон XYZ"
 *               barcode:
 *                 type: string
 *                 description: Штрихкод товара
 *                 example: "4607123456789"
 *               expectedQuantity:
 *                 type: number
 *                 description: Ожидаемое количество товара
 *                 example: 10
 *               actualQuantity:
 *                 type: number
 *                 description: Фактическое количество товара
 *                 example: 8
 *               placedQuantity:
 *                 type: number
 *                 description: Размещенное количество товара
 *                 example: 0
 *               status:
 *                 type: string
 *                 enum: [pending, scanned, counted]
 *                 description: Статус товара в накладной
 *                 example: "pending"
 *               placementCartId:
 *                 type: string
 *                 description: ID тележки размещения (если товар помещен в тележку)
 *                 example: "60d21b4667d0d8992e610c86"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания накладной
 *           example: "2025-03-10T10:00:00Z"
 *     
 *     PickingTask:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *         orderIds:
 *           type: array
 *           description: Список ID заказов для сборки
 *           items:
 *             type: string
 *             example: "60d21b4667d0d8992e610c86"
 *         assignedTo:
 *           type: string
 *           description: ID сотрудника, ответственного за сборку
 *           example: "emp-001"
 *         status:
 *           type: string
 *           enum: [created, assigned, in_progress, completed, cancelled]
 *           description: Статус задания на сборку
 *           example: "created"
 *         items:
 *           type: array
 *           description: Список товаров для сборки
 *           items:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID заказа
 *                 example: "60d21b4667d0d8992e610c86"
 *               orderItemId:
 *                 type: string
 *                 description: ID товара в заказе
 *                 example: "60d21b4667d0d8992e610c87"
 *               productId:
 *                 type: string
 *                 description: ID товара
 *                 example: "60d21b4667d0d8992e610c88"
 *               sku:
 *                 type: string
 *                 description: SKU товара
 *                 example: "PROD-001"
 *               name:
 *                 type: string
 *                 description: Наименование товара
 *                 example: "Смартфон XYZ"
 *               quantity:
 *                 type: number
 *                 description: Требуемое количество товара
 *                 example: 2
 *               pickedQuantity:
 *                 type: number
 *                 description: Собранное количество товара
 *                 example: 0
 *               locationId:
 *                 type: string
 *                 description: ID ячейки, где находится товар
 *                 example: "60d21b4667d0d8992e610c89"
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, picked, cancelled]
 *                 description: Статус сборки товара
 *                 example: "pending"
 *         startedAt:
 *           type: string
 *           format: date-time
 *           description: Время начала сборки
 *           example: "2025-03-12T10:30:00Z"
 *         completedAt:
 *           type: string
 *           format: date-time
 *           description: Время завершения сборки
 *           example: "2025-03-12T11:15:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Время создания задания
 *           example: "2025-03-12T10:00:00Z"
 *     
 *     PickingCart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *         barcode:
 *           type: string
 *           description: Уникальный штрихкод тележки сборки
 *           example: "PICK-CART-1626456789"
 *         status:
 *           type: string
 *           enum: [free, assigned, in_use, complete]
 *           description: Статус тележки сборки
 *           example: "free"
 *         assignedTo:
 *           type: string
 *           description: ID сотрудника, которому назначена тележка
 *           example: "emp-001"
 *         pickingTaskId:
 *           type: string
 *           description: ID привязанного задания на сборку
 *           example: "60d21b4667d0d8992e610c86"
 *         items:
 *           type: array
 *           description: Список товаров в тележке
 *           items:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *                 description: SKU товара
 *                 example: "PROD-001"
 *               quantity:
 *                 type: number
 *                 description: Количество товара
 *                 example: 5
 *               orderId:
 *                 type: string
 *                 description: ID заказа
 *                 example: "60d21b4667d0d8992e610c87"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Время создания тележки
 *           example: "2025-03-10T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Время последнего обновления тележки
 *           example: "2025-03-12T11:30:00Z"
 *     
 *     PlacementCart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *         status:
 *           type: string
 *           enum: [free, occupied]
 *           description: Статус тележки размещения
 *           example: "free"
 *         items:
 *           type: array
 *           description: Список товаров в тележке
 *           items:
 *             type: object
 *             properties:
 *               invoiceId:
 *                 type: string
 *                 description: ID накладной
 *                 example: "60d21b4667d0d8992e610c86"
 *               itemId:
 *                 type: string
 *                 description: ID товара в накладной
 *                 example: "item-001"
 *               sku:
 *                 type: string
 *                 description: SKU товара
 *                 example: "PROD-001"
 *               quantity:
 *                 type: number
 *                 description: Количество товара
 *                 example: 10
 *               placedQuantity:
 *                 type: number
 *                 description: Размещенное количество 
 *                 example: 5
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Время создания тележки
 *           example: "2025-03-10T10:00:00Z"
 *     
 *     PackingTask:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *         orderId:
 *           type: string
 *           description: ID заказа для упаковки
 *           example: "60d21b4667d0d8992e610c86"
 *         pickingTaskId:
 *           type: string
 *           description: ID задания на сборку
 *           example: "60d21b4667d0d8992e610c87"
 *         pickingCartId:
 *           type: string
 *           description: ID тележки сборки
 *           example: "60d21b4667d0d8992e610c88"
 *         assignedTo:
 *           type: string
 *           description: ID сотрудника, ответственного за упаковку
 *           example: "emp-001"
 *         status:
 *           type: string
 *           enum: [created, in_progress, completed, cancelled]
 *           description: Статус задания на упаковку
 *           example: "created"
 *         packageInfo:
 *           type: object
 *           description: Информация об упаковке
 *           properties:
 *             weight:
 *               type: number
 *               description: Вес упаковки
 *               example: 2.5
 *             packageType:
 *               type: string
 *               enum: [box, envelope, pallet, other]
 *               description: Тип упаковки
 *               example: "box"
 *         startedAt:
 *           type: string
 *           format: date-time
 *           description: Время начала упаковки
 *           example: "2025-03-12T11:30:00Z"
 *         completedAt:
 *           type: string
 *           format: date-time
 *           description: Время завершения упаковки
 *           example: "2025-03-12T11:45:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Время создания задания
 *           example: "2025-03-12T11:15:00Z"
 *     
 *     ShippingTask:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *         orderIds:
 *           type: array
 *           description: Список ID заказов для отправки
 *           items:
 *             type: string
 *             example: "60d21b4667d0d8992e610c86"
 *         carrier:
 *           type: string
 *           description: Название перевозчика
 *           example: "DHL"
 *         trackingNumber:
 *           type: string
 *           description: Номер отслеживания
 *           example: "DHL1234567890"
 *         assignedTo:
 *           type: string
 *           description: ID сотрудника, ответственного за отправку
 *           example: "emp-001"
 *         status:
 *           type: string
 *           enum: [created, in_progress, completed, cancelled]
 *           description: Статус задания на отправку
 *           example: "created"
 *         scheduledDate:
 *           type: string
 *           format: date-time
 *           description: Запланированная дата отправки
 *           example: "2025-03-15T14:00:00Z"
 *         shipmentDetails:
 *           type: object
 *           description: Детали отправки
 *           properties:
 *             actualWeight:
 *               type: number
 *               description: Фактический вес отправления
 *               example: 5.2
 *             notes:
 *               type: string
 *               description: Дополнительные заметки
 *               example: "Отправлено с курьером"
 *         startedAt:
 *           type: string
 *           format: date-time
 *           description: Время начала отправки
 *           example: "2025-03-15T13:30:00Z"
 *         completedAt:
 *           type: string
 *           format: date-time
 *           description: Время завершения отправки
 *           example: "2025-03-15T14:15:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Время создания задания
 *           example: "2025-03-12T14:00:00Z"
 *     
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Сообщение об ошибке
 *           example: "Location not found"
 */