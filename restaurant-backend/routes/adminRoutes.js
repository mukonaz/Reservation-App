const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

// Middleware to check if user is an admin or restaurant admin
const checkAdminAccess = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role !== 'admin' && user.role !== 'restaurant_admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// Restaurant Admin Routes
router.post('/restaurant-admin', authMiddleware, checkAdminAccess, adminController.addRestaurantAdmin);
router.get('/restaurant/:restaurantId/analytics', authMiddleware, checkAdminAccess, adminController.getRestaurantAnalytics);
router.put('/restaurant/:restaurantId/operating-hours', authMiddleware, checkAdminAccess, adminController.updateRestaurantOperatingHours);
router.get('/restaurant/:restaurantId/reservations', authMiddleware, checkAdminAccess, adminController.getRestaurantReservations);

module.exports = router;