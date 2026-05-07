import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleJob } from "../features/jobs/jobSlice";
import { useUser } from "@clerk/clerk-react";
import { fetchSeekerProfile, getUserResume } from "../features/profile/profileSlice";
import { applyJob } from "../features/applications/applicationSlice";

function JobDetails() {
    const { jobId } = useParams();
    const [applied, setApplied] = useState(false);
    const dispatch = useDispatch();
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
            setApplied(true);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!selectedJob) return <p>Job not found</p>;

    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-3 gap-6">

            {/* LEFT SIDE */}
            <div className="col-span-2 space-y-6">

                <div className="bg-white p-6 rounded-xl shadow">
                    <h1 className="text-3xl font-bold">{selectedJob.title}</h1>
                    <p className="text-gray-600">Company: {selectedJob.company}</p>
                    <p className="text-gray-500">Location: {selectedJob.location}</p>
                    <p className="text-gray-500"><span className="mt-2 font-semibold text-green-600">${selectedJob.salary}</span>/year</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-2">Job Description</h2>
                    <p className="text-gray-700 whitespace-pre-line">
                        {selectedJob.description}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-2">Requirements</h2>
                    <p className="text-gray-700 whitespace-pre-line">
                        {selectedJob.requirements}
                    </p>
                </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-4">

                <div className="bg-white p-6 rounded-xl shadow sticky top-6">

                    <button
                        onClick={apply}
                        disabled={applied}
                        className={`px-4 py-2 mt-4 ${applied ? "px-5 py-2 bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
                            : "px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
                            }`}
                    >
                        {applied ? "Applied" : "Apply Now"}
                    </button>

                    <div className="mt-4 text-sm text-gray-600">
                        <p><strong>Posted:</strong> {new Date(selectedJob.createdAt).toLocaleDateString()}</p>
                        <p><strong>Type:</strong> {selectedJob.jobType}</p>
                        <p><strong>Experience:</strong> {selectedJob.experience}</p>
                    </div>

                </div>

            </div>

        </div>
    );
}


export default JobDetails;