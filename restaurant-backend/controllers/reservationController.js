const Reservation = require("../models/Reservation");

exports.createReservation = async (req, res) => {
  try {
    const { restaurantId, date, guestCount } = req.body;
    const userId = req.user.id;

    // Calculate amount to charge based on guestCount (e.g., $10 per guest)
    const amount = guestCount * 1000; // Example: $10 per guest in cents

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Payment amount in cents
      currency: "usd", // Currency code
      automatic_payment_methods: { enabled: true }, // Automatic payment methods
    });

    // Create a reservation in the database
    const reservation = new Reservation({
      user: userId,
      restaurant: restaurantId,
      date: new Date(date),
      guestCount,
      paymentIntentId: paymentIntent.id, // Store the Stripe payment intent ID
    });

    await reservation.save();

    // Populate restaurant details to include in the response
    const populatedReservation = await reservation.populate("restaurant");

    // Return the reservation along with the clientSecret from Stripe
    res.status(201).json({
      message: "Reservation created successfully",
      reservation: populatedReservation,
      clientSecret: paymentIntent.client_secret, // Provide the client secret for Stripe payment confirmation
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating reservation",
      error: error.message,
    });
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

// // Combine `makeReservation` logic into a single function
// exports.makeReservation = async ({ restaurantId, date, guestCount }) => {
//   try {
//     const response = await fetch("/api/create-payment-intent", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         amount: guestCount * 1000, // Example: $10 per guest
//         currency: "usd",
//       }),
//     });

//     const { clientSecret } = await response.json();
//     return { clientSecret };
//   } catch (error) {
//     throw new Error("Error creating payment intent: " + error.message);
//   }
// };

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId)
      .populate("restaurant")
      .populate("user");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reservation", error: error.message });
  }
};