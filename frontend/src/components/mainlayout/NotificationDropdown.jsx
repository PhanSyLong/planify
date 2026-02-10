import React, { useState, useEffect, useRef } from 'react';
import './NotificationDropdown.css';
import { useNavigate } from "react-router-dom";


const NotificationDropdown = ({
  isOpen,
  onClose,
  containerRef,
  notifications = [], // ← receive from parent
  setNotifications
}) => {
    const navigate = useNavigate();
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

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayedNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;
    const handleClick = (notif) => {
        // 1. mark as read
        setNotifications(prev =>
            prev.map(n =>
                n.id === notif.id ? { ...n, read: true } : n
            )
        );

        // 2. navigate
        if (notif.link) {
            navigate(notif.link);
            onClose(); // đóng dropdown
        }
    };

    return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="notification-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount} new</span>
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
                  onClick={() => handleClick(notif)}
              >

                  {notif.avatar && (
                      <img
                          src={notif.avatar}
                          alt={notif.name}
                          className="avatar"
                      />
                  )}

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
            // or better: use useNavigate() if you can import it here
          }}
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;