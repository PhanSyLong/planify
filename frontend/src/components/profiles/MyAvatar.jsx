import { useState, useRef, useCallback } from "react";
import "./MyAvatar.css";

export default function MyAvatar({ username, stats, avatar, onAvatarChange }) {
  const [localAvatar, setLocalAvatar] = useState(avatar);
  const fileInputRef = useRef(null);

  const currentAvatar = localAvatar || avatar;

  const handleCameraClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLocalAvatar(event.target.result);
      onAvatarChange?.(event.target.result);
    };
    reader.readAsDataURL(file);
  }, [onAvatarChange]);

  const handleRemove = useCallback((e) => {
    e.stopPropagation();
    setLocalAvatar(null);
    onAvatarChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onAvatarChange]);

  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="my-avatar-section">
      <div className="my-avatar-container">
        <div className="my-avatar-frame">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="my-avatar-input"
          />

          {currentAvatar ? (
            <img src={currentAvatar} alt="Profile" className="my-avatar-image" />
          ) : (
            <div className="my-avatar-placeholder">{initial}</div>
          )}
        </div>

        <button
          className="my-avatar-camera-btn"
          onClick={handleCameraClick}
          aria-label="Change photo"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>

        {currentAvatar && (
          <button
            className="my-avatar-remove-btn"
            onClick={handleRemove}
            aria-label="Remove avatar"
          >
            ×
          </button>
        )}
      </div>

      <div className="my-avatar-info">
        <h1 className="my-avatar-username">{username}</h1>

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

        <div className="my-avatar-actions">
          <button className="my-avatar-more-btn" aria-label="More options">
            ⋯
          </button>
        </div>
      </div>
    </div>
  );
}