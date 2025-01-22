const express = require('express');
const router = express.Router();
const { 
  getRestaurants, 
  addRestaurant, 
  updateRestaurant, 
  deleteRestaurant 
} = require('../controllers/restaurantController');

router.get('/', getRestaurants);
router.post('/', addRestaurant);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

module.exports = router;