const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  userId: String,
  jobId: {
    type: require("mongoose").Schema.Types.ObjectId,
    ref: "Job"
  },
  resumeUrl: String,
  resumeText: String,

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);