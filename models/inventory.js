import mongoose from 'mongoose';

const { Schema } = mongoose;

const inventorySchema = new Schema({
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
  itemId: { type: String, required: true }, // ID товара из накладной
  productId: { type: String, required: true },
  sku: { type: String, required: true },
  name: { type: String, required: true },
  barcode: { type: String },
  quantity: { type: Number, required: true }, // Фактическое количество
  locationId: { type: Schema.Types.ObjectId, ref: 'Location' }, // Ячейка
  createdAt: { type: Date, default: Date.now },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;