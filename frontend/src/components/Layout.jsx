import socket from "../socket";
import { SignOutButton, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Menu, Bell, ChevronDown, Settings, HelpCircle, FileText, Briefcase, LogOut, UserCircle } from "lucide-react";

function Layout({ children, role }) {
    const { user } = useUser();

    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);


    // Notification Socket
    useEffect(() => {

        socket.on(
            "notificationCountUpdated",
            (data) => setNotifications(data)
        );

        return () => {

            socket.off("notificationCountUpdated");
        };

    }, []);


    // Fetch notifications
    useEffect(() => {

        if (!user) return;

        fetch(
            `http://localhost:5000/notifications/${user.id}`
        )
            .then(res => res.json())
            .then(data => setNotifications(data));

    }, [user]);

    const unreadCount = notifications.filter(n => !n.isRead).length;


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-sm p-4 mb-6 sticky top-4 z-50">
                <div className="flex items-center justify-between">
                    {/* <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hidden min-[375px]:flex items-center justify-center shadow-md">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                JobSphere
                            </h1>
                        </div>
                            <p className="hidden md:block text-xs text-gray-500">Welcome back, {user?.fullName}</p>
                    </div> */}
                    <div className="flex items-center gap-3">
                        <div className="hidden min-[375px]:flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-gray-600 to-white text-white font-bold shadow-lg">
                            J
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white bg-clip-text">
                                JobSphere
                            </h1>
                            <p className="hidden md:block text-xs text-gray-300">Welcome back, {user?.fullName}</p>
                        </div>

                    </div>



                    {/* Mobile Navigation */}
                    {role === "seeker" ? (
                        <div className="flex md:hidden">

                            <UserButton />

                            <div className="relative inline-block">
                                {/* Menu Button */}
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-200"
                                >
                                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>

                                {/* Dropdown Menu - NO backdrop overlay */}
                                {isOpen && (
                                    <div className="absolute -left-41 mt-2 w-56 rounded-xl shadow-xl bg-gray-800"
                                        onMouseLeave={() => setIsOpen(false)}>
                                        {/* Role Badge */}
                                        <div className="">
                                            <div className="inline-flex justify-center px-3 rounded-t-xl w-full py-4 text-sm font-bold text-gray-500">
                                                {role === "seeker" ? "Job Seeker" : "Employer"}
                                            </div>
                                        </div>

                                        {/* Seeker Menu Items */}
                                        {role === "seeker" && (
                                            <>
                                                <Link to="/ManageSeekerProfile" onClick={() => setIsOpen(false)}>
                                                    <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-50 transition-colors cursor-pointer">
                                                        <UserCircle className="w-4 h-4 text-gray-100" />
                                                        <span>Manage Profile</span>
                                                    </div>
                                                </Link>

                                                <Link to="/Notifications" onClick={() => setIsOpen(false)}>
                                                    <div className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-50 transition-colors cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <Bell className="w-4 h-4 text-gray-100" />
                                                            <span>Notifications</span>
                                                        </div>
                                                        {unreadCount > 0 && (
                                                            <span className="bg-red-500 text-white text-xs font-medium rounded-full px-2 py-0.5">
                                                                {unreadCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Link>
                                            </>
                                        )}

                                        <hr className="my-2 border-gray-600" />

                                        {/* Sign Out */}
                                        <button
                                            onClick={() => {
                                                // Sign out logic
                                                setIsOpen(false);
                                            }}
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>) : (
                        <div className="flex items-center gap-4">
                            {role && (
                                <div className="px-3 py-1 rounded-full text-sm text-gray-100 bg-white/40 font-medium">
                                    {role === "seeker" ? "Job Seeker" : "Employer"}
                                </div>
                            )}

                            {role === "seeker" && (
                                <div className="flex items-center gap-3">
                                    <Link to="/ManageSeekerProfile">
                                        <button className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">
                                            Manage Profile
                                        </button>
                                    </Link>
                                    <Link to="/Notifications">
                                        <div className="relative">
                                            <Bell className="w-6 h-6 text-indigo-500" />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            )}
                            <UserButton />
                            {/* <SignOutButton> */}
                            {/* <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"> */}
                            {/* <LogOut className="w-4 h-4" /> */}
                            {/* <span className="hidden sm:inline">Sign Out</span> */}
                            {/* </button> */}
                            {/* </SignOutButton> */}
                        </div>
                    )}


                    {/* Desktop Navigation */}
                    {role === "seeker" && (
                        <div className="hidden md:flex items-center gap-4">
                            {role && (
                                <div className="px-3 py-1 rounded-full text-sm text-gray-100 bg-white/40 font-medium">
                                    {role === "seeker" ? "Job Seeker" : "Employer"}
                                </div>
                            )}

                            {role === "seeker" && (
                                <div className="flex items-center gap-3">
                                    <Link to="/ManageSeekerProfile">
                                        <button className="px-3 py-1 text-gray-300 rounded-full text-sm font-medium hover:bg-white/40 transition-colors">
                                            Manage Profile
                                        </button>
                                    </Link>
                                    <Link to="/Notifications">
                                        <div className="relative">
                                            <Bell className="w-6 h-6 text-gray-300" />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            )}
                            <UserButton />
                            {/* <SignOutButton> */}
                            {/* <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"> */}
                            {/* <LogOut className="w-4 h-4" /> */}
                            {/* <span className="hidden sm:inline">Sign Out</span> */}
                            {/* </button> */}
                            {/* </SignOutButton> */}
                        </div>
                    )}



                </div>
            </header>

            {/* Content */}
            <main>{children}</main>
        </div>
    );
}

export default Layout;