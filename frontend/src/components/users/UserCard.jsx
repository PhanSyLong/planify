import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';
import './UserCard.css';

const UserCard = ({ user, onFollowToggle }) => {
  if (!user || !user.id) {
    console.warn('UserCard received invalid user:', user);
    return null;
  }


  const displayName = user.name || user.username || (user.email ? user.email.split('@')[0] : 'User');

  const initials = useMemo(() => {
    const source = user.name || user.username || user.email || 'User';
    if (typeof source !== 'string' || !source.trim()) return '??';
    return source
      .trim()
      .split(/\s+/)
      .map(p => p[0]?.toUpperCase() || '')
      .join('')
      .slice(0, 2) || '??';
  }, [user.name, user.username, user.email]);

  const showEmail = user.email && user.email !== `${displayName.toLowerCase()}@example.com`;

  return (
    <div className="user-card">
      <Link to={`/profile/${user.id}`} className="user-card-link">
        <div className="user-avatar">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              onError={e => (e.target.src = '/default-avatar.png')}
            />
          ) : (
            <div className="avatar-placeholder">{initials}</div>
          )}
        </div>

        <div className="user-info">
          <h3 className="user-name">{displayName}</h3>
          {showEmail && <p className="user-email">{user.email}</p>}
          {/* Bỏ phần user-stats */}
        </div>
      </Link>

      <FollowButton
        userId={user.id}
        initialIsFollowing={user.isFollowing || false}
        size="small"
        className="user-card-follow-btn"
        onToggle={(newFollowing) => {
          onFollowToggle?.(user.id, newFollowing);
        }}
      />
    </div>
  );
};

export default React.memo(UserCard);