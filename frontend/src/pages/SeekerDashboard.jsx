import { API_URL } from "../config";
import socket from "../socket";
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSelector, useDispatch } from "react-redux";
// import ApplyForm from "../components/ApplyForm";
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
    Eye,
    TrendingUp,
    Award,
    Users,
    ChevronRight
} from "lucide-react";
import { fetchSeekerProfile, getUserResume, uploadResume } from "../features/profile/profileSlice";

function SeekerDashboard() {
    const [aiMatches, setAiMatches] = useState([]);
    const [loadingAI, setLoadingAI] = useState(false);
    const [detailsPopup, setDetailsPopup] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [showStats, setShowStats] = useState(true);

    const navigate = useNavigate();
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [showApplications, setShowApplications] = useState(false);

    const dispatch = useDispatch();
    const { jobs, searchResults } = useSelector((state) => state.jobs);
    const { applications } = useSelector(state => state.applications);
    const { selectedJob } = useSelector(state => state.jobs);
    const { user } = useUser();
    const userId = user?.id;
    const { seekerProfile, resume } = useSelector((state) => state.seekerProfile);

    useEffect(() => {
        dispatch(fetchSeekerProfile(userId));
        dispatch(getUserResume(userId));
    }, [userId]);

    const [file, setFile] = useState(null);

    const addResume = async () => {
        if (!file) {
            toast.error("Select a file first");
            return;
        }
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("userId", user.id);
        try {
            await dispatch(uploadResume(formData)).unwrap();
            toast.success("Resume uploaded successfully!");
            setFile(null);
        } catch (error) {
            toast.error("Upload failed");
        }
    };

    // Status Socket
    useEffect(() => {

        socket.on(
            "applicationStatusUpdated",
            (data) => {
                if (data.status === 'accepted') {
                    toast.success(`Your application for ${data.jobTitle} was ${data.status}!`);
                } else if (data.status === 'reviewing') {
                    toast.info(`Your application for ${data.jobTitle} is under review`);
                } else if (data.status === 'rejected') {
                    toast.error(`Your application for ${data.jobTitle} was rejected`);
                }

                dispatch(fetchUserApplications(userId));
                // fetchApplications();
            }
        );

        return () => {

            socket.off("applicationStatusUpdated");
        };

    }, []);

    const fetchApplications = async () => {
        if (!userId) return;
        dispatch(fetchUserApplications(userId));
        setShowApplications(true);
    };

    useEffect(() => {
        dispatch(fetchAllJobs());
    }, []);

    const jobsToShow = hasSearched ? searchResults : jobs;

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted': return 'text-green-600 bg-green-50 border-green-200';
            case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
            case 'reviewed': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
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

    const getAISuggestions = async () => {
        setLoadingAI(true);
        setShowPopup(true);
        const res = await fetch(`${API_URL}/ai/match`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id })
        });
        const data = await res.json();
        setAiMatches(data.matches || []);
        setLoadingAI(false);
    };

    const getJobDetails = async (jobId) => {
        setDetailsPopup(true);
        dispatch(fetchSingleJob(jobId));
    };

    // Fetch applied jobs
    useEffect(() => {
        fetch(`${API_URL}/applications/user/${user.id}`)
            .then(res => res.json())
            .then(data => {
                const ids = data.map(app => app.jobId?._id);
                setAppliedJobs(ids);
            });
    }, []);

    const apply = async (jobId) => {
        if (!user) {
            toast.error("Login required");
            return;
        }
        if (!resume) {
            toast.error("Please upload your resume first");
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
            toast.success("Application submitted successfully!");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

            {/* Welcome Banner - Enhanced */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl p-6 text-white shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-200">Seeker Portal</p>
                            <h2 className="text-xl font-bold">JobSphere</h2>
                        </div>
                    </div>

                    <p className="text-3xl font-bold mb-3">
                        Hello, {user?.fullName || 'Seeker'}!
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Find Jobs</span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Top Companies</span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Career Growth</span>
                    </div>

                    <p className="text-slate-300 text-sm">Discover opportunities that match your skills and aspirations.</p>
                </div>
            </div>

            {/* AI Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    onClick={getAISuggestions}
                    disabled={loadingAI}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                    {loadingAI ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                        <Sparkles className="w-5 h-5" />
                    )}
                    {loadingAI ? "Analyzing..." : "Match Jobs with AI"}
                </button>

                <button
                    onClick={() => navigate('/AIChat')}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                    <MessageCircleMore className="w-5 h-5" />
                    Chat with AI Assistant
                </button>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Available Jobs</p>
                            <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +12 this week
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Applications Sent</p>
                            <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Send className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                    <button onClick={fetchApplications} className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
                        View all →
                    </button>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Profile Views</p>
                            <p className="text-2xl font-bold text-gray-900">142</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-purple-600">+8 this week</div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Match Score</p>
                            <p className="text-2xl font-bold text-gray-900">85%</p>
                        </div>
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-yellow-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-yellow-600">Top 15% of candidates</div>
                </div>
            </div>

{/* Resume Upload Card */}
<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-100">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left Side - Icon & Text */}
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Upload Your Resume</h3>
                <p className="text-xs sm:text-sm text-gray-500">Get matched with relevant jobs instantly</p>
            </div>
        </div>
        
        {/* Right Side - File Input & Button */}
        <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
            <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])} 
                className="flex-1 text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept=".pdf" 
            />
            <button 
                onClick={addResume} 
                className="px-4 sm:px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium whitespace-nowrap"
            >
                Upload
            </button>
        </div>
    </div>
