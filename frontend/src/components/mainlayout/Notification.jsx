import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notification.css';

// Expect notifications to be passed from parent / context / api
const Notifications = ({ notifications = [] }) => {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const displayedNotifications = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter(n => !n.read);
    }
    return notifications;
  }, [notifications, filter]);

  const handleNotificationClick = useCallback((notification) => {
    if (notification.link) {
      navigate(notification.link);
    }
  }, [navigate]);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

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
          onClick={() => handleFilterChange('all')}
          type="button"
          aria-label="Show all notifications"
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => handleFilterChange('unread')}
          type="button"
          aria-label={`Show unread notifications (${unreadCount})`}
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
              onClick={() => handleNotificationClick(notif)}
              style={{ cursor: notif.link ? 'pointer' : 'default' }}
              role={notif.link ? 'button' : undefined}
              tabIndex={notif.link ? 0 : undefined}
              onKeyDown={(e) => {
                if (notif.link && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleNotificationClick(notif);
                }
              }}
            >
              <img
                src={notif.avatar}
                alt={`${notif.name}'s avatar`}
                className="avatar"
                loading="lazy"
              />
              <div className="content">
                <p className="main-text">
                  <strong>{notif.name}</strong> {notif.action}
                  {notif.message && <span className="message"> {notif.message}</span>}
                </p>
                <span className="time">{notif.time}</span>
              </div>
              {!notif.read && <div className="unread-dot" aria-label="Unread notification" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;