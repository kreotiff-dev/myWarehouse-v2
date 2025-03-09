import mongoose from 'mongoose';

const { Schema } = mongoose;

const locationSchema = new Schema({
  barcode: { type: String, required: true, unique: true },
  zone: { type: String, required: true },
  aisle: { type: String, required: true },
  rack: { type: String, required: true },
  level: { type: String, required: true },
  position: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'reserved'], 
    default: 'available' 
  },
  capacity: { type: Number, required: true },
  usedCapacity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Location = mongoose.model('Location', locationSchema);

export default Location;