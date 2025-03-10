import Location from '../models/location.js';

export async function getLocations(req, res) {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createLocation(req, res) {
  try {
    const locationData = req.body;
    const location = new Location(locationData);
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}