import { useSelector, useDispatch } from "react-redux";
import { fetchSeekerProfile } from "../features/profile/profileSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Briefcase, 
    GraduationCap,
    Award,
    Calendar,
    UserCircle,
    Loader2
} from "lucide-react";

const SeekerProfile = () => {
    const dispatch = useDispatch();
    const { seekerProfile, loading } = useSelector((state) => state.seekerProfile);
    
    const { userId } = useParams();
    
    useEffect(() => {
        dispatch(fetchSeekerProfile(userId));
    }, [userId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!seekerProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <UserCircle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Profile Not Found</h2>
                    <p className="text-gray-500">This user profile does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Cover Image */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                    
                    {/* Profile Info */}
                    <div className="relative px-6 pb-6">
                        {/* Avatar */}
                        <div className="absolute -top-12 left-6">
                            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                                <User className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        
                        {/* Name and Title */}
                        <div className="mt-12 text-left">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {seekerProfile.firstName} {seekerProfile.lastName}
                            </h1>
                            <p className="text-gray-500 mt-1">{seekerProfile.title || "Job Seeker"}</p>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    {/* Contact Information */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-blue-600" />
                            Contact Information
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span>{seekerProfile.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{seekerProfile.phone}</span>
                            </div>
                            {seekerProfile.location && (
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{seekerProfile.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Professional Summary */}
                    {(seekerProfile.skills || seekerProfile.experience) && (
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                                Professional Summary
                            </h2>
                            <div className="space-y-4">
                                {seekerProfile.skills && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {seekerProfile.skills.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {seekerProfile.experience && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">Experience</p>
                                        <p className="text-gray-700">{seekerProfile.experience}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {seekerProfile.education && (
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                                Education
                            </h2>
                            <p className="text-gray-700">{seekerProfile.education}</p>
                        </div>
                    )}
                </div>

                {/* Back Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeekerProfile;