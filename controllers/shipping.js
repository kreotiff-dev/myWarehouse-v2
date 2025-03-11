// controllers/shipping.js
import ShippingTask from '../models/shippingTask.js';
import Order from '../models/order.js';
import PackingTask from '../models/packingTask.js';

// Получение списка заданий на отгрузку
export async function getShippingTasks(req, res) {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const tasks = await ShippingTask.find(query).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error getting shipping tasks:', error);
    res.status(500).json({ error: error.message });
  }
}

// Получение задания на отгрузку по ID
export async function getShippingTaskById(req, res) {
  try {
    const { id } = req.params;
    const task = await ShippingTask.findById(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Shipping task not found' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error getting shipping task:', error);
    res.status(500).json({ error: error.message });
  }
}

// Создание задания на отгрузку
export async function createShippingTask(req, res) {
  try {
    const { orderId, packingTaskId, assignedTo, shippingMethod, carrier } = req.body;
    
    // Проверяем существование заказа и его статус
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.status !== 'packed') {
      return res.status(400).json({ error: `Cannot ship order in ${order.status} status. Order must be in 'packed' status.` });
    }
    
    // Проверка задания на упаковку
    const packingTask = await PackingTask.findById(packingTaskId);
    if (!packingTask) {
      return res.status(404).json({ error: 'Packing task not found' });
    }
    
    if (packingTask.status !== 'completed') {
      return res.status(400).json({ error: `Packing task is not completed. Current status: ${packingTask.status}` });
    }
    
    // Получаем адрес доставки из заказа
    const shippingAddress = order.customer || {};
    
    // Создаем задание на отгрузку
    const shippingTask = new ShippingTask({
      orderId,
      packingTaskId,
      assignedTo,
      shippingMethod,
      carrier,
      shippingAddress,
      status: 'created'
    });
    
    await shippingTask.save();
    
    // Обновляем статус заказа
    order.status = 'shipping';
    await order.save();
    
    res.status(201).json(shippingTask);
  } catch (error) {
    console.error('Error creating shipping task:', error);
    res.status(500).json({ error: error.message });
  }
}

// Начало отгрузки
export async function startShippingTask(req, res) {
  try {
    const { id } = req.params;
    
    const task = await ShippingTask.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Shipping task not found' });
    }
    
    if (task.status !== 'created') {
      return res.status(400).json({ error: `Cannot start task in ${task.status} status. Task must be in 'created' status.` });
    }
    
    task.status = 'in_progress';
    task.startedAt = new Date();
    await task.save();
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error starting shipping task:', error);
    res.status(500).json({ error: error.message });
  }
}

// Завершение отгрузки
export async function completeShippingTask(req, res) {
  try {
    const { id } = req.params;
    const { trackingNumber, shippingCost } = req.body;
    
    if (!trackingNumber) {
      return res.status(400).json({ error: 'Tracking number is required' });
    }
    
    const task = await ShippingTask.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Shipping task not found' });
    }
    
    if (task.status !== 'in_progress') {
      return res.status(400).json({ error: `Cannot complete task in ${task.status} status. Task must be in 'in_progress' status.` });
    }
    
    // Обновляем задание на отгрузку
    task.status = 'completed';
    task.completedAt = new Date();
    task.trackingNumber = trackingNumber;
    if (shippingCost) {
      task.shippingCost = shippingCost;
    }
    await task.save();
    
    // Обновляем статус заказа
    const order = await Order.findById(task.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    order.status = 'shipped';
    await order.save();
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error completing shipping task:', error);
    res.status(500).json({ error: error.message });
  }
}

// Отмена отгрузки
export async function cancelShippingTask(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      if (!id || id === 'null') {
        return res.status(400).json({ error: 'Valid shipping task ID is required' });
      }
      
      const task = await ShippingTask.findById(id);
      if (!task) {
        return res.status(404).json({ error: `Shipping task with id ${id} not found` });
      }
      
      if (task.status === 'completed') {
        return res.status(400).json({ error: 'Cannot cancel completed shipping task' });
      }
      
      // Обновляем задание на отгрузку
      task.status = 'cancelled';
      task.cancellationReason = reason; // Сохраняем причину отмены
      await task.save();
      
      // Обновляем статус заказа обратно на 'packed'
      const order = await Order.findById(task.orderId);
      if (order) {
        order.status = 'packed';
        await order.save();
      }
      
      res.status(200).json(task);
    } catch (error) {
      console.error('Error cancelling shipping task:', error);
      res.status(500).json({ error: error.message });
    }
  }