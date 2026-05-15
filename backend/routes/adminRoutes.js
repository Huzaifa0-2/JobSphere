const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const express = require("express");

const router = express.Router();

const {
    getDashboardStats,
    getAllUsers,
    getAllJobs,
    deleteUser,
    deleteJob
} = require("../controllers/adminController");

router.get("/stats", protect, allowRoles("admin"), getDashboardStats);

router.get("/users", protect, allowRoles("admin"), getAllUsers);

router.get("/jobs", protect, allowRoles("admin"), getAllJobs);

router.delete("/user/:id", protect, allowRoles("admin"), deleteUser);

router.delete("/job/:id", protect, allowRoles("admin"), deleteJob);

// router.get("/stats", getDashboardStats);

// router.get("/users", getAllUsers);

// router.get("/jobs", getAllJobs);

// router.delete("/user/:id", deleteUser);

// router.delete("/job/:id", deleteJob);

module.exports = router;