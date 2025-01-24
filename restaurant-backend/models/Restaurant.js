const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  cuisine: { type: String, required: true },
  slots: [{ type: Date, required: true }], 
  admins: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  restaurantAnalytics: {
    totalReservations: { type: Number, default: 0 },
    cancelledReservations: { type: Number, default: 0 },
    averagePartySize: { type: Number, default: 0 },
    peakHours: [{ hour: String, reservationCount: Number }]
  }
}, { timestamps: true });


module.exports = mongoose.model('Restaurant', RestaurantSchema);