import Invoice from '../models/invoice.js';
import Product from '../models/product.js';
import Inventory from '../models/inventory.js';
import PlacementCart from '../models/placementCart.js';

export async function getInvoices(req, res) {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createInvoice(req, res) {
  try {
    const invoiceData = req.body;
    const invoice = new Invoice({
      ...invoiceData,
      status: 'new',
    });

    // Заполняем Products из items
    for (const item of invoiceData.items || []) {
      const product = await Product.findOne({ sku: item.sku });
      if (!product) {
        await Product.create({
          sku: item.sku,
          productId: item.productId,
          name: item.name,
          barcode: item.barcode,
        });
      }
    }

    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function scanInvoice(req, res) {
  try {
    const { invoiceId } = req.params;
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    invoice.status = 'in_progress';
    await invoice.save();
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function scanItem(req, res) {
  try {
    const { invoiceId, itemId } = req.params;
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    const item = invoice.items.find((i) => i.id === itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    item.status = 'scanned';
    await invoice.save();
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function countItem(req, res) {
  try {
    const { invoiceId, itemId } = req.params;
    const { actualQuantity, placementCartId } = req.body;
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    const item = invoice.items.find((i) => i.id === itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    if (placementCartId) {
      const cart = await PlacementCart.findById(placementCartId);
      if (!cart) {
        return res.status(404).json({ error: 'Placement cart not found' });
      }
      if (cart.status === 'occupied') {
        return res.status(400).json({ error: 'Placement cart is already occupied' });
      }
      cart.status = 'occupied';
      item.placementCartId = placementCartId;
      await cart.save();
    }
    item.actualQuantity = actualQuantity;
    item.status = 'counted';
    await invoice.save();
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function completeInvoice(req, res) {
  try {
    const { invoiceId } = req.params;
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    const uncountedItems = invoice.items.some(item => item.status !== 'counted');
    if (uncountedItems) {
      return res.status(400).json({ error: 'All items must be counted before completing the invoice' });
    }
    const hasDiscrepancies = invoice.items.some(
      item => item.expectedQuantity !== item.actualQuantity
    );
    invoice.status = hasDiscrepancies ? 'accepted_with_discrepancies' : 'accepted';
    await invoice.save();
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}