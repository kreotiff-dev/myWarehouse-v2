import mongoose from 'mongoose';

const { Schema } = mongoose;

const inventorySchema = new Schema({
  sku: { type: String, required: true, index: true }, // Связь с Product
  quantity: { type: Number, required: true }, // Размещённое количество
  locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true }, // Ячейка
  status: { type: String, enum: ['placed'], default: 'placed' }, // Пока только "placed"
  createdAt: { type: Date, default: Date.now },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;