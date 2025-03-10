import Product from '../models/product.js';
import Inventory from '../models/inventory.js';
import Location from '../models/location.js';

// Получение списка всех товаров
export async function getProducts(req, res) {
  try {
    const { category, inStock } = req.query;
    
    // Базовый запрос
    let query = {};
    
    // Фильтр по категории, если указана
    if (category) {
      query.category = category;
    }
    
    // Получаем товары
    const products = await Product.find(query);
    
    // Если нужно фильтровать только товары в наличии
    if (inStock === 'true') {
      // Получаем данные инвентаря для всех товаров
      const skus = products.map(p => p.sku);
      const inventoryItems = await Inventory.find({ sku: { $in: skus } });
      
      // Группируем инвентарь по SKU
      const inventoryBySku = {};
      inventoryItems.forEach(item => {
        if (!inventoryBySku[item.sku]) {
          inventoryBySku[item.sku] = 0;
        }
        inventoryBySku[item.sku] += item.quantity;
      });
      
      // Оставляем только товары с положительным остатком
      const productsWithStock = products
        .filter(product => inventoryBySku[product.sku] > 0)
        .map(product => {
          const productObject = product.toObject();
          productObject.stockQuantity = inventoryBySku[product.sku] || 0;
          return productObject;
        });
      
      return res.status(200).json(productsWithStock);
    }
    
    // Если фильтр по наличию не требуется, просто возвращаем все товары
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Получение товара по ID
export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Получаем данные инвентаря
    const inventoryItems = await Inventory.find({ sku: product.sku });
    const totalQuantity = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Получаем информацию о ячейках
    const locationIds = inventoryItems.map(item => item.locationId);
    const locations = await Location.find({ _id: { $in: locationIds } });
    
    // Формируем ответ с остатками и размещением
    const productWithStock = product.toObject();
    productWithStock.stockQuantity = totalQuantity;
    productWithStock.locations = inventoryItems.map(item => {
      const location = locations.find(l => l._id.toString() === item.locationId.toString());
      return {
        locationId: item.locationId,
        quantity: item.quantity,
        locationInfo: location ? {
          barcode: location.barcode,
          zone: location.zone,
          aisle: location.aisle,
          rack: location.rack,
          level: location.level,
          position: location.position
        } : null
      };
    });
    
    res.status(200).json(productWithStock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Получение товара по штрихкоду
export async function getProductByBarcode(req, res) {
  try {
    const { barcode } = req.params;
    const product = await Product.findOne({ barcode });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Создание нового товара
export async function createProduct(req, res) {
  try {
    const productData = req.body;
    
    // Проверка наличия обязательных полей
    if (!productData.sku || !productData.name || !productData.productId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Проверка уникальности SKU
    const existingProduct = await Product.findOne({ sku: productData.sku });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product with this SKU already exists' });
    }
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}