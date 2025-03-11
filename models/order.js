import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  sku: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  pickedQuantity: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'reserved', 'picked', 'packed', 'cancelled'], 
    default: 'pending' 
  }
});

const orderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  externalOrderId: { type: String },
  customer: {
    name: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String }
  },
  status: { 
    type: String, 
    enum: ['new', 'processing', 'picking', 'picked', 'packing', 'packed', 'shipping', 'shipped', 'delivered', 'cancelled'], 
    default: 'new' 
  },
  priority: { type: Number, default: 0 }, // Приоритет заказа: выше число = выше приоритет
  items: [orderItemSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;