import { useEffect, useState } from "react";

function App() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch data
  useEffect(() => {
    const getJobs = async () => {
      try {
        let res = await fetch("http://localhost:5000/jobs");
        let data = await res.json();
        setJobs(data);
      } catch (error) {
        console.log(error);
      }
    };

    getJobs();
  }, []);

  const addJob = async (e) => {
    e.preventDefault();

    if (!title || !salary || !location) {

      alert("Please fill all fields");
      return;
    }

    if (editId) {
      //Update Job
      try {
        let res = await fetch(`http://localhost:5000/jobs/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,
            salary: Number(salary),
            location
          })
        });

        let data = await res.json();

        setJobs(prev =>
          prev.map(job =>
            job._id === editId
              ? { ...job, title, salary: Number(salary), location }
              : job
          ));

        setEditId(null);
        setTitle("");
        setSalary("");
        setLocation("");

      } catch (error) {
        console.log(error);
      }
    }
    else {
      try {

        let res = await fetch("http://localhost:5000/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,
            salary: Number(salary),
            location
          })
        });
        let data = await res.json();
        setJobs([...jobs, data]);

        // update UI instantly

        setLocation("");
        setSalary("");
        setTitle("");

      } catch (error) {
        console.log(error);
      }
    }
  };

  // Delete a job
  const deleteJob = async (id) => {
    try {
      await fetch(`http://localhost:5000/jobs/${id}`, {
        method: "DELETE"
      });

      // update UI
      setJobs(jobs.filter(job => job._id !== id));

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Job Listings</h1>

      <h2>Add Job</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
      />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button onClick={addJob}>
        {editId ? "Update Job" : "Add Job"}
      </button>

      {jobs.map((job) => (
        <div style={{ border: "1px solid black", margin: "10px", padding: "10px" }} key={job._id}>
          <h3>{job.title}</h3>
          <p>Salary: {job.salary}</p>
          <p>Location: {job.location}</p>

          <button onClick={() => deleteJob(job._id)}>Delete</button>
          <button onClick={() => {
            setEditId(job._id);
            setTitle(job.title);
            setSalary(job.salary.toString());
            setLocation(job.location);
          }}
          >Edit</button>
        </div>
      ))}

    </div>
  );
}

export default App;