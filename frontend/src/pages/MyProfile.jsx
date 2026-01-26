import { useState } from "react";
import AvatarCard from "../components/myProfile/MyAvatar";
import BioAndMenu from "../components/myProfile/MyBioMenu";
import "./MyProfile.css";

export default function MyProfile() {
  const [name, setName] = useState("Choi1505");
  const [bio, setBio] = useState("This is my bio. I love creating plans and staying organized!");
  const [isEditingName, setIsEditingName] = useState(false);

  // Demo data - ready for backend
  const stats = {
    plans: 12,
    followings: 15,
    followers: 5
  };

  return (
    <div className="myprofile-page">
      {/* Profile Header */}
      <div className="profile-header-section">
        <AvatarCard />

        <div className="profile-info-section">
          <div className="profile-name-row">
            {isEditingName ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                autoFocus
                className="name-edit-input"
              />
            ) : (
              <h2>{name}</h2>
            )}
            <button
              className="edit-icon-btn"
              onClick={() => setIsEditingName(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.plans}</span>
              <span className="stat-label">Plans</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.followings}</span>
              <span className="stat-label">Followings</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.followers}</span>
              <span className="stat-label">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio and Menu Section */}
      <BioAndMenu bio={bio} setBio={setBio} />
    </div>
  );
}