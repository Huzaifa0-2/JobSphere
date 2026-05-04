// const mongoose = require("mongoose");

// const applicationSchema = new mongoose.Schema({
//   userId: String,
//   jobId: {
//     type: require("mongoose").Schema.Types.ObjectId,
//     ref: "Job"
//   },
//   resumeUrl: String,
//   resumeText: String,

//   status: {
//     type: String,
//     enum: ["pending", "accepted", "rejected"],
//     default: "pending"
//   }
// }, { timestamps: true });

// module.exports = mongoose.model("Application", applicationSchema);

const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  userId: String,
    userName: {
    type: String,
    default: ""  // Stores empty string if not provided
  },

  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
    required: true
  },

  resumeUrl: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);