// models/packingTask.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const packingTaskSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  pickingTaskId: { type: Schema.Types.ObjectId, ref: 'PickingTask' },
  pickingCartId: { type: Schema.Types.ObjectId, ref: 'PickingCart' },
  assignedTo: { type: String },
  status: { 
    type: String, 
    enum: ['created', 'in_progress', 'completed', 'cancelled'], 
    default: 'created' 
  },
  packageInfo: {
    weight: { type: Number },
    packageType: { type: String, enum: ['box', 'envelope', 'pallet', 'other'] }
  },
  startedAt: { type: Date },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const PackingTask = mongoose.model('PackingTask', packingTaskSchema);

export default PackingTask;