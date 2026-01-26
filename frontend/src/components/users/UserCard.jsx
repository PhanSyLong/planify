import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './UserCard.css';

const UserCard = ({ user, onFollowToggle }) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);

  const handleFollow = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsFollowing(prev => !prev);
    if (onFollowToggle) {
      onFollowToggle(user.id, !isFollowing);
    }
  }, [user.id, isFollowing, onFollowToggle]);

  const initials = useMemo(() => {
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user.name]);

  return (
    <div className="user-card">
      <Link to={`/users/${user.id}`} className="user-card-link">
        <div className="user-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <div className="avatar-placeholder">{initials}</div>
          )}
        </div>

        <div className="user-info">
          <h3 className="user-name">{user.name}</h3>
          {user.description && (
            <p className="user-description">{user.description}</p>
          )}
          <div className="user-stats">
            <span>{user.followers || 0} followers</span>
            {' • '}
            <span>{user.plans || 0} plans</span>
          </div>
        </div>
      </Link>

      <button
        className={`follow-btn ${isFollowing ? 'following' : ''}`}
        onClick={handleFollow}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );
};

export default React.memo(UserCard);