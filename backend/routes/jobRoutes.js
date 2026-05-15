const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const express = require("express");
const router = express.Router();

const {
  getAllJobs,
  createJob,
  deleteJob,
  updateJob,
  getEmployerJobs,
  searchJobs,
  getJobById,
} = require("../controllers/jobController");

router.get("/", getAllJobs);
router.post("/", protect, allowRoles("employer"), createJob);
router.delete("/:id", protect, allowRoles("employer"), deleteJob);
router.put("/:id", protect, allowRoles("employer"), updateJob);

router.get("/employer/:userId", protect, allowRoles("employer"), getEmployerJobs);

router.get("/search", searchJobs);

router.get("/:id", getJobById);

module.exports = router;