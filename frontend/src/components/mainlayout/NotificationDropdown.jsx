import React, { useState, useEffect, useRef } from 'react';
import './NotificationDropdown.css';

const NotificationDropdown = ({ isOpen, onClose, containerRef, notifications = [] }) => {
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

  const displayedNotifications = notifications.filter(notif =>
    filter === 'all' || !notif.read
  );

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="notification-header">
        <h3>Notifications</h3>
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="unread-badge">
            {notifications.filter(n => !n.read).length} new
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
              // navigate to full page - assuming you have useNavigate
              window.location.href = '/notifications';
              // or better: use navigate('/notifications') if you import useNavigate
            }}
          >
            View all notifications
          </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;