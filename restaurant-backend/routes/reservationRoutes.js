const express = require('express');
const router = express.Router();
const { 
  createReservation, 
  getUserReservations 
} = require('../controllers/reservationController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware); 
router.post('/', createReservation);
router.get('/user', getUserReservations);

module.exports = router;
