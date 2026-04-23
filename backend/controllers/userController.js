const User = require("../models/User");

// Create or get user
exports.createUser = async (req, res) => {
  try {
    const { clerkId, role } = req.body;

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({ clerkId, role });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

// Get user role
exports.getUser = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await User.findOne({ clerkId });

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};