const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: String,
  location: String,
  cuisine: String,
  slots: [Date], // Array of available time slots
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
