import {
  SignedIn,
  SignedOut,
  SignIn,
  SignOutButton,
  useUser
} from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Briefcase, LogOut } from "lucide-react";
import SeekerDashboard from "./pages/SeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import RoleSelect from "./pages/RoleSelect";
import LandingPage from "./pages/LandingPage";

function App() {
  const { user } = useUser();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/users/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data) setRole(data.role);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Signed Out - Show Landing Page */}
      <SignedOut>
        <LandingPage />
      </SignedOut>

      {/* Signed In - Show Dashboard */}
      <SignedIn>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 sticky top-4 z-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    JobSphere
                  </h1>
                  <p className="text-xs text-gray-500">Welcome back, {user?.fullName || user?.username}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {role && (
                  <div className="px-3 py-1 bg-blue-50 rounded-full text-sm text-blue-600 font-medium">
                    {role === "seeker" ? "Job Seeker" : "Employer"}
                  </div>
                )}
                <SignOutButton>
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </SignOutButton>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main>
            {!role && <RoleSelect setRole={setRole} />}
            {role === "seeker" && <SeekerDashboard />}
            {role === "employer" && <EmployerDashboard />}
          </main>
        </div>
      </SignedIn>
    </div>
  );
}

export default App;