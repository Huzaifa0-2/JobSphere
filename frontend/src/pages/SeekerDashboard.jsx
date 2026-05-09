import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSelector, useDispatch } from "react-redux";
import ApplyForm from "../components/ApplyForm";
import SearchFilter from "../components/SearchFilter";
import { useNavigate } from "react-router-dom";


import {
    fetchAllJobs,
    fetchSingleJob,
} from "../features/jobs/jobSlice";

import {
    applyJob,
    fetchUserApplications
} from "../features/applications/applicationSlice";


import {
    Briefcase,
    Sparkles,
    X,
    MapPin,
    DollarSign,
    Send,
    FileText,
    MessageCircleMore,
    Clock,
    CheckCircle,
    XCircle,
    Eye
} from "lucide-react";
import { fetchSeekerProfile, getUserResume, uploadResume } from "../features/profile/profileSlice";

function SeekerDashboard() {

    // GEMINI AI 
    const [aiMatches, setAiMatches] = useState([]);
    const [loadingAI, setLoadingAI] = useState(false);
    const [detailsPopup, setDetailsPopup] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const [appliedJobs, setAppliedJobs] = useState([]);

    const navigate = useNavigate();
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [showApplications, setShowApplications] = useState(false);

    const dispatch = useDispatch();
    const { jobs, searchResults } = useSelector((state) => state.jobs);
    const { applications, loading } = useSelector(state => state.applications);
    const { selectedJob } = useSelector(state => state.jobs);

    const { user } = useUser();
    const userId = user?.id;

    // Fetch Seeker Profile for Name to submit application
    const { seekerProfile, resume } = useSelector((state) => state.seekerProfile);
    useEffect(() => {
        dispatch(fetchSeekerProfile(userId));
        dispatch(getUserResume(userId));
    }, [userId]);

    const [file, setFile] = useState(null);

    const addResume = async () => {
        if (!file) {
            alert("Select a file first");
            return;
        }
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("userId", user.id);
        try {
            await dispatch(uploadResume(formData)).unwrap();
            alert("Resume uploaded successfully!");
        } catch (error) {
            alert("Upload failed");
        }
    };


    // Fetch applications for the seeker he applied to
    const fetchApplications = async () => {
        if (!userId) return;
        dispatch(fetchUserApplications(userId));
        setShowApplications(true);
    }

    // Fetch All Jobs for Seeker Dashboard
    useEffect(() => {
        dispatch(fetchAllJobs());
    }, []);

    const jobsToShow = hasSearched ? searchResults : jobs;

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted': return 'text-green-600 bg-green-50';
            case 'rejected': return 'text-red-600 bg-red-50';
            case 'reviewed': return 'text-yellow-600 bg-yellow-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted': return <CheckCircle className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
            case 'reviewed': return <Eye className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    // GEMINI AI SUGGESTIONS
    const getAISuggestions = async () => {
        setLoadingAI(true);
        setShowPopup(true);  // ← Open popup

        const res = await fetch("http://localhost:5000/ai/match", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id
            })
        });

        const data = await res.json();

        setAiMatches(data.matches || []);
        setLoadingAI(false);
    };

    const getJobDetails = async (jobId) => {
        setDetailsPopup(true);
        dispatch(fetchSingleJob(jobId));
    };

    // For Gemini AI Matches Fetch specific seeker's all applications to disable apply button for already applied jobs in AI Matches
    useEffect(() => {
        fetch(`http://localhost:5000/applications/user/${user.id}`)
            .then(res => res.json())
            .then(data => {
                const ids = data.map(app => app.jobId._id);
                setAppliedJobs(ids);
            });
    }, []);

    const apply = async (jobId) => {
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
            setAppliedJobs([...appliedJobs, jobId]);
        }
    };


    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome to JobSphere</h2>
                <p className="text-blue-100">Find your dream job and take the next step in your career</p>
            </div>

            {/* AI Suggestion Button */}
            <div className="my-8 grid grid-cols-1 md:grid-cols-2 justify-items-center">
                <button
                    onClick={getAISuggestions}
                    disabled={loadingAI}
                    className={`
            flex items-center justify-center max-w-72 w-full md:w-62 my-4 md:my-0 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 
            gap-3 shadow-lg hover:shadow-xl transform hover:scale-105
            ${loadingAI ?
                            'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'}`}>
                    <Sparkles className="w-5 h-5" />
                    Match Jobs with AI
                </button>
                <div onClick={() => navigate(`/AIChat`)}
                    className="flex items-center justify-center max-w-72 w-full md:w-52 my-4 md:my-0 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 
            flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                    {/* <div className="flex items-center gap-1 py-2"> */}
                    <MessageCircleMore className="w-5 h-5" />
                    Chat with AI
                    {/* </div> */}
                </div>
            </div>


            {showPopup && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">

                        <button
                            onClick={() => setShowPopup(false)}
                            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-6">
                            {loadingAI ? (
                                <div className="text-center py-20">
                                    <div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                                    <p>Analyzing your resume...</p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold mb-6">🎯 Top Matches</h2>
                                    <div className="grid grid-cols-1  gap-6">
                                        {aiMatches.map((match, idx) => (
                                            <div key={idx} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden 
                                    p-6 border border-gray-100 hover:border-purple-200">


                                                <div className="relative">
                                                    <div className="absolute top-10 right-0 md:top-4 md:right-4 z-10">
                                                        <div className={`
                                px-3 py-1 rounded-full text-sm font-bold shadow-md
                                ${parseInt(match.matchPercentage) >= 80
                                                                ? 'bg-green-500 text-white'
                                                                : parseInt(match.matchPercentage) >= 60
                                                                    ? 'bg-indigo-500 text-white'
                                                                    : 'bg-red-500 text-white'
                                                            }
                            `}>
                                                            {match.matchPercentage} Match
                                                        </div>
                                                    </div>
                                                </div>

                                                <h3 className="font-bold text-lg">{match.jobTitle}</h3>
                                                <p className="text-gray-600">{match.company}</p>

                                                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{match.location}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span>{match.salary}/year</span>
                                                </div>


                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Briefcase className="w-4 h-4" />
                                                    <span>{match.jobType}</span>
                                                </div>

                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{match.experience}</span>
                                                </div>


                                                {detailsPopup && selectedJob && (
                                                    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs flex items-center justify-center p-4">
                                                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative shadow-xl">

                                                            {/* Close Button */}
                                                            <button
                                                                onClick={() => setDetailsPopup(false)}
                                                                className="sticky top-4 float-right z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors mr-4 mt-4"
                                                            >
                                                                <X className="w-5 h-5 text-gray-600" />
                                                            </button>

                                                            {/* Clear float */}
                                                            <div className="clear-both"></div>

                                                            {/* Content */}
                                                            <div className="px-6 pb-6">
                                                                {/* Job Title Header */}
                                                                <div className="mb-6">
                                                                    <h3 className="text-xl font-bold text-gray-900">{selectedJob.title}</h3>
                                                                    <p className="text-gray-600 text-sm mt-1">{selectedJob.company}</p>
                                                                </div>

                                                                {/* Description */}
                                                                <div className="mb-6">
                                                                    <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                                                        <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
                                                                        Description
                                                                    </h4>
                                                                    <div className="bg-gray-50 rounded-xl p-4">
                                                                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                                                            {selectedJob.description || "No description provided"}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Requirements */}
                                                                <div className="mb-6">
                                                                    <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                                                        <span className="w-1 h-5 bg-purple-600 rounded-full"></span>
                                                                        Requirements
                                                                    </h4>
                                                                    <div className="bg-gray-50 rounded-xl p-4">
                                                                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                                                            {selectedJob.requirements || "No specific requirements listed"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}


                                                <div className="mb-3 p-3 bg-green-50 rounded-lg">
                                                    <p className="text-xs font-semibold text-green-600 uppercase mb-1">✓ Why You Match</p>
                                                    <p className="text-sm text-gray-700">
                                                        {match.reason}
                                                    </p>
                                                </div>

                                                <div className="mb-4 p-3 bg-red-50 rounded-lg">
                                                    <p className="text-xs font-semibold text-red-600 uppercase mb-1">⚠ Skills to Improve</p>
                                                    <p className="text-sm text-gray-700">
                                                        {match.skillsGap}
                                                    </p>
                                                </div>
                                                <div className="flex justify-center gap-4">
                                                    <button
                                                        onClick={() => getJobDetails(match.jobId)}
                                                        className="mt-2 px-2 md:px-4 py-2.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors
                                                        flex items-center justify-center gap-2"
                                                    >
                                                        <div className="flex items-center gap-1 py-2">
                                                            <Eye className="w-5 h-5 text-green-600 hover:text-green-700" />
                                                            View Details
                                                        </div>
                                                    </button>

                                                    <button
                                                        disabled={appliedJobs.includes(match.jobId)}
                                                        onClick={() => apply(match.jobId)}
                                                        className={`mt-2 px-2 md:px-4 py-2.5 ${appliedJobs.includes(match.jobId) ? "bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
                                                            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-1 py-2">
                                                            <Send className="w-4 h-4" />
                                                            {appliedJobs.includes(match.jobId) ? "Applied" : "Apply Now"}
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Available Jobs</p>
                            <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Applications Sent</p>
                            <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Send className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                    <button
                        onClick={fetchApplications}
                        className="text-sm text-blue-600 hover:text-blue-700 mt-2 font-medium"
                    >
                        View Applications →
                    </button>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Upload Resume</p>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <button
                        onClick={addResume}
                        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
                    >
                        Upload →
                    </button>

                </div>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <SearchFilter setHasSearched={setHasSearched} />
            </div>

            {/* Jobs Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        {hasSearched ? "Search Results" : "Recommended Jobs"}
                    </h2>
                    {hasSearched && jobsToShow.length === 0 && (
                        <button
                            onClick={() => setHasSearched(false)}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                            Clear Search
                        </button>
                    )}
                </div>

                {jobsToShow.length === 0 && hasSearched && (
                    <div className="text-center py-12">
                        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No matching jobs found</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                    {jobsToShow.map(job => (
                        <div key={job._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                                    <p className="text-gray-500 text-sm mt-1">{job.company || "Company"}</p>
                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-4 h-4" />
                                            <span>${job.salary?.toLocaleString() || "Negotiable"}/year</span>
                                        </div>
                                    </div>
                                </div>
                                {/* <button
                                    onClick={() => setSelectedJobId(job._id)}
                                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
                                >
                                    Apply Now
                                </button> */}
                                {/* <button onClick={() => applyJob(job._id)}>
                                    Apply
                                </button> */}
                                <div onClick={() => navigate(`/job/${job._id}`)}
                                    className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium hover:bg-green-100 transition-colors"
                                >
                                    <div className="flex items-center gap-1 py-2">
                                        <Eye className="w-5 h-5 text-green-600 hover:text-green-700" />
                                        View Details
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Applications Section */}
            {showApplications && applications.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
                        <button
                            onClick={() => setShowApplications(false)}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-4">
                        {applications.map(app => (
                            <div key={app._id} className="border border-gray-100 rounded-lg p-4">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{app.jobId?.title}</h3>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{app.jobId?.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                <span>${app.jobId?.salary?.toLocaleString()}/year</span>
                                            </div>
                                        </div>
                                        {app.resumeUrl && (
                                            <a
                                                href={app.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-3"
                                            >
                                                <FileText className="w-4 h-4" />
                                                View Resume
                                            </a>
                                        )}
                                    </div>
                                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                                        {getStatusIcon(app.status)}
                                        <span className="capitalize">{app.status || "Pending"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Apply Form Modal */}
            {selectedJobId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedJobId(null)}>
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Apply for Position</h3>
                            <button
                                onClick={() => setSelectedJobId(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-4">
                            <ApplyForm jobId={selectedJobId} onSuccess={() => setSelectedJobId(null)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SeekerDashboard;