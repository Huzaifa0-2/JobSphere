const Profile = require("../models/Profile");

// GET seeker profile
exports.getSeekerProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.params.userId });
        res.json(profile);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE/UPDATE seeker profile
exports.addUpdateSeekerProfile = async (req, res) => {
    try {
        const { userId } = req.params;  // Clerk userId (string)
        const profileData = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Find profile by Clerk userId (not MongoDB _id)
        let profile = await Profile.findOne({ userId });

        if (profile) {
            // UPDATE existing profile
            profile = await Profile.findOneAndUpdate(
                { userId },  // Find by Clerk userId
                profileData,
                { new: true, runValidators: true }
            );
        } else {
            // CREATE new profile
            profile = await Profile.create({
                userId,  // Store Clerk userId
                ...profileData
            });
        }

        res.json(profile);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating/updating profile", error: error.message });
    }
};

// UPDATE seeker profile
// exports.updateSeekerProfile = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const { profileData } = req.body;
//         const updatedProfile = await Profile.findByIdAndUpdate(
//             userId,
//             profileData,
//             { new: true }
//         );
//         res.json(updatedProfile);
//     } catch (error) {
//         res.status(500).json({ message: "Error updating profile" });
//     }
// };
