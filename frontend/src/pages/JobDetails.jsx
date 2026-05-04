import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleJob } from "../features/jobs/jobSlice";
import { useUser } from "@clerk/clerk-react";
import { fetchSeekerProfile, getUserResume } from "../features/profile/profileSlice";
import { applyJob } from "../features/applications/applicationSlice";

function JobDetails() {
    const { jobId } = useParams();
    const dispatch = useDispatch();
    const [applied, setApplied] = useState(false);
    const { user } = useUser();
    const userId = user?.id;


    // Fetch Single job details
    const { selectedJob, loading } = useSelector(state => state.jobs);
    useEffect(() => {
        dispatch(fetchSingleJob(jobId));
    }, [jobId]);

    // Fetch Seeker Profile for Name to submit application
    const { seekerProfile, resume } = useSelector((state) => state.seekerProfile);
    useEffect(() => {
        dispatch(fetchSeekerProfile(userId));
    }, [userId]);

    // Fetch User Uploaded Resume to submit application
    useEffect(() => {
        if (!userId) return;

        dispatch(getUserResume(userId));
    }, [userId]);

    // Check if user has already applied to this job
    useEffect(() => {
        if (!userId) return;

        fetch(`http://localhost:5000/applications/check?userId=${userId}&jobId=${jobId}`)
            .then(res => res.json())
            .then(data => setApplied(data.applied));
    }, [jobId, userId]);

    // Apply to job
    const apply = async () => {
        if (!user) {
            alert("Login required");
            return;
        }
        if (!resume) {
            alert("Please upload your resume first");
            return;
        }
        const result = await dispatch(applyJob({
            userId: userId,
            jobId: jobId,
            userName: seekerProfile ? `${seekerProfile.firstName} ${seekerProfile.lastName}` : "",
            resumeId: resume._id,
            resumeUrl: resume.resumeUrl
        }));
        if (result) {
            setApplied(true);  // ← Set applied here instead
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!selectedJob) return <p>Job not found</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{selectedJob.title}</h1>
            <p>Salary: {selectedJob.salary}</p>
            <p>Location: {selectedJob.location}</p>

            <button
                onClick={apply}
                disabled={applied}
                className={`px-4 py-2 mt-4 ${applied ? "px-5 py-2 bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
                    : "px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
                    }`}
            >
                {applied ? "Already Applied" : "Apply Now"}
            </button>
        </div>
    );
}

export default JobDetails;