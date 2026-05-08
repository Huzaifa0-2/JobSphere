import { useEffect, useState } from "react";

import { useUser } from "@clerk/clerk-react";

function Notifications() {

  const { user } = useUser();

  const [notifications, setNotifications] = useState([]);

  // Fetch notifications
  useEffect(() => {

    if (!user) return;

    fetch(
      `http://localhost:5000/notifications/${user.id}`
    )
      .then(res => res.json())
      .then(data => setNotifications(data));

  }, [user]);



  // Mark as read
  const markRead = async (id) => {

    await fetch(
      `http://localhost:5000/notifications/${id}/read`,
      {
        method: "PUT"
      }
    );

    setNotifications(prev =>
      prev.map(n =>
        n._id === id
          ? { ...n, isRead: true }
          : n
      )
    );
  };



  const unreadCount = notifications.filter(n => !n.isRead).length;



  return (
    <div className="bg-white p-4 rounded shadow">

      <h2 className="text-xl font-bold mb-3">
        🔔 Notifications ({unreadCount})
      </h2>

      {notifications.map(n => (

        <div
          key={n._id}
          className={`border p-3 mb-2 rounded
          ${n.isRead
              ? "bg-gray-100"
              : "bg-blue-100"
            }`}
        >

          <h3 className="font-semibold">
            {n.title}
          </h3>

          <p>{n.message}</p>

          {!n.isRead && (
            <button
              onClick={() => markRead(n._id)}
              className="bg-blue-600 text-white px-3 py-1 mt-2 rounded"
            >
              Mark Read
            </button>
          )}

        </div>
      ))}

    </div>
  );
}

export default Notifications;