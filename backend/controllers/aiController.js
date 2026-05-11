const axios = require("axios");
const Resume = require("../models/Resume");
const Job = require("../models/Job");
const Chat = require("../models/Chat");
const Application = require("../models/Applications");


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


// Get chat history
exports.getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const chat = await Chat.findOne({ userId });
        if (!chat) {
            return res.status(400).json({ message: "No chat history found" });
        }
        res.json(chat.messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching chat history" });
    }
}

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

exports.chatWithAI = async (req, res) => {
    try {
        const { userId, message } = req.body;

        // 1. Get resume
        const resume = await Resume.findOne({ userId });

        if (!resume) {
            return res.status(400).json({
                message: "Upload resume first"
            });
        }

        // 2. Find old chat
        let chat = await Chat.findOne({ userId });

        // 3. Create if not exists
        if (!chat) {
            chat = await Chat.create({
                userId,
                messages: []
            });
        }

        // 4. Build history
        const historyText = chat.messages
            .map(msg => `${msg.role}: ${msg.content}`)
            .join("\n");

        // 5. Add user message
        chat.messages.push({
            role: "user",
            content: message
        });

        // 6. Build prompt
        const prompt = `
You are a natural, intelligent, and professional AI assistant inside a modern job platform.

Your responses should feel similar to ChatGPT or Claude:
- conversational
- concise
- calm
- professional
- human-like

Adapt your response length to the user's message.

Rules:
- Keep simple questions short.
- Do not over-explain.
- Do not assume the user wants a full analysis unless explicitly asked.
- Match the depth of the response to the question.
- Avoid robotic or overly enthusiastic wording.
- Avoid recruiter-style or motivational language.
- Avoid buzzwords and filler.
- Avoid dramatic phrasing.
- Avoid section headers like "The Good", "Verdict", "Summary", etc.
- Do not use markdown formatting.
- Do not use markdown bullets (*, #, -, etc.).
- Keep formatting clean and natural.

For resume-related questions:
- Be honest, practical, and direct.
- Give concise observations unless the user asks for detailed feedback.
- If the user asks for a rating only, give a short rating with 1-2 brief reasons.

Resume:
${resume.resumeText || "No resume uploaded"}

User:
${message}
`;
        // Conversation history:
        // ${historyText || "No previous conversation"}
        // 7. Call Gemini
        let aiReply;
        try {
            aiReply = await callGemini("gemini-3-flash-preview", prompt);
            console.log("Using Gemini 3 Flash Preview");
        } catch (err) {
            console.log("Primary failed:", err.message);
            console.log("Switching to fallback model...");
            // Fallback to more stable model
            aiReply = await callGemini("gemini-3.1-flash-lite-preview", prompt);
            console.log("Using Gemini 3.1 Flash Lite Preview");
        }

        aiReply = aiReply
            .replace(/^```[\s\S]*?```$/gm, '') // Remove code blocks
            .replace(/^#+\s/gm, '') // Remove markdown headers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1') // Remove italic
            .trim();

        // 8. Save assistant reply
        chat.messages.push({
            role: "assistant",
            content: aiReply
        });

        // 9. Save chat
        await chat.save();

        // 10. Send response
        res.json({
            success: true,
            reply: aiReply,
            messages: chat.messages
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "AI chat failed"
        });
    }
};

// ANALYZE CANDIDATE
exports.analyzeCandidate = async (req, res) => {
    try {

        const { applicationId } = req.body;

        // Get application + job + resume
        const application = await Application.findById(applicationId)
            .populate("jobId")
            .populate("resumeId");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        const job = application.jobId;
        const resume = application.resumeId;

        // Build AI prompt
        const prompt = `
You are an expert AI hiring assistant.

JOB DETAILS:
Title: ${job.title}
Description: ${job.description || ""}
Requirements: ${job.requirements || ""}
Location: ${job.location}

APPLICANT RESUME:
${resume.resumeText}

TASK:
Analyze how suitable this applicant is for the job.

RETURN JSON ONLY:

{
  "matchScore": 0,
  "strengths": [],
  "missingSkills": [],
  "recommendation": ""
}

RULES:
- matchScore should be number between 0-100
- strengths should be concise
- missingSkills should be concise
- recommendation should be professional
- RETURN ONLY JSON
`;

        // AI response
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

        // Clean markdown if Gemini wraps JSON
        const cleaned = aiText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        res.json({
            success: true,
            analysis: parsed
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "AI analysis failed"
        });
    }
};


// Generate Interview Questions
exports.generateInterviewQuestions =
    async (req, res) => {

        try {

            const { resumeText, jobTitle, jobDescription, jobRequirements } = req.body;

            // // Fetch application
            // const application =
            //     await Application.findById(applicationId)
            //         .populate("jobId")
            //         .populate("resumeId");

            if (!resumeText || !jobTitle || !jobDescription || !jobRequirements) {
                return res.status(404).json({
                    message: "Missing required fields"
                });
            }

            // const job = application.jobId;

            // const resume = application.resumeId;

            // const resumeText = resume.resumeText;

            // AI Prompt
            const prompt = `
You are an expert technical interviewer.

JOB DETAILS:
Title: ${jobTitle}

Description:
${jobDescription || ""}

Requirements:
${jobRequirements}


CANDIDATE RESUME:
${resumeText}


TASK:
Generate personalized interview questions.

RETURN JSON ONLY:

{
  "technical": [],
  "behavioral": [],
  "projectBased": []
}

RULES:
- 5 technical questions
- 3 behavioral questions
- 3 project-based questions
- Questions must relate to BOTH resume and job
- RETURN ONLY JSON
`;



            // Call Gemini
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

            // Clean markdown
            const cleaned = aiText
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();


            // Parse JSON
            const parsed =
                JSON.parse(cleaned);


            res.json({
                success: true,
                questions: parsed
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message:
                    "Failed to generate interview questions"
            });
        }
    };