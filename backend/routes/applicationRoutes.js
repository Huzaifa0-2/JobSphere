const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  applyJob,
  getApplicationsByJob,
  updateApplicationStatus,
  getApplicationsByUser,
  checkApplication,
} = require("../controllers/applicationController");


router.get("/job/:jobId", getApplicationsByJob);
router.put("/:id", updateApplicationStatus);
// router.post("/apply", upload.single("resume"), applyJob);

router.get("/user/:userId", getApplicationsByUser);



router.post("/apply", protect, allowRoles("seeker"), applyJob);

router.get("/check", checkApplication);

module.exports = router;