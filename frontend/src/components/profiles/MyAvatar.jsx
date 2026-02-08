// src/components/profiles/MyAvatar.jsx
import "./MyAvatar.css";

export default function MyAvatar({ username, email, stats, avatar }) {
  const currentAvatar = avatar;

  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="my-avatar-section">
      <div className="my-avatar-container">
        <div className="my-avatar-frame">
          {currentAvatar ? (
            <img src={currentAvatar} alt="Profile" className="my-avatar-image" />
          ) : (
            <div className="my-avatar-placeholder">{initial}</div>
          )}
        </div>
      </div>

      <div className="my-avatar-info">
        <h1 className="my-avatar-username">{username}</h1>
        <p className="my-avatar-email">{email}</p>

        <div className="my-avatar-stats">
          <div className="my-avatar-stat">
            <span className="my-avatar-stat-number">{stats.followings}</span>
            <span>followings</span>
          </div>
          <span>•</span>
          <div className="my-avatar-stat">
            <span className="my-avatar-stat-number">{stats.followers}</span>
            <span>followers</span>
          </div>
          <span>•</span>
          <div className="my-avatar-stat">
            <span className="my-avatar-stat-number">{stats.plans}</span>
            <span>plans</span>
          </div>
        </div>
      </div>
    </div>
  );
}