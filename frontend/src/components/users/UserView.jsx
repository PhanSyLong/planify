import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Để lấy userId từ URL
import AvatarCard from "../myProfile/MyAvatar"; // Reuse avatar
import BioAndMenu from "../myProfile/MyBioMenu"; // Reuse bio section (chỉ view, không edit)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "./UserView.css"; // CSS riêng

export default function UserView() {
  const { userId } = useParams(); // Lấy ID từ URL: /users/:userId

  // Demo data - sau này fetch từ API dựa trên userId
  const [userData, setUserData] = useState({
    name: "Emma Johnson",
    bio: "IELTS 8.5 | Official Examiner & Mentor. Helping students achieve Band 7+!",
    avatar: null, // Có thể là URL ảnh
    stats: {
      plans: 18,
      followings: 320,
      followers: 2450,
    },
    isFollowing: false, // Trạng thái follow của bạn với user này
  });

  const [loading, setLoading] = useState(true);

  // Simulate fetch user data
  useEffect(() => {
    // TODO: Thay bằng API call thực tế
    // fetch(`/api/users/${userId}`).then(res => res.json()).then(setUserData)
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [userId]);

  const handleFollowToggle = () => {
    setUserData((prev) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
    }));
    // TODO: Gọi API để update follow
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="userview-page">
      {/* Profile Header */}
      <div className="profile-header-section">
        <AvatarCard avatarUrl={userData.avatar} name={userData.name} /> {/* Reuse, chỉ view */}

        <div className="profile-info-section">
          {/* Tên + Nút Follow */}
          <div className="profile-name-row">
            <h2>{userData.name}</h2>

            <div className="action-buttons">
              <button
                className={`follow-btn ${userData.isFollowing ? "following" : ""}`}
                onClick={handleFollowToggle}
              >
                {userData.isFollowing ? "Following" : "Follow"}
              </button>

              <button className="message-btn">
                <FontAwesomeIcon icon={faEnvelope} />
                Message
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{userData.stats.plans}</span>
              <span className="stat-label">Plans</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{userData.stats.followings}</span>
              <span className="stat-label">Followings</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{userData.stats.followers}</span>
              <span className="stat-label">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio và Menu (chỉ view, không edit) */}
      <BioAndMenu bio={userData.bio} isViewOnly={true} />
    </div>
  );
}