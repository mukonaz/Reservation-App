const Restaurant = require('../models/Restaurant');
const Reservation = require('../models/Reservation');
const User = require('../models/User');

exports.addRestaurantAdmin = async (req, res) => {
  try {
    const { restaurantId, adminEmail } = req.body;
    
    // Find the user by email
    const user = await User.findOne({ email: adminEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if user is already an admin
    if (restaurant.admins.includes(user._id)) {
      return res.status(400).json({ message: "User is already an admin for this restaurant" });
    }

    // Add user to restaurant admins
    restaurant.admins.push(user._id);
    await restaurant.save();

    // Update user's managed restaurants
    user.role = 'restaurant_admin';
    user.managedRestaurants.push(restaurantId);
    await user.save();

    res.status(200).json({ 
      message: "Restaurant admin added successfully", 
      restaurant 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error adding restaurant admin", 
      error: error.message 
    });
  }
};

exports.getRestaurantAnalytics = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    // Ensure the user is an admin of this restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Detailed analytics
    const reservations = await Reservation.find({ 
      restaurant: restaurantId,
      status: { $ne: 'cancelled' }
    });

    // Calculate analytics
    const totalReservations = reservations.length;
    const cancelledReservations = await Reservation.countDocuments({
      restaurant: restaurantId,
      status: 'cancelled'
    });

    // Calculate average party size
    const averagePartySize = reservations.reduce((sum, res) => sum + res.partySize, 0) / totalReservations || 0;

    // Analyze peak hours
    const hourlyReservations = {};
    reservations.forEach(res => {
      const hour = new Date(res.date).getHours();
      hourlyReservations[hour] = (hourlyReservations[hour] || 0) + 1;
    });

    // Convert to peak hours array
    const peakHours = Object.entries(hourlyReservations)
      .map(([hour, count]) => ({ hour, reservationCount: count }))
      .sort((a, b) => b.reservationCount - a.reservationCount)
      .slice(0, 5);

    // Update restaurant analytics
    restaurant.restaurantAnalytics = {
      totalReservations,
      cancelledReservations,
      averagePartySize,
      peakHours
    };
    await restaurant.save();

    // Prepare response
    const analytics = {
      totalReservations,
      cancelledReservations,
      reservationRate: (totalReservations / (totalReservations + cancelledReservations)) * 100 || 0,
      averagePartySize,
      peakHours,
      monthlyReservations: await getMonthlyReservations(restaurantId)
    };

    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching restaurant analytics", 
      error: error.message 
    });
  }
};

// Helper function to get monthly reservations
async function getMonthlyReservations(restaurantId) {
  const monthlyReservations = await Reservation.aggregate([
    { 
      $match: { 
        restaurant: mongoose.Types.ObjectId(restaurantId),
        status: { $ne: 'cancelled' }
      } 
    },
    { 
      $group: {
        _id: { 
          month: { $month: "$date" },
          year: { $year: "$date" }
        },
        count: { $sum: 1 }
      }
    },
    { 
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);

  return monthlyReservations.map(item => ({
    month: item._id.month,
    year: item._id.year,
    reservationCount: item.count
  }));
}

exports.updateRestaurantOperatingHours = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { operatingHours } = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { operatingHours },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ 
      message: "Operating hours updated successfully", 
      restaurant 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating operating hours", 
      error: error.message 
    });
  }
};

exports.getRestaurantReservations = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { 
      status, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 10 
    } = req.query;

    const query = { restaurant: restaurantId };

    // Add status filter if provided
    if (status) query.status = status;

    // Add date range filter if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const reservations = await Reservation.find(query)
      .populate('user', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Reservation.countDocuments(query);

    res.status(200).json({
      reservations,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReservations: total
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching restaurant reservations", 
      error: error.message 
    });
  }
};