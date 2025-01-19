const express = require('express');
const { getRestaurants, addRestaurant } = require('../controllers/restaurantController');
const router = express.Router();

router.get('/', getRestaurants);
router.post('/', addRestaurant);

module.exports = router;
