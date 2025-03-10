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

export async function getPlacementCartById(req, res) {
    try {
      const cart = await PlacementCart.findById(req.params.id);
      if (!cart) {
        return res.status(404).json({ error: 'Placement cart not found' });
      }
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }