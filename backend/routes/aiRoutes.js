const express = require("express");
const router = express.Router();
const { matchJobs, chatWithAI, analyzeCandidate, getChatHistory, generateInterviewQuestions } = require("../controllers/aiController");

router.post("/match", matchJobs);
router.post("/chat", chatWithAI);
router.get("/chathistory/:userId", getChatHistory);
router.post("/analyze-candidate", analyzeCandidate);
router.post("/interview-questions", generateInterviewQuestions);

module.exports = router;