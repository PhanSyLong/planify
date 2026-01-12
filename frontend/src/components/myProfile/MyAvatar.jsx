import { useState } from "react";
import "./MyAvatar.css";

export default function AvatarCard() {
  const [avatar, setAvatar] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profile-avatar-wrapper">
      <div className="profile-avatar">
        {avatar ? (
          <img src={avatar} alt="Avatar" />
        ) : (
          <div className="avatar-placeholder">C</div>
        )}
      </div>
      <label className="avatar-edit-btn">
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </label>
    </div>
  );
}