import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
  sku: { type: String, required: true, unique: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },
  barcode: { type: String },
  category: { type: String, default: 'Общая' },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    weight: { type: Number }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Виртуальное поле для получения остатков (будет заполняться из Inventory)
productSchema.virtual('stockData').get(function() {
  return {
    stockQuantity: 0,  // Будет заполняться в контроллере
    locations: []      // Будет заполняться в контроллере
  };
});

const Product = mongoose.model('Product', productSchema);

export default Product;