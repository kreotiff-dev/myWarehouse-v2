import Inventory from '../models/inventory.js';
import Location from '../models/location.js';
import PlacementCart from '../models/placementCart.js';
import Invoice from '../models/invoice.js';
import Product from '../models/product.js';

export async function getInventory(req, res) {
  try {
    const inventory = await Inventory.find();
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function placeItem(req, res) {
    try {
      const { invoiceId, itemId } = req.params;
      const { locationId, quantity } = req.body;
  
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      
      const item = invoice.items.find((i) => i.id === itemId);
      if (!item || item.status !== 'counted' || item.actualQuantity < item.placedQuantity + quantity) {
        return res.status(400).json({ error: 'Invalid item or insufficient quantity' });
      }
  
      const location = await Location.findById(locationId);
      if (!location) {
        return res.status(404).json({ error: 'Location not found' });
      }
      
      // Проверяем только общую вместимость ячейки
      if (location.usedCapacity + quantity > location.capacity) {
        return res.status(400).json({ 
          error: `Insufficient capacity in location. Available: ${location.capacity - location.usedCapacity}, Requested: ${quantity}` 
        });
      }
  
      // Создаём запись в Inventory
      await Inventory.create({
        sku: item.sku,
        quantity: quantity,
        locationId: locationId,
        status: 'placed',
      });
  
      // Обновляем ячейку
      location.usedCapacity += quantity;
      location.status = location.usedCapacity >= location.capacity ? 'occupied' : 'reserved';
      await location.save();
  
      // Обновляем placedQuantity
      item.placedQuantity = (item.placedQuantity || 0) + quantity;
  
      // Проверяем тележку
      if (item.placementCartId) {
        const cart = await PlacementCart.findById(item.placementCartId);
        if (cart && cart.status === 'occupied') {
          // Обновляем информацию о товаре в тележке
          const cartItemIndex = cart.items.findIndex(
            cartItem => cartItem.invoiceId.toString() === invoiceId && 
                       cartItem.itemId === itemId
          );
          
          if (cartItemIndex >= 0) {
            cart.items[cartItemIndex].placedQuantity += quantity;
            
            // Проверяем, если весь товар размещён
            if (cart.items[cartItemIndex].placedQuantity === cart.items[cartItemIndex].quantity) {
              // Удаляем этот товар из тележки
              cart.items.splice(cartItemIndex, 1);
            }
          }
          
          // Если в тележке больше нет товаров, освобождаем её
          if (cart.items.length === 0) {
            cart.status = 'free';
            item.placementCartId = null;
          }
          
          await cart.save();
        }
      }
  
      await invoice.save();
      res.status(200).json({ inventory: { sku: item.sku, quantity, locationId }, location });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Проведение инвентаризации (корректировка остатков)
export async function adjustInventory(req, res) {
    try {
      const { sku, locationId, actualQuantity, notes } = req.body;
      
      // Проверка существования товара
      const product = await Product.findOne({ sku });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      // Проверка существования ячейки
      const location = await Location.findById(locationId);
      if (!location) {
        return res.status(404).json({ error: 'Location not found' });
      }
      
      // Получаем текущие остатки в ячейке
      const existingInventory = await Inventory.findOne({ sku, locationId });
      const currentQuantity = existingInventory ? existingInventory.quantity : 0;
      
      // Разница между фактическим и текущим количеством
      const diff = actualQuantity - currentQuantity;
      
      if (diff !== 0) {
        // Обновляем инвентарь
        if (existingInventory) {
          // Если есть запись - обновляем количество
          existingInventory.quantity = actualQuantity;
          await existingInventory.save();
        } else if (actualQuantity > 0) {
          // Если записи нет и количество > 0, создаем новую запись
          await Inventory.create({
            sku,
            quantity: actualQuantity,
            locationId,
            status: 'placed'
          });
        }
        
        // Обновляем использованную вместимость ячейки
        location.usedCapacity = location.usedCapacity + diff;
        location.status = location.usedCapacity >= location.capacity ? 'occupied' : 
                          location.usedCapacity > 0 ? 'reserved' : 'available';
        await location.save();
        
        // Создаем запись в журнале инвентаризации (для отслеживания корректировок)
        // Это можно реализовать позже с использованием отдельной модели
      }
      
      // Формируем ответ
      const adjustmentResult = {
        sku,
        productName: product.name,
        locationId,
        locationBarcode: location.barcode,
        previousQuantity: currentQuantity,
        actualQuantity,
        adjustment: diff,
        notes: notes || '',
        timestamp: new Date()
      };
      
      res.status(200).json(adjustmentResult);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }