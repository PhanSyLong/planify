import { useState } from "react";
import FollowButton from "../users/FollowButton"; // điều chỉnh path cho đúng
import "./UserAvatar.css";

export default function UserAvatar({
  username,
  email,
  avatar,
  isFollowing: initialIsFollowing = false,
  onFollowToggle = () => {},
  isOwnProfile = false,
  userId,
}) {
  const initial = username?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="user-avatar-section">
      <div className="user-avatar-frame">
        {avatar ? (
          <img
            src={avatar}
            alt={username}
            className="user-avatar-image"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
        ) : (
          <div className="user-avatar-placeholder">{initial}</div>
        )}
      </div>

      <div className="user-avatar-info">
        <div className="user-header-row">
          <div className="user-name-group">
            <h1 className="user-avatar-username">{username || "User"}</h1>
            {email && <p className="user-avatar-email">{email}</p>}
          </div>

          {!isOwnProfile && userId && (
            <FollowButton
              userId={userId}
              initialIsFollowing={initialIsFollowing}
              size="default"
              onToggle={(newFollowing) => {
                onFollowToggle(newFollowing);
              }}
            />
          )}
        </div>

        {/* Đã xóa toàn bộ phần stats */}
      </div>
    </div>
  );
}