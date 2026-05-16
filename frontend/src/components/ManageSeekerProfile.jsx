import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { fetchSeekerProfile, createUpdateSeekerProfile } from "../features/profile/profileSlice";
import SeekerProfile from "../pages/SeekerProfile";

function ManageSeekerProfile() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const { seekerProfile, loading } = useSelector((state) => state.seekerProfile);
    const dispatch = useDispatch();
    const { user } = useUser();


    useEffect(() => {
        if (user) {
            dispatch(fetchSeekerProfile(user.id));
        }
    }, [user]);

    useEffect(() => {
        if (seekerProfile) {
            setFirstName(seekerProfile.firstName);
            setLastName(seekerProfile.lastName);
            setEmail(seekerProfile.email);
            setPhone(seekerProfile.phone);
        }
    }, [seekerProfile]);

    const handleProfile = (e) => {
        e.preventDefault();
        dispatch(createUpdateSeekerProfile({
            userId: user.id,
            profileData: {
                firstName,
                lastName,
                email,
                phone,
                imageUrl: user.imageUrl
            }
        }));
    }

    return (
        <div>
            <SeekerProfile />
            <div className="-mt-40 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <form onSubmit={handleProfile}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                        required
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g., Huzaifa"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                        required
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g., Riaz"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g., Huzaifa@example.com"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        required
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g., +923000000000"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />

                    <button
                        type="submit"
                        className="cursor-pointer flex items-center justify-center max-w-72 w-full md:w-62 mt-8 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 
            gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                        Save Changes
                    </button>

                </form>
            </div>
        </div>
    )
}

export default ManageSeekerProfile