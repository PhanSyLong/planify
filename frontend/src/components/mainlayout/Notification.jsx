// src/pages/Notifications.jsx
import React, { useState } from 'react';
import { useNavigate,useOutletContext  } from 'react-router-dom';
import './Notification.css'; // we'll create this next

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const { notifications, setNotifications } = useOutletContext();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

    const displayedNotifications = notifications.filter(
    notif => filter === 'all' || !notif.read
  );
    const handleClick = (notif) => {
        setNotifications(prev =>
            prev.map(n =>
                n.id === notif.id ? { ...n, read: true } : n
            )
        );
        if (notif.link) navigate(notif.link);
    };

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
              onClick={() => handleClick(notif)}
              style={notif.link ? { cursor: 'pointer' } : {}}
            >
              {notif.avatar && (
                <img src={notif.avatar} alt={notif.name} className="avatar" />
              )}
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