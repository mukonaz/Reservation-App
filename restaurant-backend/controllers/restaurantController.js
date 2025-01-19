const Restaurant = require('../models/Restaurant');

exports.getRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
};

exports.addRestaurant = async (req, res) => {
  const { name, location, cuisine, slots } = req.body;
  const newRestaurant = new Restaurant({ name, location, cuisine, slots });
  await newRestaurant.save();
  res.json(newRestaurant);
};

exports.updateRestaurant = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!updatedRestaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.status(200).json(updatedRestaurant);
    } catch (error) {
      res.status(500).json({ message: "Error updating restaurant", error });
    }
  };
  
  exports.deleteRestaurant = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
      if (!deletedRestaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.status(200).json({ message: "Restaurant deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting restaurant", error });
    }
  };