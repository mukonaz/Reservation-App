require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Stripe = require("stripe");
const stripe = Stripe("your-secret-key");

const restaurantRoutes = require("./routes/restaurantRoutes");
const {
    getRestaurants,
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
  } = require("./controllers/restaurantController");
const { loginUser } = require("./controllers/userController");
const router = express.Router();

router.get("/", getRestaurants); 
router.post("/", addRestaurant); 
router.put("/:id", updateRestaurant); 
router.delete("/:id", deleteRestaurant); 
router.post("/login", loginUser);

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/restaurants", restaurantRoutes);

app.get("/", (req, res) => {
  res.send("Restaurant Reservation App Backend is running.");
});

app.post("/create-payment-intent", async (req, res) => {
    const { amount, currency } = req.body;
  
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
      });
  
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = router;