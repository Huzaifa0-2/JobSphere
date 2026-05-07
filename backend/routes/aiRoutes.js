const express = require("express");
const router = express.Router();
const { matchJobs } = require("../controllers/aiController");

router.post("/match", matchJobs);

module.exports = router;