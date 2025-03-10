import PlacementCart from '../models/placementCart.js';

export async function createPlacementCart(req, res) {
  try {
    const cart = new PlacementCart();
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}