const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"]
  },

  content: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },

  messages: [messageSchema]

}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);