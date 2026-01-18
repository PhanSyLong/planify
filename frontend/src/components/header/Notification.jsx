// src/pages/Notifications.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notification.css'; // we'll create this next

const Notifications = () => {
    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const es = new EventSource(
            "http://localhost:8080/planify/notifications/stream",
            { withCredentials: true }
        );

        es.onopen = () => {
            console.log("✅ SSE connected");
        };

        es.addEventListener("notification", (e) => {
            const data = JSON.parse(e.data);

            // map backend → frontend model
            const notif = {
                id: data.id,
                name: data.plan?.name,
                action: data.type,
                message: data.messageText,
                time: "just now",
                read: false,
                link: `/plans/${data.plan?.id}`
            };


            //  UI realtime
            setNotifications(prev => [notif, ...prev]);
        });

        // error -> close SSE
        es.onerror = (err) => {
            console.error("❌ SSE error", err);
            es.close();
        };

        //  Cleanup when reload / unmount
        return () => {
            console.log("🔌 SSE cleanup");
            es.close();
        };
    }, []);


    const displayedNotifications = notifications.filter(
        notif => filter === 'all' || !notif.read
    );

    const unreadCount = notifications.filter(n => !n.read).length;


  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <span className="unread-count">{unreadCount} new</span>
        )}
      </div>

      <div className="notifications-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
      </div>

      <div className="notifications-list">
        {displayedNotifications.length === 0 ? (
          <div className="empty-state">
            <p>
              {filter === 'unread'
                ? "You're all caught up! 🎉"
                : "No notifications yet"}
            </p>
          </div>
        ) : (
          displayedNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${!notif.read ? 'unread' : ''}`}
              onClick={() => notif.link && navigate(notif.link)}
              style={notif.link ? { cursor: 'pointer' } : {}}
            >
              <img src={notif.avatar} alt={notif.name} className="avatar" />
              <div className="content">
                <p className="main-text">
                  <strong>{notif.name}</strong> {notif.action}
                  {notif.message && <span className="message"> {notif.message}</span>}
                </p>
                <span className="time">{notif.time}</span>
              </div>
              {!notif.read && <div className="unread-dot" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;