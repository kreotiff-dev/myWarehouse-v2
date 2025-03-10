// models/pickingCart.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const pickingCartSchema = new Schema({
  barcode: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['free', 'assigned', 'in_use', 'complete'],
    default: 'free'
  },
  assignedTo: { type: String }, // ID сотрудника
  pickingTaskId: { type: Schema.Types.ObjectId, ref: 'PickingTask' },
  items: [{
    sku: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PickingCart = mongoose.model('PickingCart', pickingCartSchema);

export default PickingCart;