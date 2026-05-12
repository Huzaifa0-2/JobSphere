const express = require("express");

const router = express.Router();

const {
    getEmployerAnalytics
} = require("../controllers/analyticsController");

router.get("/employer/:employerId", getEmployerAnalytics);

module.exports = router;