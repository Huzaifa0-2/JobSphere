const express = require("express");
const router = express.Router();

const {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
  getEmployerJobs
} = require("../controllers/jobController");

router.get("/", getJobs);
router.post("/", createJob);
router.delete("/:id", deleteJob);
router.put("/:id", updateJob);

router.get("/employer/:userId", getEmployerJobs);



module.exports = router;