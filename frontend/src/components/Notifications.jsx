import { API_URL } from "../config";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Bell, CheckCircle, Circle, Eye, Trash2, Clock, Briefcase, Users, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function Notifications() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    fetch(`${API_URL}/notifications/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  // Mark as read
  const markRead = async (id) => {
    await fetch(`${API_URL}/notifications/${id}/read`, { method: "PUT" });
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  // Mark all as read
  const markAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
    for (const id of unreadIds) {
      await fetch(`${API_URL}/notifications/${id}/read`, { method: "PUT" });
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Get icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case "job": return <Briefcase className="w-5 h-5 text-blue-500" />;
      case "application": return <Users className="w-5 h-5 text-green-500" />;
      case "status": return <Star className="w-5 h-5 text-yellow-500" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Notifications
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Stay updated with your job applications and alerts
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
          >
            <Eye className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">Unread Notifications</p>
            <p className="text-3xl font-bold text-gray-900">{unreadCount}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications yet</h3>
          <p className="text-gray-500">When you get notifications, they'll appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`
                group relative flex items-start gap-4 p-4 rounded-xl transition-all duration-200
                ${n.isRead 
                  ? "bg-white border border-gray-100 hover:shadow-md" 
                  : "bg-blue-50/50 border border-blue-100 hover:shadow-md"
                }
              `}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${n.isRead ? "bg-gray-100" : "bg-blue-100"}
                `}>
                  {getIcon(n.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className={`font-semibold ${n.isRead ? "text-gray-700" : "text-gray-900"}`}>
                    {n.title}
                  </h3>
                  <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap">
                    <Clock className="w-3 h-3" />
                    {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : "recently"}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${n.isRead ? "text-gray-500" : "text-gray-600"}`}>
                  {n.message}
                </p>
              </div>

              {/* Action Button */}
              {!n.isRead && (
                <button
                  onClick={() => markRead(n._id)}
                  className="flex-shrink-0 px-3 py-1.5 text-sm font-medium text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition border border-blue-200"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;