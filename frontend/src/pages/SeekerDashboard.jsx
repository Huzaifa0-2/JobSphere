import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSelector, useDispatch } from "react-redux";
import ApplyForm from "../components/ApplyForm";
import SearchFilter from "../components/SearchFilter";

import {
    fetchAllJobs,
} from "../features/jobs/jobSlice";

import {
    applyJob,
    fetchUserApplications
} from "../features/applications/applicationSlice";


import {
    Briefcase,
    MapPin,
    DollarSign,
    Send,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Eye
} from "lucide-react";

function SeekerDashboard() {
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [showApplications, setShowApplications] = useState(false);

    const dispatch = useDispatch();
    const { jobs, searchResults } = useSelector((state) => state.jobs);
    const { applications, loading } = useSelector(state => state.applications);
    
    const { user } = useUser();
    const userId = user?.id;

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

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome to JobSphere</h2>
                <p className="text-blue-100">Find your dream job and take the next step in your career</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <button
                                    onClick={() => setSelectedJobId(job._id)}
                                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
                                >
                                    Apply Now
                                </button>
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