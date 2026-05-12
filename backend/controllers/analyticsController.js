const Job = require("../models/Job");
const Application = require("../models/Applications");

exports.getEmployerAnalytics = async (req, res) => {

    try {

        const { employerId } = req.params;

        // GET EMPLOYER JOBS
        const jobs = await Job.find({
            postedBy: employerId
        });

        const jobIds = jobs.map(job => job._id);

        // TOTAL JOBS
        const totalJobs = jobs.length;

        // TOTAL APPLICATIONS
        const totalApplications = await Application.countDocuments({
            jobId: { $in: jobIds }
        });

        // ACCEPTED
        const accepted = await Application.countDocuments({
            jobId: { $in: jobIds },
            status: "accepted"
        });

        // REJECTED
        const rejected = await Application.countDocuments({
            jobId: { $in: jobIds },
            status: "rejected"
        });

        // PENDING
        const pending = await Application.countDocuments({
            jobId: { $in: jobIds },
            status: "pending"
        });

        // APPLICATIONS PER JOB
        const applicationsPerJob = await Application.aggregate([
            {
                $match: {
                    jobId: { $in: jobIds }
                }
            },

            {
                $group: {
                    _id: "$jobId",
                    count: { $sum: 1 }
                }
            }
        ]);

        // ADD JOB TITLES
        const formattedJobs = applicationsPerJob.map(item => {
            const foundJob = jobs.find(
                job =>
                    job._id.toString() ===
                    item._id.toString()
            );

            return {
                title: foundJob?.title,
                applications: item.count
            };
        });

        // MOST APPLIED JOB
        let topJob = null;

        if (formattedJobs.length > 0) {

            topJob = formattedJobs.reduce(
                (max, current) =>
                    current.applications >
                        max.applications
                        ? current
                        : max
            );
        }

        res.json({
            totalJobs,
            totalApplications,
            accepted,
            rejected,
            pending,
            applicationsPerJob: formattedJobs,
            topJob
        });

    } catch (error) {

        res.status(500).json({
            message: "Analytics error"
        });
    }
};