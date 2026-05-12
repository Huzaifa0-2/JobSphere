const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const pdfParse = require("pdf-parse/lib/pdf-parse");
const Application = require("../models/Applications");
const streamifier = require("streamifier");
const Notification = require("../models/Notification");
const User = require("../models/User");

const { sendApplicationStatusEmail } = require("../services/emailService");

// GET applications by user (seeker)
exports.getApplicationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const applications = await Application.find({ userId }).populate("jobId");
    const validApplications = applications.filter(app => app.jobId !== null);

    res.json(validApplications);

  } catch (error) {
    res.status(500).json({ message: "Error fetching user applications" });
  }
};


// GET applications for a job (employer)
exports.getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // const applications = await Application.find({ jobId });
    const applications = await Application.find({ jobId })
      .populate("jobId") // Take ref from model and add all data of job through jobId
      .populate("resumeId"); // Take ref from model and add all data of resume through resumeId
    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: "Error fetching applications" });
  }
};


// UPDATE status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobTitle, status } = req.body;

    const updated = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("jobId");

    const user = await User.findOne({
      clerkId: updated.userId
    });

    // SEND EMAIL
    if (user?.email) {
      await sendApplicationStatusEmail(
        user.email,
        updated.jobId.title,
        status,
        updated.jobId.company,
        updated.userName
      );
    }

    
    // Create notification for seeker
    await Notification.create({
      userId: updated.userId,

      title: jobTitle,

      message:
        `Your application status was updated to ${status}`
    });

    // const notifications = await Notification.find({ userId: updated.userId })
    // const unreadCount = notifications.filter(n => !n.isRead).length;
    const notifications = await Notification.find({ userId: updated.userId }).sort({ createdAt: -1 }); // Sort by newest first

    // res.json(notifications);

    const userSocket = global.onlineUsers[updated.userId];

    if (userSocket) {

      // Notification Count Socket
      global.io.to(userSocket).emit("notificationCountUpdated", notifications);

      // Status SOCKET
      global.io.to(userSocket).emit("applicationStatusUpdated", {
        status,
        jobTitle: updated.jobId.title
      }
      );
    }
    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
};

// APPLY JOB
exports.applyJob = async (req, res) => {
  try {
    const { userId, jobId, userName, resumeId, resumeUrl } = req.body;

    // CRITICAL CHECK (REAL WORLD SECURITY)
    const existing = await Application.findOne({ userId, jobId });

    if (existing) {
      return res.status(400).json({
        message: "You already applied to this job"
      });
    }

    const application = await Application.create({
      userId,
      jobId,
      userName,
      resumeId,
      resumeUrl
    });

    res.json(application);

  } catch (error) {
    res.status(500).json({ message: "Error applying job" });
  }
};

// CHECK if user has already applied for a job
exports.checkApplication = async (req, res) => {
  try {
    const { userId, jobId } = req.query;

    const exists = await Application.findOne({ userId, jobId });

    res.json({ applied: !!exists });

  } catch (error) {
    res.status(500).json({ message: "Error checking application" });
  }
};