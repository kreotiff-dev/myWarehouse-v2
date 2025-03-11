// controllers/pickingCarts.js
import PickingCart from '../models/pickingCart.js';

// Получение списка тележек для сборки
export async function getPickingCarts(req, res) {
  try {
    const { status } = req.query;
    
    // Базовый запрос
    let query = {};
    
    // Фильтр по статусу, если указан
    if (status) {
      query.status = status;
    }
    
    const carts = await PickingCart.find(query).sort({ createdAt: -1 });
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Получение тележки по ID
export async function getPickingCartById(req, res) {
  try {
    const { id } = req.params;
    const cart = await PickingCart.findById(id);
    
    if (!cart) {
      return res.status(404).json({ error: 'Picking cart not found' });
    }
    
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Создание новой тележки
export async function createPickingCart(req, res) {
  try {
    // Генерируем уникальный штрихкод
    const timestamp = new Date().getTime();
    const barcode = `PICK-CART-${timestamp}`;
    
    const cartData = {
      barcode,
      ...req.body,
      status: 'free' // Новая тележка всегда свободна
    };
    
    const cart = new PickingCart(cartData);
    await cart.save();
    
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Обновление статуса тележки
export async function updatePickingCartStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const cart = await PickingCart.findById(id);
    if (!cart) {
      return res.status(404).json({ error: 'Picking cart not found' });
    }
    
    // Проверка допустимости статуса
    const validStatuses = ['free', 'assigned', 'in_use', 'complete'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    // Обновление статуса
    cart.status = status;
    cart.updatedAt = new Date();
    
    // Если статус "free", очищаем связи и товары
    if (status === 'free') {
      cart.pickingTaskId = null;
      cart.assignedTo = null;
      cart.items = [];
    }
    
    await cart.save();
    
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}