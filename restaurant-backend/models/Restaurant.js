const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  cuisine: { type: String, required: true },
  slots: [{ type: Date, required: true }], 
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);