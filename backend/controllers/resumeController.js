const Resume = require("../models/Resume");
const pdfParse = require("pdf-parse");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Get Resume
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.params.userId });
    res.json(resume);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching resume" });
  }
};


// Upload Resume
exports.uploadResume = async (req, res) => {
  try {
    const file = req.file;
    const { userId } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1. Upload to Cloudinary
    const uploadFromBuffer = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "raw" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await uploadFromBuffer(file.buffer);

    // 2. Extract text
    const pdfData = await pdfParse(file.buffer);

    // 3. Save in DB
    let resume = await Resume.findOne({ userId });

    if (resume) {
      // update existing
      resume.resumeUrl = result.secure_url;
      resume.resumeText = pdfData.text;
      await resume.save();
    } else {
      // create new
      resume = await Resume.create({
        userId,
        resumeUrl: result.secure_url,
        resumeText: pdfData.text
      });
    }

    res.json(resume);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Upload error" });
  }
};