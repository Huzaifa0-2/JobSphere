// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Dummy Data (like database for now)
// let jobs = [
//     {
//         id: 1,
//         title: "Frontend Developer",
//         salary: 50000,
//         location: "Karchi"
//     },
//     {
//         id: 2,
//         title: "Backend Developer",
//         salary: 70000,
//         location: "New York"
//     },
//     {
//         id: 3,
//         title: "UI Designer",
//         salary: 40000,
//         location: "Remote"
//     },
// ];

// // GET all jobs
// app.get("/jobs", (req, res) => {
//     res.json(jobs);
// });

// // POST a new job
// app.post("/jobs", (req, res) => {
//     const newJob = {
//         id: jobs.length + 1,
//         title: req.body.title,
//         salary: req.body.salary,
//         location: req.body.location
//     };

//     jobs.push(newJob);

//     res.json(newJob);
// });

// //Delete a job
// app.delete("/jobs/:id", (req, res) => {
//     const id = Number(req.params.id);

//     jobs = jobs.filter(job => job.id !== id);

//     res.json({ message: "Job deleted" })
// });

// // Update a job
// app.put("/jobs/:id", (req, res) => {
//   const id = Number(req.params.id);

//   let updatedJob;

//   jobs = jobs.map(job => {
//     if (job.id === id) {
//       updatedJob = { ...job, ...req.body };
//       return updatedJob;
//     }
//     return job;
//   });

//   res.json(updatedJob); // 🔥 send real updated job
// });

// app.listen(5000, () => {
//     console.log("Server running on port 5000");
// });



const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/jobs", require("./routes/jobRoutes"));

app.use("/applications", require("./routes/applicationRoutes"));

app.use("/users", require("./routes/userRoutes"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  
});