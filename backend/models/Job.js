const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  postedBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Job", jobSchema);