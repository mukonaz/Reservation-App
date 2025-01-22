const Reservation = require('../models/Reservation');

exports.createReservation = async (req, res) => {
  try {
    const { restaurantId, date } = req.body;
    const userId = req.user.id; 

    const reservation = new Reservation({
      user: userId,
      restaurant: restaurantId,
      date: new Date(date)
    });

    await reservation.save();
    res.status(201).json({ 
      message: "Reservation created successfully", 
      reservation: await reservation.populate('restaurant')
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating reservation", error: error.message });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('restaurant')
      .sort({ date: -1 });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error: error.message });
  }
};