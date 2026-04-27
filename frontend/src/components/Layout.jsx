import { SignOutButton, useUser } from "@clerk/clerk-react";
import { Briefcase, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

function Layout({ children, role }) {
    const { user } = useUser();

    return (
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
                            <p className="text-xs text-gray-500">Welcome back, {user?.fullName}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {role && (
                            <div className="px-3 py-1 bg-blue-50 rounded-full text-sm text-blue-600 font-medium">
                                {role === "seeker" ? "Job Seeker" : "Employer"}
                            </div>
                        )}

                        {role === "seeker" && (
                            <Link to="/ManageSeekerProfile">
                                <button className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">
                                    Manage Profile
                                </button>
                            </Link>
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

            {/* Content */}
            <main>{children}</main>
        </div>
    );
}

export default Layout;