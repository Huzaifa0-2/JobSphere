const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Applications");


// DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {

  try {

    const totalUsers =
      await User.countDocuments();

    const totalSeekers =
      await User.countDocuments({
        role: "seeker"
      });

    const totalEmployers =
      await User.countDocuments({
        role: "employer"
      });

    const totalJobs =
      await Job.countDocuments();

    const totalApplications =
      await Application.countDocuments();

    res.json({
      totalUsers,
      totalSeekers,
      totalEmployers,
      totalJobs,
      totalApplications
    });

  } catch (error) {

    res.status(500).json({
      message: "Admin stats error"
    });
  }
};


// ALL USERS
exports.getAllUsers = async (req, res) => {

  try {

    const users = await User.find();

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching users"
    });
  }
};


// ALL JOBS
exports.getAllJobs = async (req, res) => {

  try {

    const jobs = await Job.find();

    res.json(jobs);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching jobs"
    });
  }
};


// DELETE USER
exports.deleteUser = async (req, res) => {

  try {

    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "User deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: "Delete user failed"
    });
  }
};


// DELETE JOB
exports.deleteJob = async (req, res) => {

  try {

    await Job.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Job deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: "Delete job failed"
    });
  }
};