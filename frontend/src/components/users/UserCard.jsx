import React from 'react';
import { Link } from 'react-router-dom';
import './UserCard.css';

const UserCard = ({ user, onFollowToggle }) => {
  const [isFollowing, setIsFollowing] = React.useState(user.isFollowing || false);

  const handleFollow = (e) => {
    e.preventDefault(); // Prevent navigation when clicking button
    e.stopPropagation();

    setIsFollowing(!isFollowing);
    if (onFollowToggle) {
      onFollowToggle(user.id, !isFollowing);
    }
  };

  return (
    // Trong return của UserCard
    <div className="user-card">
      <Link to={`/users/${user.id}`} className="user-card-link"> {/* ← Đổi thành /users/:id */}
        <div className="user-avatar">
          {/* ... avatar code ... */}
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

export default UserCard;