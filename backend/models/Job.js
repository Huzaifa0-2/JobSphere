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
  company: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  // postedAt: {
  //   type: Date,
  //   default: Date.now
  // },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Remote", "Contract"],
    default: "Full-time"
  },
  experience: {
    type: String,
    default: "1-3 years"
  },
  postedBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Job", jobSchema);