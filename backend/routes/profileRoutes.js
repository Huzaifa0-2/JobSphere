const express = require("express");
const router = express.Router();

const { getSeekerProfile, addUpdateSeekerProfile } = require("../controllers/profileController");

router.get("/:userId", getSeekerProfile);
router.post("/:userId", addUpdateSeekerProfile);
// router.put("/:userId", updateSeekerProfile);

module.exports = router;
