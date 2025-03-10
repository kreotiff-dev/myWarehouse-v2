import Order from '../models/order.js';
import Product from '../models/product.js';
import Inventory from '../models/inventory.js';

// Получение списка заказов
export async function getOrders(req, res) {
  try {
    const { status } = req.query;
    
    // Базовый запрос
    let query = {};
    
    // Фильтр по статусу, если указан
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Получение заказа по ID
export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Создание нового заказа
export async function createOrder(req, res) {
  try {
    const orderData = req.body;
    
    // Проверка наличия обязательных полей
    if (!orderData.orderNumber || !orderData.items || !orderData.items.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Проверка уникальности номера заказа
    const existingOrder = await Order.findOne({ orderNumber: orderData.orderNumber });
    if (existingOrder) {
      return res.status(400).json({ error: 'Order with this number already exists' });
    }
    
    // Проверка и дополнение информации о товарах
    for (const item of orderData.items) {
      const product = await Product.findOne({ sku: item.sku });
      if (!product) {
        return res.status(400).json({ error: `Product with SKU ${item.sku} not found` });
      }
      
      // Добавляем информацию о продукте из базы
      item.productId = product._id;
      item.name = product.name;
    }
    
    const order = new Order(orderData);
    await order.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Обновление статуса заказа
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Проверка допустимости статуса
    const validStatuses = ['new', 'processing', 'picking', 'picked', 'packed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    // Обновление статуса
    order.status = status;
    order.updatedAt = new Date();
    await order.save();
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Резервирование товаров для заказа
export async function reserveItems(req, res) {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Можно резервировать только заказы в статусе new
    if (order.status !== 'new') {
      return res.status(400).json({ error: `Cannot reserve items for order in ${order.status} status` });
    }
    
    // Проверяем наличие товаров для всех позиций заказа
    const results = await Promise.all(order.items.map(async (item) => {
      // Получаем доступное количество
      const inventoryItems = await Inventory.find({ sku: item.sku });
      const availableQuantity = inventoryItems.reduce((sum, inv) => sum + inv.quantity, 0);
      
      if (availableQuantity < item.quantity) {
        return {
          sku: item.sku,
          required: item.quantity,
          available: availableQuantity,
          status: 'insufficient'
        };
      }
      
      // Товара достаточно, меняем статус
      item.status = 'reserved';
      
      return {
        sku: item.sku,
        required: item.quantity,
        available: availableQuantity,
        status: 'reserved'
      };
    }));
    
    // Проверяем, все ли товары доступны
    const insufficientItems = results.filter(r => r.status === 'insufficient');
    if (insufficientItems.length > 0) {
      return res.status(400).json({ 
        error: 'Insufficient inventory for some items',
        items: insufficientItems
      });
    }
    
    // Все товары доступны, обновляем заказ
    order.status = 'processing';
    order.updatedAt = new Date();
    await order.save();
    
    res.status(200).json({
      message: 'Items reserved successfully',
      order,
      items: results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}