const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },

  role: {
    type: String,
    enum: ["employer", "seeker"],
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);