const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'restaurant_admin'], 
    default: 'admin' 
  },
  managedRestaurants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant' 
  }]
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
