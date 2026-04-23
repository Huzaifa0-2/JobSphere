import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import {
  fetchJobs,
  addJob,
  deleteJob,
  updateJob
} from "../features/jobs/jobSlice";

function EmployerDashboard() {
  const dispatch = useDispatch();
  const { jobs } = useSelector(state => state.jobs);
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [editId, setEditId] = useState(null);

  const [applications, setApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // ✅ Fetch employer jobs using Redux
  useEffect(() => {
    if (!user) return;
    dispatch(fetchJobs(user.id));
  }, [user]);

  // ✅ Submit Job
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !salary || !location) {
      alert("Fill all fields");
      return;
    }

    // Update Job
    if (editId) {
      dispatch(updateJob({
        id: editId,
        job: { title, salary: Number(salary), location },
        userId: user.id
      }));
    }
    // Add Job
    else {
      dispatch(addJob({
        title,
        salary: Number(salary),
        location,
        postedBy: user.id
      }));
    }

    setTitle("");
    setSalary("");
    setLocation("");
    setEditId(null);
  };

  // Delete Job
  const handleDelete = (id) => {
    dispatch(deleteJob({ id, userId: user.id }));
  };

  // ✅ Fetch Applicants (NORMAL FETCH — correct approach)
  const fetchApplications = async (jobId) => {
    setSelectedJobId(jobId);

    const res = await fetch(`http://localhost:5000/applications/job/${jobId}`);
    const data = await res.json();

    setApplications(data);
  };

  // ✅ Accept / Reject
  const updateStatus = async (id, status) => {
    const res = await fetch(`http://localhost:5000/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    const updated = await res.json();

    setApplications(prev =>
      prev.map(app =>
        app._id === id ? updated : app
      )
    );
  };

  return (
    <div>
      <h1>Employer Dashboard</h1>

      {/* 🟢 CREATE / UPDATE JOB */}
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="Salary"
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />

        <button type="submit">
          {editId ? "Update Job" : "Add Job"}
        </button>
      </form>

      {/* 🟢 JOB LIST */}
      <h2>Your Jobs</h2>

      {jobs.map(job => (
        <div key={job._id} style={{ border: "1px solid black", margin: "10px" }}>
          <h3>{job.title}</h3>

          <button onClick={() => handleDelete(job._id)}>
            Delete
          </button>

          <button onClick={() => {
            setEditId(job._id);
            setTitle(job.title);
            setSalary(job.salary.toString());
            setLocation(job.location);
          }}>
            Edit
          </button>

          <button onClick={() => fetchApplications(job._id)}>
            View Applicants
          </button>
        </div>
      ))}

      {/* APPLICATIONS */}
      {selectedJobId && (
        <>
          <h2>Applicants</h2>

          {applications.map(app => (
            <div key={app._id} style={{ border: "1px solid black", margin: "10px" }}>
              <p>User: {app.userId}</p>
              <p>Title: {app.jobId?.title}</p>
              <p>Status: {app.status}</p>

              <a href={app.resumeUrl} target="_blank">
                View Resume
              </a>

              <button onClick={() => updateStatus(app._id, "accepted")}>
                Accept
              </button>

              <button onClick={() => updateStatus(app._id, "rejected")}>
                Reject
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default EmployerDashboard;