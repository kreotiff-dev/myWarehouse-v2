// controllers/packing.js
import PackingTask from '../models/packingTask.js';
import Order from '../models/order.js';
import PickingTask from '../models/pickingTask.js';
import PickingCart from '../models/pickingCart.js';

// Получение списка заданий на упаковку
export async function getPackingTasks(req, res) {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const tasks = await PackingTask.find(query).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Получение задания на упаковку по ID
export async function getPackingTaskById(req, res) {
  try {
    const { id } = req.params;
    const task = await PackingTask.findById(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Packing task not found' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Создание задания на упаковку
export async function createPackingTask(req, res) {
  try {
    const { orderId, pickingTaskId, pickingCartId, assignedTo } = req.body;
    
    // Проверяем существование заказа и его статус
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.status !== 'picked') {
      return res.status(400).json({ error: `Cannot pack order in ${order.status} status` });
    }
    
    // Проверяем задание на сборку
    if (pickingTaskId) {
      const pickingTask = await PickingTask.findById(pickingTaskId);
      if (!pickingTask) {
        return res.status(404).json({ error: 'Picking task not found' });
      }
      
      if (pickingTask.status !== 'completed') {
        return res.status(400).json({ error: 'Picking task is not completed' });
      }
    }
    
    // Проверяем тележку сборки
    if (pickingCartId) {
      const pickingCart = await PickingCart.findById(pickingCartId);
      if (!pickingCart) {
        return res.status(404).json({ error: 'Picking cart not found' });
      }
      
      if (pickingCart.status !== 'complete') {
        return res.status(400).json({ error: 'Picking cart is not ready for packing' });
      }
    }
    
    // Создаем задание на упаковку
    const packingTask = new PackingTask({
      orderId,
      pickingTaskId,
      pickingCartId,
      assignedTo,
      status: 'created'
    });
    
    await packingTask.save();
    
    // Обновляем статус заказа
    order.status = 'packing';
    await order.save();
    
    res.status(201).json(packingTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Начало упаковки
export async function startPackingTask(req, res) {
  try {
    const { id } = req.params;
    
    const task = await PackingTask.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Packing task not found' });
    }
    
    if (task.status !== 'created') {
      return res.status(400).json({ error: `Cannot start task in ${task.status} status` });
    }
    
    task.status = 'in_progress';
    task.startedAt = new Date();
    await task.save();
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Завершение упаковки
export async function completePackingTask(req, res) {
  try {
    const { id } = req.params;
    const { weight, packageType } = req.body;
    
    const task = await PackingTask.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Packing task not found' });
    }
    
    if (task.status !== 'in_progress') {
      return res.status(400).json({ error: `Cannot complete task in ${task.status} status` });
    }
    
    // Обновляем задание на упаковку
    task.status = 'completed';
    task.completedAt = new Date();
    task.packageInfo = {
      weight,
      packageType
    };
    await task.save();
    
    // Обновляем статус заказа
    const order = await Order.findById(task.orderId);
    order.status = 'packed';
    await order.save();
    
    // Освобождаем тележку, если она была связана с заданием
    if (task.pickingCartId) {
      const pickingCart = await PickingCart.findById(task.pickingCartId);
      if (pickingCart) {
        pickingCart.status = 'free';
        pickingCart.pickingTaskId = null;
        pickingCart.assignedTo = null;
        pickingCart.items = [];
        await pickingCart.save();
      }
    }
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}