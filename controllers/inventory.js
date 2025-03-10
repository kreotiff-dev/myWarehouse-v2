import Inventory from '../models/inventory.js';
import Location from '../models/location.js';
import PlacementCart from '../models/placementCart.js';
import Invoice from '../models/invoice.js';

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
    if (location.usedCapacity + quantity > location.capacity) {
      return res.status(400).json({ error: 'Insufficient capacity in location' });
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
        // Если весь товар размещён, освобождаем тележку
        if (item.placedQuantity === item.actualQuantity) {
          cart.status = 'free';
          item.placementCartId = null;
          await cart.save();
        }
      }
    }

    await invoice.save();
    res.status(200).json({ inventory: { sku: item.sku, quantity, locationId }, location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}