import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSelector, useDispatch } from "react-redux";
import ApplyForm from "../components/ApplyForm";

import {
    fetchJobs,
    addJob,
    deleteJob,
    updateJob,
    fetchAllJobs,
} from "../features/jobs/jobSlice";

function SeekerDashboard() {
    const [applications, setApplications] = useState([]);

    const [selectedJobId, setSelectedJobId] = useState(null);

    const dispatch = useDispatch();
    const { jobs } = useSelector((state) => state.jobs);


    const { user } = useUser();

    const userId = user?.id;

    // const fetchApplications = () => {
    //     if (!userId) return;

    //     fetch(`http://localhost:5000/applications/user/${userId}`)
    //         .then(res => res.json())
    //         .then(data => setApplications(data));
    // };

const fetchApplications = async () => {
    if (!userId) return;
    dispatch(fetchJobs(userId));
}

    // Fetch All Jobs for Seeker Dashboard
    useEffect(() => {
        dispatch(fetchAllJobs());
    }, [userId]);


    return (
        <div>

            <h1>Seeker Dashboard</h1>
            <h2>All Jobs</h2>
            {jobs.map(job => (
                <div key={job._id} style={{ border: "1px solid black", margin: "10px" }}>
                    <p>Title: {job.title}</p>
                    <p>Salary: {job.salary}</p>
                    <p>Location: {job.location}</p>

                    <button style={{ marginLeft: "10px" }} onClick={() => setSelectedJobId(job._id)}>
                        Apply
                    </button>
                </div>
            ))}

            {selectedJobId && <ApplyForm jobId={selectedJobId} />}


            <button onClick={fetchApplications}>View My Applications</button>

            {applications.length > 0 && (
                <div>
                    <h1>My Applications</h1>

                    {applications.map(app => (
                        <div key={app._id} style={{ border: "1px solid black", margin: "10px" }}>

                            <p>Title: {app.jobId?.title}</p>
                            <p>Salary: {app.jobId?.salary}</p>
                            <p>Location: {app.jobId?.location}</p>
                            <p>Status: {app.status}</p>

                        </div>
                    ))}

                    {/* <SeekerDashboard />
                    <EmployerDashboard /> */}

                </div>
            )}
        </div>
    );
}

export default SeekerDashboard;