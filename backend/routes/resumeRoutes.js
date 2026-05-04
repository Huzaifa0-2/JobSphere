const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { uploadResume, getResume } = require("../controllers/resumeController");

const Resume = require("../models/Resume");

// upload resume
router.post("/upload", upload.single("resume"), uploadResume); // Multer middleware to handle file upload

// get resume
router.get("/:userId", getResume);

module.exports = router;