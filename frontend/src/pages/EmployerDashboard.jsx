import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import {
  fetchJobs,
  addJob,
  deleteJob,
  updateJob
} from "../features/jobs/jobSlice";

import {
  fetchJobApplications,
  updateApplicationStatus,
} from "../features/applications/applicationSlice";

import {
  Briefcase,
  MapPin,
  DollarSign,
  Trash2,
  Edit,
  Eye,
  Users,
  Plus,
  X,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Upload
} from "lucide-react";

function EmployerDashboard() {

  // Gemini AI
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobs } = useSelector(state => state.jobs);
  const { applications } = useSelector(state => state.applications);

  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [experience, setExperience] = useState("1-3 years");

  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // const [applications, setApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Fetch an employer's jobs using Redux
  useEffect(() => {
    if (!user) return;
    dispatch(fetchJobs(user.id));
  }, [user]);

  // Submit Job
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !salary || !location || !company || !description || !requirements) {
      alert("Fill all fields");
      return;
    }

    // Update Job
    if (editId) {
      dispatch(updateJob({
        id: editId,
        job: { title, salary: Number(salary), location, company, description, requirements, jobType, experience },
        userId: user.id
      }));
    }
    // Add Job
    else {
      dispatch(addJob({
        title,
        salary: Number(salary),
        location,
        company,
        description,
        requirements,
        jobType,
        experience,
        postedBy: user.id
      }));
    }

    setTitle("");
    setSalary("");
    setLocation("");
    setCompany("");
    setDescription("");
    setRequirements("");
    setJobType("");
    setExperience("");
    setEditId(null);
    setShowForm(false);
  };

  // Delete Job
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      dispatch(deleteJob({ id, userId: user.id }));
    }
  };

  // Fetch Applicants (NORMAL FETCH — correct approach)
  const fetchApplications = async (jobId) => {
    setSelectedJobId(jobId);
    dispatch(fetchJobApplications(jobId));
    // setApplications(data);
  };

  // Accept / Reject
  const updateStatus = async (id, jobTitle, status) => {
    dispatch(updateApplicationStatus({ id, jobTitle, status }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Gemini AI Analysis for a candidate
  const analyzeCandidate = async (applicationId) => {

    setLoadingAI(true);

    const res = await fetch(
      "http://localhost:5000/ai/analyze-candidate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          applicationId
        })
      }
    );

    const data = await res.json();

    setAiAnalysis(data.analysis);
    // setAiAnalysis(prev => ({
    //   ...prev,
    //   [applicationId]: data.analysis
    // }));

    setLoadingAI(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-6 text-white shadow-xl">

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="hidden min-[375px]:flex h-10 w-13 md:h-10 md:w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-black-600 to-white text-white font-bold shadow-lg">
              J
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-200">Employer Portal</p>
              <h2 className="text-2xl font-bold">Welcome to JobSphere</h2>
            </div>
          </div>

          <p className="text-3xl font-bold mt-4 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            Hey! {user?.fullName}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
              Post Jobs
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
              Find Talent
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
              Grow Team
            </span>
          </div>

          <p className="text-indigo-100 mt-4 text-sm">
            Post jobs, find top talent, and grow your team
          </p>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Your Job Posts</p>
              <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Applicants</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Job Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Post a New Job
        </button>
      )}

      {/* CREATE / UPDATE JOB FORM */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              {editId ? "Edit Job" : "Post a New Job"}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setTitle("");
                setSalary("");
                setLocation("");
                setCompany("");
                setDescription("");
                setRequirements("");
                setJobType("");
                setExperience("");
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Senior Frontend Developer"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary ($/year)</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g., 80000"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., New York, Remote"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Google"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., We are looking for a skilled developer..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="e.g., Experience..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g., 2"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
            >
              {editId ? "Update Job" : "Post Job"}
            </button>
          </form>
        </div>
      )}

      {/* JOB LIST */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Your Job Posts</h2>

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No jobs posted yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Post your first job →
            </button>
          </div>
        )}

        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${job.salary?.toLocaleString()}/year</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => fetchApplications(job._id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Applicants
                  </button>

                  <button
                    onClick={() => {
                      setEditId(job._id);
                      setTitle(job.title);
                      setSalary(job.salary.toString());
                      setLocation(job.location);
                      setCompany(job.company);
                      setDescription(job.description);
                      setRequirements(job.requirements);
                      setJobType(job.jobType);
                      setExperience(job.experience);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* APPLICATIONS SECTION */}
      {selectedJobId && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Applicants</h2>
            <button
              onClick={() => {
                setSelectedJobId(null);
                // setApplications([]);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {applications.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No applicants yet</p>
            </div>
          )}

          <div className="space-y-4">
            {applications.map(app => (
              <div key={app._id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{app.userName || app.userId}</p>
                        <p className="text-sm text-gray-500">Applied for: {app.jobId?.title}</p>
                        {/* <p className="text-sm text-gray-500">Applied for: {app.resumeId?.resumeText.slice(0, 105)}...</p> */}
                      </div>
                    </div>

                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mt-2"
                      >
                        <FileText className="w-4 h-4" />
                        View Resume
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span className="capitalize">{app.status || "Pending"}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(app._id, app.jobId.title, "accepted")}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>

                      <button
                        onClick={() => updateStatus(app._id, app.jobId.title, "rejected")}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>

                    </div>

                    <div className="mt-4 flex flex-col md:flex-row gap-4">
                      <Link to={`/profile/${app.userId}`}>
                        <button className="w-52 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-3 py-2 rounded-xl">
                          View Profile
                        </button>
                      </Link>

                      <button
                        onClick={() => analyzeCandidate(app._id)}
                        className="w-52 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3 py-2 rounded-xl"
                      >
                        Analyze Candidate
                      </button>
                    </div>
                    {aiAnalysis && (
                      <div className="bg-gray-100 p-3 mt-3 rounded">

                        <p>
                          Match Score:
                          {aiAnalysis.matchScore}%
                        </p>

                        <p>
                          Recommendation:
                          {aiAnalysis.recommendation}
                        </p>

                        <div>
                          <strong>Strengths:</strong>

                          <ul>
                            {aiAnalysis.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <strong>Missing Skills:</strong>

                          <ul>
                            {aiAnalysis.missingSkills.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>

                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerDashboard;