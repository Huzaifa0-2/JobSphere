const User = require("../models/User");

exports.protect = async (req, res, next) => {

    try {

        // FRONTEND WILL SEND clerk user id from API headers 
        const clerkId = req.headers["userid"];

        if (!clerkId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // FIND USER
        const user = await User.findOne({ clerkId });

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        // SAVE USER IN REQUEST
        req.user = user;
        // next() mean go to next middleware
        next();

    } catch (error) {

        res.status(500).json({
            message: "Auth middleware error"
        });
    }
};