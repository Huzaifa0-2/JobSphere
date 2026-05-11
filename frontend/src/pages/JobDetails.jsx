import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleJob } from "../features/jobs/jobSlice";
import { useUser } from "@clerk/clerk-react";
import { fetchSeekerProfile, getUserResume } from "../features/profile/profileSlice";
import { applyJob } from "../features/applications/applicationSlice";
import { 
  Briefcase, MapPin, DollarSign, Calendar, Clock, Building2, 
  Send, Loader2, ChevronLeft, FileText, Users, Lightbulb 
} from "lucide-react";

function JobDetails() {
  const [questions, setQuestions] = useState({
    technical: [],
    behavioral: [],
    projectBased: []
  });
  const [loadingQuestions, setLoadingQuestions] = useState(false);

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

  // Fetch Seeker Profile
  const { seekerProfile, resume } = useSelector((state) => state.seekerProfile);
  useEffect(() => {
    if (userId) dispatch(fetchSeekerProfile(userId));
  }, [userId]);

  // Fetch User Resume
  useEffect(() => {
    if (userId) dispatch(getUserResume(userId));
  }, [userId]);

  // Check if already applied
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
    if (result) setApplied(true);
  };

  // Generate interview questions
  const generateQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const res = await fetch("http://localhost:5000/ai/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resume?.resumeText,
          jobTitle: selectedJob.title,
          jobDescription: selectedJob.description,
          jobRequirements: selectedJob.requirements,
        })
      });
      const data = await res.json();
      setQuestions(data.questions || {
        technical: [],
        behavioral: [],
        projectBased: []
      });
    } catch (error) {
      console.error("Failed to generate questions:", error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
  
  if (!selectedJob) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700">Job not found</h2>
        <p className="text-gray-500 mt-2">The position you're looking for doesn't exist.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen ">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Jobs
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* LEFT SIDE - Job Details */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Job Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedJob.title}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600">{selectedJob.company || "Company"}</p>
                  </div>
                </div>
                <div className="bg-green-50 px-3 py-1 rounded-full">
                  <span className="text-green-600 font-semibold">${selectedJob.salary?.toLocaleString()}</span>
                  <span className="text-green-500 text-sm">/year</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedJob.location || "Remote"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{selectedJob.jobType || "Full-time"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Posted: {new Date(selectedJob.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Job Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedJob.description || "No description provided."}
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Requirements
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedJob.requirements || "No specific requirements listed."}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - Actions */}
          <div className="space-y-5">
            
            {/* Apply Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Interested in this role?</h3>
              </div>
              
              <button
                onClick={apply}
                disabled={applied}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  applied 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02]"
                }`}
              >
                {applied ? (
                  <>✓ Applied</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Apply Now
                  </>
                )}
              </button>
              
              <div className="mt-4 text-sm text-gray-500 space-y-2">
                <p className="flex items-center justify-between">
                  <span>Experience:</span>
                  <span className="font-medium">{selectedJob.experience || "Not specified"}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Job Type:</span>
                  <span className="font-medium">{selectedJob.jobType || "Full-time"}</span>
                </p>
              </div>
            </div>

            {/* Interview Questions Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <button
                onClick={generateQuestions}
                disabled={loadingQuestions}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loadingQuestions ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lightbulb className="w-4 h-4" />
                )}
                {loadingQuestions ? "Generating..." : "Generate Interview Questions"}
              </button>

              {/* Questions Display */}
              {(questions.technical?.length > 0 || questions.behavioral?.length > 0 || questions.projectBased?.length > 0) && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    AI-Powered Questions
                  </h3>
                  
                  {questions.technical?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-blue-600 text-sm mb-2">💻 Technical Questions</h4>
                      <ul className="space-y-2">
                        {questions.technical.map((q, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-blue-400">•</span>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {questions.behavioral?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-green-600 text-sm mb-2">🤝 Behavioral Questions</h4>
                      <ul className="space-y-2">
                        {questions.behavioral.map((q, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-green-400">•</span>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {questions.projectBased?.length > 0 && (
                    <div className="mb-2">
                      <h4 className="font-semibold text-purple-600 text-sm mb-2">🚀 Project-Based Questions</h4>
                      <ul className="space-y-2">
                        {questions.projectBased.map((q, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-purple-400">•</span>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;