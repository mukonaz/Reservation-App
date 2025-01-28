const Reservation = require("../models/Reservation");

exports.createReservation = async (req, res) => {
  try {
    const { restaurantId, date, guestCount } = req.body; // Include guestCount
    const userId = req.user.id;

    // Create a reservation
    const reservation = new Reservation({
      user: userId,
      restaurant: restaurantId,
      date: new Date(date),
      guestCount, // Store guest count
    });

    await reservation.save();

    // Populate restaurant details for the response
    const populatedReservation = await reservation.populate("restaurant");

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: populatedReservation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating reservation", error: error.message });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate("restaurant")
      .sort({ date: -1 }); // Sort by most recent
    res.status(200).json(reservations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reservations", error: error.message });
  }
};

// Combine `makeReservation` logic into a single function
exports.makeReservation = async ({ restaurantId, date, guestCount }) => {
  try {
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: guestCount * 1000, // Example: $10 per guest
        currency: "usd",
      }),
    });

    const { clientSecret } = await response.json();
    return { clientSecret };
  } catch (error) {
    throw new Error("Error creating payment intent: " + error.message);
  }
};
