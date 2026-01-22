import { useState, useCallback } from "react";
import "./UserAvatar.css";

export default function UserAvatar({ username, stats, avatar }) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowClick = useCallback(() => {
    setIsFollowing(!isFollowing);
    // TODO: Call API to follow/unfollow
    console.log(isFollowing ? "Unfollowed" : "Followed", username);
  }, [isFollowing, username]);

  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="user-avatar-section">
      <div className="user-avatar-frame">
        {avatar ? (
          <img src={avatar} alt={username} className="user-avatar-image" />
        ) : (
          <div className="user-avatar-placeholder">{initial}</div>
        )}
      </div>

      <div className="user-avatar-info">
        <h1 className="user-avatar-username">{username}</h1>

        <div className="user-avatar-stats">
          <div className="user-avatar-stat">
            <span className="user-avatar-stat-number">{stats.followings}</span>
            <span>followings</span>
          </div>
          <span>•</span>
          <div className="user-avatar-stat">
            <span className="user-avatar-stat-number">{stats.followers}</span>
            <span>followers</span>
          </div>
          <span>•</span>
          <div className="user-avatar-stat">
            <span className="user-avatar-stat-number">{stats.plans}</span>
            <span>plans</span>
          </div>
        </div>

        <div className="user-avatar-actions">
          <button
            className={`user-avatar-follow-btn ${isFollowing ? "following" : ""}`}
            onClick={handleFollowClick}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>

          <button className="user-avatar-more-btn" aria-label="More options">
            ⋯
          </button>
        </div>
      </div>
    </div>
  );
}