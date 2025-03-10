import PickingTask from '../models/pickingTask.js';
import Order from '../models/order.js';
import Inventory from '../models/inventory.js';
import Location from '../models/location.js';
import PickingCart from '../models/pickingCart.js';

// Получение списка заданий на сборку
export async function getPickingTasks(req, res) {
  try {
    const { status } = req.query;
    
    // Базовый запрос
    let query = {};
    
    // Фильтр по статусу, если указан
    if (status) {
      query.status = status;
    }
    
    const tasks = await PickingTask.find(query).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Создание задания на сборку
export async function createPickingTask(req, res) {
  try {
    const { orderIds, assignedTo } = req.body;
    
    if (!orderIds || !orderIds.length) {
      return res.status(400).json({ error: 'No orders specified' });
    }
    
    // Получаем заказы
    const orders = await Order.find({ _id: { $in: orderIds } });
    if (orders.length !== orderIds.length) {
      return res.status(400).json({ error: 'Some orders not found' });
    }
    
    // Проверяем статусы заказов
    for (const order of orders) {
      if (order.status !== 'processing') {
        return res.status(400).json({ 
          error: `Order ${order.orderNumber} has invalid status: ${order.status}. Must be 'processing'` 
        });
      }
    }
    
    // Собираем все товары из заказов
    const pickingItems = [];
    
    for (const order of orders) {
      // Обновляем статус заказа
      order.status = 'picking';
      await order.save();
      
      // Добавляем товары в список сборки
      for (const item of order.items) {
        if (item.status === 'reserved') {
          // Находим оптимальную ячейку для сборки этого товара
          const inventoryItems = await Inventory.find({ sku: item.sku }).sort({ quantity: -1 });
          
          if (inventoryItems.length > 0) {
            const locationId = inventoryItems[0].locationId;
            
            pickingItems.push({
              orderId: order._id,
              orderItemId: item._id,
              productId: item.productId,
              sku: item.sku,
              name: item.name,
              quantity: item.quantity,
              pickedQuantity: 0,
              locationId,
              status: 'pending'
            });
          }
        }
      }
    }
    
    // Создаем задание на сборку
    const task = new PickingTask({
      orderIds,
      assignedTo,
      status: 'created',
      items: pickingItems
    });
    
    await task.save();
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Начало выполнения задания на сборку
export async function startPickingTask(req, res) {
    try {
      const { id } = req.params;
      const { pickingCartId } = req.body;
      
      // Проверяем наличие ID тележки
      if (!pickingCartId) {
        return res.status(400).json({ error: 'Picking cart ID is required' });
      }
      
      const task = await PickingTask.findById(id);
      if (!task) {
        return res.status(404).json({ error: 'Picking task not found' });
      }
      
      // Проверяем и резервируем тележку
      const pickingCart = await PickingCart.findById(pickingCartId);
      if (!pickingCart) {
        return res.status(404).json({ error: 'Picking cart not found' });
      }
      
      if (pickingCart.status !== 'free') {
        return res.status(400).json({ error: 'Picking cart is not available' });
      }
      
      // Обновляем статус тележки и задания
      pickingCart.status = 'assigned';
      pickingCart.pickingTaskId = task._id;
      pickingCart.assignedTo = task.assignedTo;
      await pickingCart.save();
      
      task.status = 'in_progress';
      task.startedAt = new Date();
      await task.save();
      
      res.status(200).json({
        task,
        pickingCart
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  

// Сканирование ячейки при сборке
export async function scanLocation(req, res) {
  try {
    const { id } = req.params;
    const { locationBarcode, pickingItemId } = req.body;
    
    const task = await PickingTask.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Picking task not found' });
    }
    
    // Находим элемент сборки
    const pickingItem = task.items.find(item => item._id.toString() === pickingItemId);
    if (!pickingItem) {
      return res.status(404).json({ error: 'Picking item not found' });
    }
    
    // Получаем информацию о ячейке
    const location = await Location.findById(pickingItem.locationId);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    // Проверяем штрихкод ячейки
    if (location.barcode !== locationBarcode) {
      return res.status(400).json({ 
        error: 'Location barcode does not match',
        expected: location.barcode,
        received: locationBarcode
      });
    }
    
    // Обновляем статус элемента сборки
    pickingItem.status = 'in_progress';
    await task.save();
    
    res.status(200).json(pickingItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Сборка товара
export async function pickItem(req, res) {
    try {
      const { id } = req.params;
      const { pickingItemId, quantity, pickingCartId } = req.body; // Добавляем pickingCartId
      
      // Проверяем наличие тележки
      if (!pickingCartId) {
        return res.status(400).json({ error: 'Picking cart ID is required' });
      }
      
      const task = await PickingTask.findById(id);
      if (!task) {
        return res.status(404).json({ error: 'Picking task not found' });
      }
      
      // Находим элемент сборки
      const pickingItem = task.items.find(item => item._id.toString() === pickingItemId);
      if (!pickingItem) {
        return res.status(404).json({ error: 'Picking item not found' });
      }
      
      // Проверяем статус
      if (pickingItem.status !== 'in_progress') {
        return res.status(400).json({ error: `Cannot pick item in ${pickingItem.status} status` });
      }
      
      // Находим и проверяем тележку
      const pickingCart = await PickingCart.findById(pickingCartId);
      if (!pickingCart) {
        return res.status(404).json({ error: 'Picking cart not found' });
      }
      
      if (pickingCart.status !== 'assigned' && pickingCart.status !== 'in_use') {
        return res.status(400).json({ error: `Picking cart is in invalid status: ${pickingCart.status}` });
      }
      
      // Проверяем количество
      const remainingQuantity = pickingItem.quantity - pickingItem.pickedQuantity;
      if (quantity > remainingQuantity) {
        return res.status(400).json({ 
          error: 'Quantity exceeds remaining amount',
          requested: quantity,
          remaining: remainingQuantity
        });
      }
      
      // Обновляем инвентарь
      const inventory = await Inventory.findOne({ 
        sku: pickingItem.sku, 
        locationId: pickingItem.locationId 
      });
      
      if (!inventory || inventory.quantity < quantity) {
        return res.status(400).json({ error: 'Insufficient inventory in this location' });
      }
      
      // Уменьшаем количество в инвентаре
      inventory.quantity -= quantity;
      await inventory.save();
      
      // Обновляем использованную вместимость ячейки
      const location = await Location.findById(pickingItem.locationId);
      location.usedCapacity -= quantity;
      if (location.usedCapacity <= 0) {
        location.status = 'available';
      } else if (location.usedCapacity < location.capacity) {
        location.status = 'reserved';
      }
      await location.save();
      
      // Добавляем товар в тележку сборки
      const existingItemIndex = pickingCart.items.findIndex(item => 
        item.sku === pickingItem.sku && item.orderId.toString() === pickingItem.orderId.toString()
      );
      
      if (existingItemIndex !== -1) {
        // Если товар уже есть в тележке, увеличиваем количество
        pickingCart.items[existingItemIndex].quantity += quantity;
      } else {
        // Иначе добавляем новый товар
        pickingCart.items.push({
          sku: pickingItem.sku,
          quantity: quantity,
          orderId: pickingItem.orderId
        });
      }
      
      // Обновляем статус тележки
      pickingCart.status = 'in_use';
      await pickingCart.save();
      
      // Обновляем статус и количество в элементе сборки
      pickingItem.pickedQuantity += quantity;
      if (pickingItem.pickedQuantity === pickingItem.quantity) {
        pickingItem.status = 'picked';
      }
      
      // Обновляем заказ
      const order = await Order.findById(pickingItem.orderId);
      const orderItem = order.items.find(item => item._id.toString() === pickingItem.orderItemId.toString());
      orderItem.pickedQuantity += quantity;
      if (orderItem.pickedQuantity === orderItem.quantity) {
        orderItem.status = 'picked';
      }
      
      // Проверяем, все ли товары в заказе собраны
      const allPicked = order.items.every(item => item.status === 'picked');
      if (allPicked) {
        order.status = 'picked';
      }
      
      // Проверяем, все ли товары в задании собраны
      const allTaskItemsPicked = task.items.every(item => item.status === 'picked');
      if (allTaskItemsPicked) {
        task.status = 'completed';
        task.completedAt = new Date();
        
        // Если все собрано, меняем статус тележки на complete
        pickingCart.status = 'complete';
        await pickingCart.save();
      }
      
      // Сохраняем изменения
      await task.save();
      await order.save();
      
      res.status(200).json({
        pickingItem,
        remainingQuantity: pickingItem.quantity - pickingItem.pickedQuantity,
        pickingCart: {
          id: pickingCart._id,
          status: pickingCart.status,
          itemCount: pickingCart.items.length
        },
        inventory: {
          remaining: inventory.quantity
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }