import mongoose from 'mongoose';

const { Schema } = mongoose;

const pickingItemSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  orderItemId: { type: Schema.Types.ObjectId, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  sku: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  pickedQuantity: { type: Number, default: 0 },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location' },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'picked', 'cancelled'], 
    default: 'pending' 
  }
});

const pickingTaskSchema = new Schema({
  orderIds: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  assignedTo: { type: String }, // ID сотрудника
  status: { 
    type: String, 
    enum: ['created', 'assigned', 'in_progress', 'completed', 'cancelled'], 
    default: 'created' 
  },
  items: [pickingItemSchema],
  startedAt: { type: Date },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const PickingTask = mongoose.model('PickingTask', pickingTaskSchema);

export default PickingTask;