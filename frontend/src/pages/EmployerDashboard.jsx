import { API_URL } from "../config";
import AnalyticsDashboard from "./AnalyticsDashboard";
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
  Upload,
  Building2,
  TrendingUp,
  Award,
  Sparkles,
  Loader2,
  ChevronRight,
  BarChart3,
} from "lucide-react";

function EmployerDashboard() {
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
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [totalApplications, setTotalApplications] = useState(null);

  // for total applications count
  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/analytics/employer/${user.id}`)
      .then(res => res.json())
      .then(data => setTotalApplications(data.totalApplications));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    dispatch(fetchJobs(user.id));
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !salary || !location || !company || !description || !requirements) {
      alert("Fill all fields");
      return;
    }
    if (editId) {
      dispatch(updateJob({
        id: editId,
        job: { title, salary: Number(salary), location, company, description, requirements, jobType, experience },
        userId: user.id
      }));
    } else {
      dispatch(addJob({
        title, salary: Number(salary), location, company, description, requirements, jobType, experience,
        postedBy: user.id
      }));
    }
    setTitle(""); setSalary(""); setLocation(""); setCompany(""); setDescription("");
    setRequirements(""); setJobType(""); setExperience(""); setEditId(null); setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      dispatch(deleteJob({ id, userId: user.id }));
    }
  };

  const fetchApplications = async (jobId) => {
    setSelectedJobId(jobId);
    dispatch(fetchJobApplications(jobId));
  };

  const updateStatus = async (id, jobTitle, status) => {
    dispatch(updateApplicationStatus({ id, jobTitle, status }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const analyzeCandidate = async (applicationId) => {
    setLoadingAI(true);
    try {
      const res = await fetch(`${API_URL}/ai/analyze-candidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId })
      });
      const data = await res.json();
      setAiAnalysis(data.analysis);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-200">Employer Portal</p>
              <h2 className="text-xl font-bold">JobSphere</h2>
            </div>
          </div>
          <p className="text-3xl font-bold mb-3">Hello, {user?.fullName || 'Employer'}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Post Jobs</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Find Talent</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Grow Team</span>
          </div>
          <p className="text-slate-300 text-sm">Post jobs, find top talent, and grow your team</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Job Posts</p><p className="text-2xl font-bold text-gray-900">{jobs.length}</p></div>
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center"><Briefcase className="w-5 h-5 text-indigo-600" /></div>
          </div>
          <div className="mt-2 text-xs text-green-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Active listings</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Applicants</p><p className="text-2xl font-bold text-gray-900">{totalApplications}</p></div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center"><Users className="w-5 h-5 text-green-600" /></div>
          </div>
          <div className="mt-2 text-xs text-green-600">Total received</div>
        </div>
        {/* <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Acceptance Rate</p><p className="text-2xl font-bold text-gray-900">68%</p></div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center"><Award className="w-5 h-5 text-purple-600" /></div>
          </div>
          <div className="mt-2 text-xs text-purple-600">+5% this month</div>
        </div> */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Company Rating</p><p className="text-2xl font-bold text-gray-900">4.8</p></div>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center"><Building2 className="w-5 h-5 text-yellow-600" /></div>
          </div>
          <div className="mt-2 text-xs text-yellow-600">Top rated employer</div>
        </div>
      </div>

      {/* Analytics Dashboard */}

      {/* For Mobile View */}
      <Link to="/analytics" className="fixed bottom-6 right-6 z-50 md:hidden">
        <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
      </Link>

      {/* For Desktop View */}
      <div className="hidden md:block bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Analytics Dashboard</p>
            <p className="text-2xl font-bold text-gray-900">Reports</p>
          </div>
          <Link to="/analytics">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-purple-100 transition">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
          </Link>
        </div>
        <Link to="/analytics">
          <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View Analytics <ChevronRight className="w-3 h-3" />
          </button>
        </Link>
      </div>

      {/* Add Job Button */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full py-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-medium flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" /> Post a New Job
        </button>
      )}

      {/* Job Form Modal */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{editId ? "✏️ Edit Job" : "Post a New Job"}</h3>
            <button onClick={() => { setShowForm(false); setEditId(null); setTitle(""); setSalary(""); setLocation(""); setCompany(""); setDescription(""); setRequirements(""); setJobType(""); setExperience(""); }} className="p-2 hover:bg-gray-100 rounded-full transition"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Senior Frontend Developer" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Company</label><input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g., Google" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Salary ($/year)</label><input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g., 80000" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., New York, Remote" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label><select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full px-4 py-2 border rounded-lg"><option>Full-time</option><option>Part-time</option><option>Remote</option><option>Contract</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience</label><input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g., 2-4 years" className="w-full px-4 py-2 border rounded-lg" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Job description..." className="w-full px-4 py-2 border rounded-lg" required /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label><textarea rows="3" value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Job requirements..." className="w-full px-4 py-2 border rounded-lg" required /></div>
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:shadow-lg transition font-medium">{editId ? "Update Job" : "Post Job"}</button>
          </form>
        </div>
      )}

      {/* Job List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Your Job Posts</h2>
        {jobs.length === 0 && (
          <div className="text-center py-12"><Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No jobs posted yet</p><button onClick={() => setShowForm(true)} className="mt-4 text-indigo-600 font-medium">Post your first job →</button></div>
        )}
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1"><h3 className="font-semibold text-lg text-gray-900">{job.title}</h3><p className="text-gray-500 text-sm">{job.company}</p><div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500"><div className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</div><div className="flex items-center gap-1"><DollarSign className="w-4 h-4" />${job.salary?.toLocaleString()}/year</div></div></div>
                <div className="flex flex-wrap gap-2"><button onClick={() => fetchApplications(job._id)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Eye className="w-4 h-4" />Applicants</button><button onClick={() => { setEditId(job._id); setTitle(job.title); setSalary(job.salary.toString()); setLocation(job.location); setCompany(job.company); setDescription(job.description); setRequirements(job.requirements); setJobType(job.jobType); setExperience(job.experience); setShowForm(true); }} className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition"><Edit className="w-4 h-4" />Edit</button><button onClick={() => handleDelete(job._id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"><Trash2 className="w-4 h-4" />Delete</button></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Applications Section */}
      {selectedJobId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">

            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Applicants</h2>
              <button onClick={() => { setSelectedJobId(null); setAiAnalysis(null); }}
                className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* </div> */}
            {applications.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No applicants yet</p>
              </div>
            )}
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app._id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1"><div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{app.userName || app.userId}</p>
                        <p className="text-sm text-gray-500">Applied for: {app.jobId?.title}
                        </p>
                      </div>
                    </div>
                      {app.resumeUrl && (<a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline">
                        <FileText className="w-4 h-4" /> View Resume</a>)}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>{getStatusIcon(app.status)}<span className="capitalize">{app.status || "Pending"}</span></div>
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(app._id, app.jobId?.title, "accepted")} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                          <CheckCircle className="w-4 h-4" />Accept
                        </button>
                        <button onClick={() => updateStatus(app._id, app.jobId?.title, "rejected")} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                          <XCircle className="w-4 h-4" />Reject
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3 mt-2">
                        <Link to={`/profile/${app.userId}`}>
                          <button className="px-4 py-2 w-full bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-800 transition"
                            onClick={() => updateStatus(app._id, app.jobId?.title, "reviewing")}>
                            View Profile
                          </button>
                        </Link>
                        <button
                          onClick={() => analyzeCandidate(app._id)}
                          disabled={loadingAI}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm hover:shadow-lg transition flex justify-center items-center gap-2">
                          {loadingAI ?
                            <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} AI Analyze
                        </button>
                      </div>
                    </div>
                  </div>
                  {aiAnalysis && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 animate-in fade-in duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <h4 className="font-semibold text-gray-900">AI Analysis Result</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><p className="text-sm text-gray-600">Match Score</p><p className="text-2xl font-bold text-green-600">{aiAnalysis.matchScore}%</p></div>
                        <div><p className="text-sm text-gray-600">Recommendation</p><p className="text-sm font-medium">{aiAnalysis.recommendation}</p></div>
                        <div><p className="text-sm font-semibold text-gray-700 mb-1">✓ Strengths</p><ul className="list-disc list-inside text-sm text-gray-600 space-y-1">{aiAnalysis.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                        <div><p className="text-sm font-semibold text-gray-700 mb-1">⚠ Missing Skills</p><ul className="list-disc list-inside text-sm text-gray-600 space-y-1">{aiAnalysis.missingSkills?.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerDashboard;