import mongoose from 'mongoose';

const { Schema } = mongoose;

const placementCartSchema = new Schema({
    status: {
      type: String,
      enum: ['free', 'occupied'],
      default: 'free'
    },
    items: [{
      invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
      itemId: { type: String },
      sku: { type: String },
      quantity: { type: Number }
    }],
    createdAt: { type: Date, default: Date.now },
  });

const PlacementCart = mongoose.model('PlacementCart', placementCartSchema);

export default PlacementCart;