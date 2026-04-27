import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { fetchSeekerProfile, createUpdateSeekerProfile } from "../features/profile/profileSlice";

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

    // const handleUpdateProfile = (e) => {
    //     e.preventDefault();
    //     dispatch(updateSeekerProfile({
    //         userId: user.id,
    //         firstname,
    //         lastName,
    //         email,
    //         phone
    //     }));
    // }

    return (
        <div>
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
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                    Save Changes
                </button>

            </form>
        </div>
    )
}

export default ManageSeekerProfile