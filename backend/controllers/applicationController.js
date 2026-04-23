const mongoose = require("mongoose");
const Application = require("../models/Applications");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
// const pdfParse = require("pdf-parse");
const pdfParse = require("pdf-parse/lib/pdf-parse");


// GET applications by user (seeker)
exports.getApplicationsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // const applications = await Application.find({ userId });
        const applications = await Application.find({ userId }).populate("jobId");

        res.json(applications);

    } catch (error) {
        res.status(500).json({ message: "Error fetching user applications" });
    }
};


// GET applications for a job (employer)
exports.getApplicationsByJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        // const applications = await Application.find({ jobId });
        const applications = await Application.find({ jobId }).populate("jobId");

        res.json(applications);

    } catch (error) {
        res.status(500).json({ message: "Error fetching applications" });
    }
};


// UPDATE status
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updated = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        res.json(updated);

    } catch (error) {
        res.status(500).json({ message: "Error updating status" });
    }
};

// APPLY JOB
exports.applyJob = async (req, res) => {
    try {
        const { jobId, userId } = req.body;

        // Prevent duplicate apply
        const existing = await Application.findOne({ userId, jobId });
        if (existing) {
            return res.status(400).json({ message: "Already applied" });
        }

        // file from multer
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "raw" },
            async (error, result) => {
                if (error) return res.status(500).json(error);

                const resumeUrl = result.secure_url;

                // Extract text
                const data = await pdfParse(file.buffer);
                const resumeText = data.text;

                // Save in DB
                const application = await Application.create({
                    userId: req.body.userId,
                    jobId: new mongoose.Types.ObjectId(req.body.jobId),
                    resumeUrl,
                    resumeText
                });

                res.json(application);
            }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error applying job" });
    }
};