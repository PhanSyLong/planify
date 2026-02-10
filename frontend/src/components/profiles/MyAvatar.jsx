// src/components/profiles/MyAvatar.jsx
import "./MyAvatar.css";

export default function MyAvatar({ username, email, avatar }) {
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

      </div>
    </div>
  );
}