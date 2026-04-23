// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// // import ApplyForm from "./components/ApplyForm";
// import ApplyForm from "../components/ApplyForm"
// import SeekerDashboard from "../pages/SeekerDashboard"
// import EmployerDashboard from "../pages/EmployerDashboard"
// import { useUser } from "@clerk/clerk-react";



// import {
//     fetchJobs,
//     addJob,
//     deleteJob,
//     updateJob
// } from "./features/jobs/jobSlice";

// function App() {
//     const dispatch = useDispatch();
//     const { jobs } = useSelector((state) => state.jobs);

//     const { user } = useUser();


//     const [title, setTitle] = useState("");
//     const [salary, setSalary] = useState("");
//     const [location, setLocation] = useState("");
//     const [editId, setEditId] = useState(null);

//     const [selectedJobId, setSelectedJobId] = useState(null);

//     // Fetch data
//     useEffect(() => {
//         dispatch(fetchJobs());
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!title || !salary || !location) {

//             alert("Please fill all fields");
//             return;
//         }

//         if (editId) {
//             //Update Job
//             dispatch(updateJob({
//                 id: editId,
//                 job: { title, salary: Number(salary), location }
//             }));
//         }
//         else {
//             dispatch(addJob({
//                 title,
//                 salary: Number(salary),
//                 location,
//                 postedBy: user.id
//             }));
//         }
//     };

//     // Delete a job
//     const delJob = async (id) => {
//         dispatch(deleteJob(id));
//     };

//     return (
//         <div>
//             <h1>Job Listings</h1>

//             <form onSubmit={handleSubmit}>
//                 <h2>Add Job</h2>

//                 <input
//                     placeholder="Title"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                 />

//                 <input
//                     placeholder="Salary"
//                     value={salary}
//                     onChange={(e) => setSalary(e.target.value)}
//                 />

//                 <input
//                     placeholder="Location"
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                 />

//                 <button type="submit">
//                     {editId ? "Update Job" : "Add Job"}
//                 </button>
//             </form>

//             {jobs.map((job) => (
//                 <div style={{ border: "1px solid black", margin: "10px", padding: "10px" }} key={job._id}>
//                     <h3>{job.title}</h3>
//                     <p>Salary: {job.salary}</p>
//                     <p>Location: {job.location}</p>

//                     <button onClick={() => delJob(job._id)}>Delete</button>
//                     <button onClick={() => {
//                         setEditId(job._id);
//                         setTitle(job.title);
//                         setSalary(job.salary.toString());
//                         setLocation(job.location);
//                     }}
//                     >Edit</button>

//                     <button onClick={() => setSelectedJobId(job._id)}>
//                         Apply
//                     </button>

//                 </div>
//             ))}

//             {selectedJobId && <ApplyForm jobId={selectedJobId} />}

//             <SeekerDashboard />
//             <EmployerDashboard />


//         </div>
//     );
// }

// export default App;


import {
  SignedIn,
  SignedOut,
  SignIn,
  SignOutButton,
  useUser
} from "@clerk/clerk-react";

import { useEffect, useState } from "react";

import SeekerDashboard from "./pages/SeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import RoleSelect from "./pages/RoleSelect";

function App() {
  const { user } = useUser();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/users/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data) setRole(data.role);
      });
  }, [user]);

  return (
    <div>

      <SignedOut>
        <SignIn />
      </SignedOut>

      <SignedIn>
        {!role && <RoleSelect setRole={setRole} />}

        {role === "seeker" && <SeekerDashboard />}
        {role === "employer" && <EmployerDashboard />}

        <SignOutButton>
          <button>Sign Out</button>
        </SignOutButton>
      </SignedIn>

    </div>
  );
}

export default App;