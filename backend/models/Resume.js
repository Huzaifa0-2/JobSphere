const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },

  resumeUrl: {
    type: String,
    required: true
  },

  resumeText: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);