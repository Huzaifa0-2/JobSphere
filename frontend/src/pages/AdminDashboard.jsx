import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { 
  Users, 
  Briefcase, 
  FileText, 
  Trash2, 
  UserCheck, 
  UserX,
  BarChart3,
  Loader2,
  AlertCircle,
  Search,
  X
} from "lucide-react";

function AdminDashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // FETCH EVERYTHING
  useEffect(() => {
    if (!user?.id) return;
    
    setLoading(true);
    
    Promise.all([
      fetch("http://localhost:5000/admin/stats", { headers: { userId: user.id } }).then(res => res.json()),
      fetch("http://localhost:5000/admin/users", { headers: { userId: user.id } }).then(res => res.json()),
      fetch("http://localhost:5000/admin/jobs", { headers: { userId: user.id } }).then(res => res.json())
    ])
      .then(([statsData, usersData, jobsData]) => {
        setStats(statsData);
        setUsers(usersData);
        setJobs(jobsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.id]);

  // DELETE USER
  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await fetch(`http://localhost:5000/admin/user/${id}`, {
        headers: { userId: user.id },
        method: "DELETE"
      });
      setUsers(users.filter(u => u._id !== id));
    }
  };

  // DELETE JOB
  const deleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await fetch(`http://localhost:5000/admin/job/${id}`, {
        headers: { userId: user.id },
        method: "DELETE"
      });
      setJobs(jobs.filter(j => j._id !== id));
    }
  };

  // Filter users by search
  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter jobs by search
  const filteredJobs = jobs.filter(j => 
    j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers, icon: Users, color: "blue", bgColor: "bg-blue-50", textColor: "text-blue-600" },
    { title: "Job Seekers", value: stats?.totalSeekers, icon: UserCheck, color: "green", bgColor: "bg-green-50", textColor: "text-green-600" },
    { title: "Employers", value: stats?.totalEmployers, icon: UserX, color: "purple", bgColor: "bg-purple-50", textColor: "text-purple-600" },
    { title: "Total Jobs", value: stats?.totalJobs, icon: Briefcase, color: "orange", bgColor: "bg-orange-50", textColor: "text-orange-600" },
    { title: "Applications", value: stats?.totalApplications, icon: FileText, color: "pink", bgColor: "bg-pink-50", textColor: "text-pink-600" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-gray-500">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage users, jobs, and platform analytics</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Logged in as Admin
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value || 0}</p>
                  </div>
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email, role, job title, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "users"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "jobs"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Jobs ({jobs.length})
          </button>
        </div>

        {/* Users Section */}
        {(activeTab === "overview" || activeTab === "users") && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Users</h2>
              <span className="text-sm text-gray-500">Total: {users.length}</span>
            </div>
            
            {filteredUsers.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">User ID</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === "admin" 
                                ? "bg-red-100 text-red-700"
                                : user.role === "employer"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-green-100 text-green-700"
                            }`}>
                              {user.role || "seeker"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 font-mono">{user._id?.slice(-8)}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Jobs Section */}
        {(activeTab === "overview" || activeTab === "jobs") && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Jobs</h2>
              <span className="text-sm text-gray-500">Total: {jobs.length}</span>
            </div>
            
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No jobs found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredJobs.map((job) => (
                  <div key={job._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> {job.company || "Unknown"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> Posted by: {job.postedBy?.slice(-8)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteJob(job._id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center gap-1 self-start"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;