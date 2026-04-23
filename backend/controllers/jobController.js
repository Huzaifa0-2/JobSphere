const Job = require("../models/Job");

// GET all jobs
exports.getAllJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
};

// CREATE job
exports.createJob = async (req, res) => {
  try {
    // Getting userId from Clerk to check if the adder is seeker or employer. As only employers has postedBy field. 
    const { postedBy } = req.body;

    if (!postedBy) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const job = await Job.create(req.body);

    res.json(job);

  } catch (error) {
    res.status(500).json({ message: "Error creating job" });
  }
};
// DELETE job
// exports.deleteJob = async (req, res) => {
//   await Job.findByIdAndDelete(req.params.id);
//   res.json({ message: "Deleted" });
// };

// DELETE job with security check
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // SECURITY CHECK
    if (job.postedBy !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Job.findByIdAndDelete(id);

    res.json({ message: "Job deleted" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting job" });
  }
};

// UPDATE job
// exports.updateJob = async (req, res) => {
//   const updated = await Job.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     { new: true }
//   );

//   res.json(updated);
// };

// UPDATE job with security check
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, ...updates } = req.body;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // SECURITY CHECK
    if (job.postedBy !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    res.json(updatedJob);

  } catch (error) {
    res.status(500).json({ message: "Error updating job" });
  }
};

// GET jobs of an employer
exports.getEmployerJobs = async (req, res) => {
  try {
    const { userId } = req.params;

    const jobs = await Job.find({ postedBy: userId });

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
};


// Search jobs
exports.searchJobs = async (req, res) => {
  try {
    const { title, location, minSalary } = req.query;

    let query = {};

    // TITLE SEARCH (partial match)
    if (title) {
      query.title = { $regex: title, $options: "i" }; // Mean find anything that contains the word, case-insensitive
    }

    // LOCATION FILTER
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // SALARY FILTER
    if (minSalary !== undefined && minSalary !== "") {
      query.salary = { $gte: Number(minSalary) };
    }

    // Greater than or equal to minSalary
    const jobs = await Job.find(query);

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};