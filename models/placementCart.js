import mongoose from 'mongoose';

const { Schema } = mongoose;

const placementCartSchema = new Schema({
  status: {
    type: String,
    enum: ['free', 'occupied'],
    default: 'free'
  },
  createdAt: { type: Date, default: Date.now },
});

const PlacementCart = mongoose.model('PlacementCart', placementCartSchema);

export default PlacementCart;