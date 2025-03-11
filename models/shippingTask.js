// models/shippingTask.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const shippingTaskSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  packingTaskId: { type: Schema.Types.ObjectId, ref: 'PackingTask', required: true },
  assignedTo: { type: String },
  status: { 
    type: String, 
    enum: ['created', 'in_progress', 'completed', 'cancelled'], 
    default: 'created' 
  },
  trackingNumber: { type: String },
  carrier: { type: String },
  shippingMethod: { type: String },
  shippingCost: { type: Number },
  cancellationReason: { type: String },
  shippingAddress: {
    name: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String }
  },
  startedAt: { type: Date },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const ShippingTask = mongoose.model('ShippingTask', shippingTaskSchema);

export default ShippingTask;