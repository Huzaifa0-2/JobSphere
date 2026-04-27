import { useSelector, useDispatch } from "react-redux";
import { fetchSeekerProfile } from "../features/profile/profileSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    GraduationCap,
    UserCircle,
    Loader2,
    Calendar,
    Award,
    // Linkedin,
    // Github,
    Globe,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

const SeekerProfile = () => {
    const dispatch = useDispatch();
    const { seekerProfile, loading } = useSelector((state) => state.seekerProfile);
    const { userId } = useParams();
    const [imageLoaded, setImageLoaded] = useState(false);

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
                <div className="text-center max-w-md mx-auto px-4">
                    <UserCircle className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Profile Not Found</h2>
                    <p className="text-gray-500">This user profile does not exist.</p>
                </div>
            </div>
        );
    }

    const whatsappNumber = seekerProfile.phone.replace(/^0/, '');

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Back Button - Mobile Optimized */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 hover:text-gray-900"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back</span>
                </button>

                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Cover Image with Overlay */}
                    <div className="relative h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-600 to-indigo-600">
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    {/* Profile Info */}
                    <div className="relative px-4 sm:px-6 pb-6">
                        {/* Avatar - Responsive positioning */}
                        <div className="absolute -top-12 left-1/2 sm:left-6 transform -translate-x-1/2 sm:translate-x-0">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white overflow-hidden">
                                {seekerProfile.imageUrl ? (
                                    <>
                                        {!imageLoaded && (
                                            <Loader2 className="w-8 h-8 text-white animate-spin absolute" />
                                        )}
                                        <img
                                            src={seekerProfile.imageUrl}
                                            alt={`${seekerProfile.firstName}'s profile`}
                                            className={`w-full h-full object-cover ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                                            onLoad={() => setImageLoaded(true)}
                                        />
                                    </>
                                ) : (
                                    <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                                )}
                            </div>
                        </div>

                        {/* Name and Title - Mobile centered, desktop left */}
                        <div className="sm:ml-0 md:ml-36 pt-20 md:pt-0 sm:mt-16 md:mt-20 text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                                {seekerProfile.firstName} {seekerProfile.lastName}
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm sm:text-base">
                                {seekerProfile.title || "Job Seeker"}
                            </p>

                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                    {/* Contact Information */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-blue-600" />
                            Contact Information
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-600 text-sm sm:text-base break-all">
                                <Mail className="w-4 h-4 flex-shrink-0" />
                                <span>{seekerProfile.email}</span>
                            </div>

                            <a href={`https://wa.me/92${whatsappNumber}?text=Hey%20there!%20I%20just%20saw%20your%20portfolio%20and%20I'd%20love%20to%20know%20more%20about%20your%20work.%20Are%20you%20available%20for%20a%20chat%3F`} target="_blank" rel="noopener noreferrer">
                                <div className="flex items-center gap-3 text-gray-600 hover:text-blue-500 text-sm sm:text-base">
                                    <Phone className="w-4 h-4 flex-shrink-0" />
                                    <span>{seekerProfile.phone}</span>
                                    <ChevronRight className="w-4 h-4 -ml-2" />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeekerProfile;