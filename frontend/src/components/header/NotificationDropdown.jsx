import React, { useState, useEffect, useRef } from 'react';
import './NotificationDropdown.css';

const fakeNotifications = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "https://i.pravatar.cc/48?u=sarah",
    action: "commented on your post",
    message: "This looks amazing! 🔥",
    time: "5m ago",
    read: false
  },
  {
    id: 2,
    name: "Michael Park",
    avatar: "https://i.pravatar.cc/48?u=michael",
    action: "liked your photo",
    time: "28m ago",
    read: false
  },
  {
    id: 3,
    name: "Emma Thompson",
    avatar: "https://i.pravatar.cc/48?u=emma",
    action: "started following you",
    time: "2h ago",
    read: true
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
  // Add more if you want to test scrolling
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

const NotificationDropdown = ({ isOpen, onClose, containerRef }) => {
  const dropdownRef = useRef(null);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        containerRef?.current &&
        !containerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, containerRef]);

  if (!isOpen) return null;

  const displayedNotifications = fakeNotifications.filter(notif =>
    filter === 'all' || !notif.read
  );

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="notification-header">
        <h3>Notifications</h3>
        {fakeNotifications.filter(n => !n.read).length > 0 && (
          <span className="unread-badge">
            {fakeNotifications.filter(n => !n.read).length} new
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="notification-filters">
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
          Unread
        </button>
      </div>

      <div className="notification-list">
        {displayedNotifications.length === 0 ? (
          <p className="no-notifications">
            {filter === 'unread' ? "No unread notifications" : "No notifications yet"}
          </p>
        ) : (
          displayedNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${!notif.read ? 'unread' : ''}`}
            >
              <img src={notif.avatar} alt={notif.name} className="avatar" />
              <div className="content">
                <p>
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

      <div className="notification-footer">
          <button
            className="view-all"
            onClick={() => {
              onClose();
              window.location.href = '/notifications';
            }}
          >
            View all notifications
          </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;