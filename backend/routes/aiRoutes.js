const express = require("express");
const router = express.Router();
const { matchJobs, chatWithAI, analyzeCandidate } = require("../controllers/aiController");

router.post("/match", matchJobs);
router.post("/chat", chatWithAI);
router.post("/analyze-candidate", analyzeCandidate);

module.exports = router;