</div>

            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <SearchFilter setHasSearched={setHasSearched} />
            </div>

            {/* Jobs Listing */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{hasSearched ? "Search Results" : "Recommended for You"}</h2>
                    {hasSearched && jobsToShow.length === 0 && (
                        <button onClick={() => setHasSearched(false)} className="text-blue-600 hover:text-blue-700 text-sm">Clear Search</button>
                    )}
                </div>

                {jobsToShow.length === 0 && hasSearched ? (
                    <div className="text-center py-12">
                        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No matching jobs found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {jobsToShow.map(job => (
                            <div key={job._id} className="group border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-blue-200 transition-all duration-200">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition">{job.title}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{job.company || "Company"}</p>
                                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                                            <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /><span>{job.location}</span></div>
                                            <div className="flex items-center gap-1"><DollarSign className="w-4 h-4" /><span>${job.salary?.toLocaleString() || "Negotiable"}/year</span></div>
                                        </div>
                                    </div>
                                    <div onClick={() => navigate(`/job/${job._id}`)} className="cursor-pointer px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center gap-2 whitespace-nowrap">
                                        <Eye className="w-4 h-4" /> View Details <ChevronRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Applications Modal */}
            {showApplications && applications.length > 0 && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">My Applications</h2>
                            <button onClick={() => setShowApplications(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            {applications.map(app => (
                                <div key={app._id} className="border rounded-lg p-4 hover:shadow-md transition">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                        <div>
                                            <h3 className="font-semibold text-lg">{app.jobId?.title}</h3>
                                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {app.jobId?.location}</span>
                                                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${app.jobId?.salary?.toLocaleString()}/year</span>
                                            </div>
                                            {app.resumeUrl && <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline mt-2 inline-block">📄 View Resume</a>}
                                        </div>
                                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                                            {getStatusIcon(app.status)} {app.status || "Pending"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* AI Matches Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold">AI Job Matches</h2>
                            <button onClick={() => setShowPopup(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6">
                            {loadingAI ? (
                                <div className="text-center py-20"><div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-3"></div><p>Analyzing your resume...</p></div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {aiMatches.map((match, idx) => (
                                        <div key={idx} className="border rounded-xl p-5 hover:shadow-lg transition">
                                            <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold">{match.jobTitle}</h3>
                                                    <p className="text-gray-600">{match.company}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${parseInt(match.matchPercentage) >= 80 ? 'bg-green-500 text-white' : parseInt(match.matchPercentage) >= 60 ? 'bg-indigo-500 text-white' : 'bg-red-500 text-white'}`}>
                                                    {match.matchPercentage} Match
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-gray-500 mb-3">
                                                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {match.location}</div>
                                                <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {match.salary}</div>
                                                <div className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {match.jobType}</div>
                                                <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {match.experience}</div>
                                            </div>
                                            <div className="mb-3 p-3 bg-green-50 rounded-lg"><p className="text-xs font-semibold text-green-600">✓ Why You Match</p><p className="text-sm">{match.reason}</p></div>
                                            <div className="mb-4 p-3 bg-red-50 rounded-lg"><p className="text-xs font-semibold text-red-600">⚠ Skills to Improve</p><p className="text-sm">{match.skillsGap}</p></div>
                                            <div className="flex gap-3">
                                                <button onClick={() => getJobDetails(match.jobId)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">View Details</button>
                                                <button disabled={appliedJobs.includes(match.jobId)} onClick={() => apply(match.jobId)} className={`px-4 py-2 rounded-lg font-medium transition ${appliedJobs.includes(match.jobId) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                                                    {appliedJobs.includes(match.jobId) ? 'Applied' : 'Apply Now'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Job Details Popup */}
            {detailsPopup && selectedJob && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold">{selectedJob.title}</h3>
                            <button onClick={() => setDetailsPopup(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 mb-2">{selectedJob.company} • {selectedJob.location}</p>
                            <p className="text-green-600 font-semibold mb-4">${selectedJob.salary?.toLocaleString()}/year</p>
                            <div className="mb-4"><h4 className="font-semibold mb-2">Description</h4><p className="text-gray-700">{selectedJob.description || "No description"}</p></div>
                            <div><h4 className="font-semibold mb-2">Requirements</h4><p className="text-gray-700">{selectedJob.requirements || "No requirements listed"}</p></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SeekerDashboard;