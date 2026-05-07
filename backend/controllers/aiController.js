const axios = require("axios");
const Resume = require("../models/Resume");
const Job = require("../models/Job");

// Helper function to call Gemini API
const callGemini = async (model, prompt) => {
    const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
        }
    );

    return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

// Main function to match jobs
exports.matchJobs = async (req, res) => {
    try {
        const { userId } = req.body;

        // 1. Get resume from database
        const resume = await Resume.findOne({ userId });
        if (!resume) {
            return res.status(400).json({ message: "No resume found" });
        }

        // 2. Get jobs from database
        const jobs = await Job.find().limit(15);

        // 3. Format jobs as plain text (using join)
        const jobsText = jobs.map(job => `
Job ID: ${job._id}
Title: ${job.title}
Company: ${job.company || "Not specified"}
Location: ${job.location}
Salary: ${job.salary}
Description: ${job.description || "No description"}
Requirements: ${job.requirements || "No requirements"}
Job Type: ${job.jobType || "No job type"}
Experience: ${job.experience || "No experience"}
`).join("\n-----------------\n");

        // 4. Build prompt for AI
        const prompt = `
You are an AI job matching assistant.

USER RESUME:
${resume.resumeText}

AVAILABLE JOBS:
${jobsText}

TASK:
1. Analyze the resume
2. Match the best jobs
3. Return top 3 jobs that best suit the candidate

RESPONSE FORMAT (return as JSON only):
{
  "matches": [
    {
    "jobId": "",
    "jobTitle": "",
    "company": "",
    "location": "",
    "salary": "",
    "description": "",
    "requirements": "",
    "jobType": "",
    "experience": "",
    "matchPercentage": "",
    "reason": "",
    "skillsGap": ""
    }
  ]
}

IMPORTANT:
- Return ONLY valid JSON
- No extra text, no explanations
- Match percentage should be a number like "85%"
- Be honest about skills gaps
`;

        // 5. Call Gemini with fallback
        let aiText;

        try {
            // Try primary model first (faster, cheaper)
            aiText = await callGemini("gemini-3-flash-preview", prompt);
            console.log("Using Gemini 3 Flash Preview");
        } catch (err) {
            console.log("Primary failed:", err.message);
            console.log("Switching to fallback model...");
            // Fallback to more stable model
            aiText = await callGemini("gemini-3.1-flash-lite-preview", prompt);
            console.log("Using Gemini 3.1 Flash Lite Preview");
        }

        // CLEAN THE RESPONSE (remove extra text)
        let cleaned = aiText
            .replace(/```json/g, "")    // Remove ```json
            .replace(/```/g, "")         // Remove ```
            .trim();                      // Remove extra spaces

        // Find first { and last } to extract JSON only
        let start = cleaned.indexOf('{');
        let end = cleaned.lastIndexOf('}') + 1;
        if (start !== -1 && end !== 0) {
            cleaned = cleaned.substring(start, end);
        }

        // 6. Parse AI response (handle both JSON and plain text)
        let parsed;
        try {
            // Try to parse as JSON
            parsed = JSON.parse(cleaned);
        } catch {
            // If not JSON, return as plain text
            return res.json({
                reply: cleaned,
                message: "AI returned plain text instead of JSON"
            });
        }

        // 7. Send success response
        res.json({
            success: true,
            matches: parsed.matches || []
        });

    } catch (error) {
        console.error("Error in matchJobs:", error);
        res.status(500).json({
            success: false,
            message: "Failed to match jobs",
            error: error.message
        });
    }
};