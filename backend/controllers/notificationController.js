const Notification = require("../models/Notification");


// GET USER NOTIFICATIONS
exports.getNotifications = async (req, res) => {
  try {

    const { userId } = req.params;

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }); // Sort by newest first

    res.json(notifications);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching notifications"
    });
  }
};



// MARK AS READ
exports.markAsRead = async (req, res) => {
  try {

    const { id } = req.params;

    const updated =
      await Notification.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      message: "Error updating notification"
    });
  }
};