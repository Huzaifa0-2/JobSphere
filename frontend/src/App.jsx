import {
  SignedIn,
  SignedOut,
  useUser
} from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import SeekerDashboard from "./pages/SeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import RoleSelect from "./pages/RoleSelect";
import LandingPage from "./pages/LandingPage";
import SeekerProfile from "./pages/SeekerProfile";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import ManageSeekerProfile from "./components/ManageSeekerProfile";

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
      <Routes>
        {/* Profile page with Layout */}
        <Route path="/profile/:userId" element={
          <Layout>
            <SeekerProfile />
          </Layout>
        } />

        {/* Manage Profile page with Layout */}
        <Route path="/ManageSeekerProfile" element={
          <Layout>
            <ManageSeekerProfile />
          </Layout>
        } />

        {/* Home page */}
        <Route path="/" element={
          <>
            <SignedOut>
              <LandingPage />
            </SignedOut>

            <SignedIn>
              <Layout role={role}>
                {!role && <RoleSelect setRole={setRole} />}
                {role === "seeker" && <SeekerDashboard />}
                {role === "employer" && <EmployerDashboard />}
              </Layout>
            </SignedIn>
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;