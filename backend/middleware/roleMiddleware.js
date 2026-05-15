exports.allowRoles = (...roles) => {

    return (req, res, next) => {

        // CHECK ROLE
        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                message: "Access denied"
            });
        }

        // next() mean go to next middleware
        next();
    };
};