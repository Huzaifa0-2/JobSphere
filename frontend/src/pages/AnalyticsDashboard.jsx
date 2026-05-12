import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Award,
  BarChart3,
  Loader2
} from "lucide-react";

function AnalyticsDashboard() {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/analytics/employer/${user.id}`)
      .then(res => res.json())
      .then(data => setAnalytics(data));
  }, [user]);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-500">Loading analytics...</span>
      </div>
    );
  }

  const stats = [
    { 
      title: "Total Jobs", 
      value: analytics.totalJobs, 
      icon: Briefcase, 
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    { 
      title: "Applications", 
      value: analytics.totalApplications, 
      icon: Users, 
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    { 
      title: "Accepted", 
      value: analytics.accepted, 
      icon: CheckCircle, 
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
    { 
      title: "Rejected", 
      value: analytics.rejected, 
      icon: XCircle, 
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    },
    { 
      title: "Pending", 
      value: analytics.pending, 
      icon: Clock, 
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          </div>
          <p className="text-slate-300 text-sm">Track your job posting performance and applicant metrics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Most Applied Job Card */}
      {analytics.topJob && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-800">🏆 Most Popular Job</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xl font-bold text-gray-900">{analytics.topJob.title}</p>
              <p className="text-sm text-gray-500 mt-1">Highest number of applications</p>
            </div>
            <div className="bg-indigo-100 px-4 py-2 rounded-xl">
              <span className="text-2xl font-bold text-indigo-700">{analytics.topJob.applications}</span>
              <span className="text-indigo-600 ml-1">applications</span>
            </div>
          </div>
        </div>
      )}

      {/* Applications Per Job Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-800">Applications Per Job</h2>
        </div>
        
        {analytics.applicationsPerJob?.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No applications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {analytics.applicationsPerJob.map((job, index) => {
              const percentage = analytics.totalApplications > 0 
                ? (job.applications / analytics.totalApplications) * 100 
                : 0;
              return (
                <div key={job.title} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-700 text-sm">{job.title}</span>
                    <span className="text-sm text-gray-500">{job.applications} applications</span>
                  </div>
                  <div className="relative w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="absolute h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 group-hover:opacity-80"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Acceptance Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {analytics.totalApplications > 0 
                  ? Math.round((analytics.accepted / analytics.totalApplications) * 100) 
                  : 0}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Response Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {analytics.totalApplications > 0 
                  ? Math.round(((analytics.accepted + analytics.rejected) / analytics.totalApplications) * 100) 
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;