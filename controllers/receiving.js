import Invoice from '../models/invoice.js';

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
    const { actualQuantity } = req.body;
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    const item = invoice.items.find((i) => i.id === itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
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
    invoice.status = 'completed';
    await invoice.save();
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}