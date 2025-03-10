import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
  sku: { type: String, required: true, unique: true }, // Уникальный идентификатор товара
  productId: { type: String, required: true },
  name: { type: String, required: true },
  barcode: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

export default Product;