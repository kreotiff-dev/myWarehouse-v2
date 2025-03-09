import mongoose from 'mongoose';

const { Schema } = mongoose;

// Схема для элементов (items) внутри накладной
const itemSchema = new Schema({
  id: { type: String, required: true },
  productId: { type: String, required: true },
  sku: { type: String, required: true },
  name: { type: String, required: true },
  barcode: { type: String },
  expectedQuantity: { type: Number, required: true },
  actualQuantity: { type: Number, default: 0 },
  status: { type: String, default: 'pending' },
});

// Схема для накладной
const invoiceSchema = new Schema({
  id: { type: String, required: true, unique: true },
  invoiceNumber: { type: String, required: true, unique: true },
  barcode: { type: String },
  status: { 
    type: String, 
    enum: ['new', 'in_progress', 'completed'], 
    default: 'new' 
  },
  items: [itemSchema],
  createdAt: { type: Date, default: Date.now },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;