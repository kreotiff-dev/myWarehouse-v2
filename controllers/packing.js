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
    console.error('Error getting packing tasks:', error);
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
    console.error('Error getting packing task:', error);
    res.status(500).json({ error: error.message });
  }
}

// Создание задания на упаковку
export async function createPackingTask(req, res) {
  try {
    console.log('Create packing task request:', req.body);
    
    const { orderId } = req.body;
    let { pickingTaskId, pickingCartId, assignedTo } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    
    // Проверяем существование заказа и его статус
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: `Order with id ${orderId} not found` });
    }
    
    console.log(`Order status: ${order.status}`);
    if (order.status !== 'picked') {
      return res.status(400).json({ error: `Cannot pack order in ${order.status} status. Order must be in 'picked' status.` });
    }
    
    // Находим задание на сборку для этого заказа, если не указано
    if (!pickingTaskId) {
      const pickingTask = await PickingTask.findOne({ 
        orderIds: orderId,
        status: 'completed'
      });
      
      if (pickingTask) {
        pickingTaskId = pickingTask._id;
        console.log(`Found picking task: ${pickingTaskId}`);
      }
    } else {
      // Если указан ID задания на сборку, проверяем его
      const pickingTask = await PickingTask.findById(pickingTaskId);
      if (!pickingTask) {
        return res.status(404).json({ error: `Picking task with id ${pickingTaskId} not found` });
      }
      
      if (pickingTask.status !== 'completed') {
        return res.status(400).json({ error: `Picking task is not completed. Current status: ${pickingTask.status}` });
      }
    }
    
    // Находим тележку сборки, если она не указана
    if (!pickingCartId) {
      const pickingCart = await PickingCart.findOne({
        status: 'complete'
      });
      
      if (pickingCart) {
        pickingCartId = pickingCart._id;
        console.log(`Found picking cart: ${pickingCartId}`);
      }
    } else if (pickingCartId !== 'null' && pickingCartId !== null) {
      // Если указан ID тележки, проверяем её
      const pickingCart = await PickingCart.findById(pickingCartId);
      if (!pickingCart) {
        return res.status(404).json({ error: `Picking cart with id ${pickingCartId} not found` });
      }
      
      if (pickingCart.status !== 'complete') {
        return res.status(400).json({ error: `Picking cart is not ready for packing. Current status: ${pickingCart.status}` });
      }
    } else {
      // Если передано null или "null", устанавливаем значение null
      pickingCartId = null;
    }
    
    // Создаем задание на упаковку с минимально необходимыми полями
    const packingTask = new PackingTask({
      orderId,
      status: 'created'
    });
    
    // Добавляем необязательные поля, если они указаны
    if (pickingTaskId) {
      packingTask.pickingTaskId = pickingTaskId;
    }
    
    if (pickingCartId) {
      packingTask.pickingCartId = pickingCartId;
    }
    
    if (assignedTo) {
      packingTask.assignedTo = assignedTo;
    }
    
    console.log('Creating packing task:', packingTask);
    await packingTask.save();
    
    // Обновляем статус заказа
    order.status = 'packing';
    await order.save();
    
    res.status(201).json(packingTask);
  } catch (error) {
    console.error('Error creating packing task:', error);
    res.status(500).json({ error: error.message });
  }
}

// Начало упаковки
export async function startPackingTask(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || id === 'null') {
      return res.status(400).json({ error: 'Valid packing task ID is required' });
    }
    
    const task = await PackingTask.findById(id);
    if (!task) {
      return res.status(404).json({ error: `Packing task with id ${id} not found` });
    }
    
    if (task.status !== 'created') {
      return res.status(400).json({ error: `Cannot start task in ${task.status} status. Task must be in 'created' status.` });
    }
    
    task.status = 'in_progress';
    task.startedAt = new Date();
    await task.save();
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error starting packing task:', error);
    res.status(500).json({ error: error.message });
  }
}

// Завершение упаковки
export async function completePackingTask(req, res) {
  try {
    const { id } = req.params;
    const { weight, packageType } = req.body;
    
    if (!id || id === 'null') {
      return res.status(400).json({ error: 'Valid packing task ID is required' });
    }
    
    if (!weight || !packageType) {
      return res.status(400).json({ error: 'Weight and packageType are required' });
    }
    
    const task = await PackingTask.findById(id);
    if (!task) {
      return res.status(404).json({ error: `Packing task with id ${id} not found` });
    }
    
    if (task.status !== 'in_progress') {
      return res.status(400).json({ error: `Cannot complete task in ${task.status} status. Task must be in 'in_progress' status.` });
    }
    
    // Обновляем задание на упаковку
    task.status = 'completed';
    task.completedAt = new Date();
    task.packageInfo = {
      weight: parseFloat(weight),
      packageType
    };
    await task.save();
    
    // Обновляем статус заказа
    const order = await Order.findById(task.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
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
    console.error('Error completing packing task:', error);
    res.status(500).json({ error: error.message });
  }
}