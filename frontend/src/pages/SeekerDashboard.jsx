import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSelector, useDispatch } from "react-redux";
import ApplyForm from "../components/ApplyForm";
import SearchFilter from "../components/SearchFilter";

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
    const [hasSearched, setHasSearched] = useState(false);

    const dispatch = useDispatch();
    const { jobs, searchResults } = useSelector((state) => state.jobs);

    const { user } = useUser();
    const userId = user?.id;

    // Fetch applications for the seeker he applied to
    const fetchApplications = async () => {
        if (!userId) return;
        dispatch(fetchApplications(userId));
    }

    // Fetch All Jobs for Seeker Dashboard
    useEffect(() => {
        dispatch(fetchAllJobs());
    }, []);

    const jobsToShow = hasSearched ? searchResults : jobs;

    return (
        <div>

            <h1>Seeker Dashboard</h1>
            <SearchFilter setHasSearched={setHasSearched} />

            <h2>All Jobs</h2>

            {jobsToShow.length === 0 && hasSearched && (
                <p style={{ color: "red" }}>No matching jobs found</p>
            )}

            {jobsToShow.map(job => (
                <div key={job._id} style={{ border: "1px solid black", margin: "10px" }}>
                    <p>Title: {job.title}</p>
                    <p>Salary: {job.salary}</p>
                    <p>Location: {job.location}</p>

                    <button onClick={() => setSelectedJobId(job._id)}>
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

                </div>
            )}
        </div>
    );
}

export default SeekerDashboard;