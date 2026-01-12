import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBioMenu.css";

export default function BioAndMenu({ bio, setBio }) {
  const navigate = useNavigate();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [activeTab, setActiveTab] = useState("plans");

  // Demo data - ready for backend
  const demoFollowings = [
    { id: 1, name: "User1", avatar: null },
    { id: 2, name: "User2", avatar: null },
    { id: 3, name: "User3", avatar: null },
  ];

  const demoFollowers = [
    { id: 1, name: "Follower1", avatar: null },
    { id: 2, name: "Follower2", avatar: null },
  ];

  const demoPlans = [
    { id: 1, title: "Learn React", category: "Study" },
    { id: 2, title: "Fitness Journey", category: "Health" },
    { id: 3, title: "Career Development", category: "Work" },
  ];

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="bio-menu-container">
      {/* Bio Section */}
      <div className="profile-bio-card">
        <h3>My Bio</h3>
        <div className="bio-content">
            {isEditingBio ? (
              <>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bio-edit-textarea"
                />

                <div className="bio-actions">
                  <button
                    className="btn-save"
                    onClick={() => setIsEditingBio(false)}
                  >
                    Save
                  </button>

                  <button
                    className="btn-cancel"
                    onClick={() => setIsEditingBio(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <p>{bio || "Write something about yourself…"}</p>
            )}


          <button
            className="edit-icon-btn-bio"
            onClick={() => setIsEditingBio(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>



      {/* Tabs and Content */}
      <div className="profile-menu-section">
        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={activeTab === "plans" ? "active" : ""}
            onClick={() => setActiveTab("plans")}
          >
            Plans
          </button>
          <button
            className={activeTab === "followings" ? "active" : ""}
            onClick={() => setActiveTab("followings")}
          >
            Followings
          </button>
          <button
            className={activeTab === "followers" ? "active" : ""}
            onClick={() => setActiveTab("followers")}
          >
            Followers
          </button>
        </div>

        {/* Content Area */}
        <div className="profile-content">
          {activeTab === "plans" && (
            <div className="plans-grid">
              {demoPlans.map((plan) => (
                <div key={plan.id} className="plan-card-small">
                  <h4>{plan.title}</h4>
                  <span className="plan-category">{plan.category}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "followings" && (
            <div className="users-list">
              {demoFollowings.map((user) => (
                <div
                  key={user.id}
                  className="user-item"
                  onClick={() => handleUserClick(user.id)}
                >
                  <div className="user-avatar-small">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span>{user.name.charAt(0)}</span>
                    )}
                  </div>
                  <span className="user-name">{user.name}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "followers" && (
            <div className="users-list">
              {demoFollowers.map((user) => (
                <div
                  key={user.id}
                  className="user-item"
                  onClick={() => handleUserClick(user.id)}
                >
                  <div className="user-avatar-small">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span>{user.name.charAt(0)}</span>
                    )}
                  </div>
                  <span className="user-name">{user.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}