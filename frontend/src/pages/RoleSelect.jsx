import { useUser } from "@clerk/clerk-react";
import { Briefcase, Users, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";

function RoleSelect({ setRole }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const selectRole = async (role) => {
    setLoading(true);
    setSelectedRole(role);
    
    const res = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        clerkId: user.id,
        role
      })
    });

    const data = await res.json();
    setRole(data.role);
  };

  const roles = [
    {
      id: "seeker",
      title: "Job Seeker",
      description: "Find your dream job, apply to companies, and build your career",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      id: "employer",
      title: "Employer",
      description: "Post jobs, find top talent, and grow your team",
      icon: Briefcase,
      gradient: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    }
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600">Welcome to JobSphere</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Path
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            Select how you want to use JobSphere and start your journey
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const isLoading = loading && isSelected;
            
            return (
              <button
                key={role.id}
                onClick={() => selectRole(role.id)}
                disabled={loading}
                className={`
                  group relative p-6 rounded-2xl text-left transition-all duration-300
                  ${isSelected 
                    ? `bg-gradient-to-br ${role.gradient} text-white shadow-xl scale-105` 
                    : 'bg-white border-2 border-gray-100 hover:shadow-xl hover:scale-105'
                  }
                  ${loading && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {/* Icon */}
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300
                  ${isSelected ? 'bg-white/20' : role.bgColor}
                `}>
                  <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : role.iconColor}`} />
                </div>
                
                {/* Title */}
                <h2 className={`text-xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {role.title}
                </h2>
                
                {/* Description */}
                <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                  {role.description}
                </p>

                {/* Loading Spinner */}
                {isLoading && (
                  <div className="absolute top-4 right-4">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Selected Checkmark */}
                {isSelected && !isLoading && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  </div>
                )}

                {/* Hover Arrow */}
                {!isSelected && !loading && (
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Text */}
        <p className="text-sm text-gray-400">
          You can change this later in settings
        </p>
      </div>
    </div>
  );
}

export default RoleSelect;