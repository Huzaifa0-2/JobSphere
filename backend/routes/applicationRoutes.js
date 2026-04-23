const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  applyJob,
  getApplicationsByJob,
  updateApplicationStatus,
  getApplicationsByUser,
} = require("../controllers/applicationController");


router.get("/job/:jobId", getApplicationsByJob);
router.put("/:id", updateApplicationStatus);
router.post("/apply", upload.single("resume"), applyJob);

router.get("/user/:userId", getApplicationsByUser);

module.exports = router;