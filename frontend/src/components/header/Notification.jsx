// src/pages/Notifications.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notification.css'; // we'll create this next

// Using the same fake data (you can later replace with real data from API/context)
const fakeNotifications = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "https://i.pravatar.cc/48?u=sarah",
    action: "commented on your post",
    message: "This looks amazing! 🔥",
    time: "5m ago",
    read: false,
    link: "/plans/123" // example - you can make these clickable
  },
  {
    id: 2,
    name: "Michael Park",
    avatar: "https://i.pravatar.cc/48?u=michael",
    action: "liked your photo",
    time: "28m ago",
    read: false,
    link: "/commu"
  },
  {
    id: 3,
    name: "Emma Thompson",
    avatar: "https://i.pravatar.cc/48?u=emma",
    action: "started following you",
    time: "2h ago",
    read: true,
    link: "/users/emma123"
  },
  {
    id: 4,
    name: "Alex Kim",
    avatar: "https://i.pravatar.cc/48?u=alex",
    action: "mentioned you in a comment",
    message: "@vu check this out!",
    time: "1d ago",
    read: true
  },
  {
    id: 5,
    name: "Project Team",
    avatar: "https://i.pravatar.cc/48?u=team",
    action: "added a new task to",
    message: "Website Redesign 2026",
    time: "2d ago",
    read: true
  },
  {
    id: 6,
    name: "Lisa Wong",
    avatar: "https://i.pravatar.cc/48?u=lisa",
    action: "shared your project",
    time: "3d ago",
    read: true
  },
  {
    id: 7,
    name: "David Lee",
    avatar: "https://i.pravatar.cc/48?u=david",
    action: "invited you to collaborate",
    time: "4d ago",
    read: false
  }
];

const Notifications = () => {
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const navigate = useNavigate();

  const displayedNotifications = fakeNotifications.filter(notif =>
    filter === 'all' || !notif.read
  );

  const unreadCount = fakeNotifications.filter(n => !n.read).length;

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