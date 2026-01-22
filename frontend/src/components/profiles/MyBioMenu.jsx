import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBioMenu.css";

const MOCK_PLANS = [
  { id: 1, title: "30-Day Fitness Challenge", stages: 4, tasks: 12 },
  { id: 2, title: "Learn Spanish", stages: 6, tasks: 24 },
  { id: 3, title: "Web Dev Bootcamp", stages: 8, tasks: 36 },
];

const MOCK_SAVED = [
  { id: 4, title: "Meditation Guide", stages: 2, tasks: 6 },
  { id: 5, title: "Healthy Cooking", stages: 4, tasks: 15 },
];

const MOCK_FOLLOWINGS = [
  { id: 1, username: "john_doe", plans: 8, followers: 120 },
  { id: 2, username: "jane_smith", plans: 15, followers: 230 },
  { id: 3, username: "alex_dev", plans: 12, followers: 180 },
];

const MOCK_FOLLOWERS = [
  { id: 4, username: "mike_wilson", plans: 5, followers: 90 },
  { id: 5, username: "sarah_jones", plans: 20, followers: 450 },
];

export default function MyBioMenu({ bio, onBioChange }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState(bio);

  const handleEditBio = useCallback(() => {
    setTempBio(bio);
    setIsEditingBio(true);
  }, [bio]);

  const handleSaveBio = useCallback(() => {
    onBioChange?.(tempBio);
    setIsEditingBio(false);
  }, [tempBio, onBioChange]);

  const handleCancelBio = useCallback(() => {
    setTempBio(bio);
    setIsEditingBio(false);
  }, [bio]);

  const handleUserClick = useCallback((username) => {
    navigate(`/profile/${username}`);
  }, [navigate]);

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "about":
        return null;

      case "plans":
        return MOCK_PLANS.length > 0 ? (
          <div className="my-bio-grid">
            {MOCK_PLANS.map((plan) => (
              <div key={plan.id} className="plan-card">
                <div className="plan-card-image">📋</div>
                <div className="plan-card-content">
                  <div className="plan-card-title">{plan.title}</div>
                  <div className="plan-card-meta">
                    {plan.stages} stages • {plan.tasks} tasks
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="my-bio-empty">
            <p>No plans yet</p>
            <span>Start creating plans to see them here</span>
          </div>
        );

      case "saved":
        return MOCK_SAVED.length > 0 ? (
          <div className="my-bio-grid">
            {MOCK_SAVED.map((plan) => (
              <div key={plan.id} className="plan-card">
                <div className="plan-card-image">📋</div>
                <div className="plan-card-content">
                  <div className="plan-card-title">{plan.title}</div>
                  <div className="plan-card-meta">
                    {plan.stages} stages • {plan.tasks} tasks
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="my-bio-empty">
            <p>No saved plans</p>
            <span>Save plans to see them here</span>
          </div>
        );

      case "followings":
        return (
          <div className="my-bio-users-grid">
            {MOCK_FOLLOWINGS.map((user) => (
              <div
                key={user.id}
                className="user-card"
                onClick={() => handleUserClick(user.username)}
                style={{ cursor: 'pointer' }}
              >
                <div className="user-card-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-card-name">{user.username}</div>
                <div className="user-card-stats">
                  {user.plans} plans • {user.followers} followers
                </div>
              </div>
            ))}
          </div>
        );

      case "followers":
        return (
          <div className="my-bio-users-grid">
            {MOCK_FOLLOWERS.map((user) => (
              <div
                key={user.id}
                className="user-card"
                onClick={() => handleUserClick(user.username)}
                style={{ cursor: 'pointer' }}
              >
                <div className="user-card-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-card-name">{user.username}</div>
                <div className="user-card-stats">
                  {user.plans} plans • {user.followers} followers
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  }, [activeTab, handleUserClick]);

  return (
    <div className="my-bio-menu">
      <div className="my-bio-tabs">
        <button
          className={`my-bio-tab ${activeTab === "about" ? "active" : ""}`}
          onClick={() => setActiveTab("about")}
        >
          About me
          <span className="my-bio-tab-badge">NEW</span>
        </button>
        <button
          className={`my-bio-tab ${activeTab === "plans" ? "active" : ""}`}
          onClick={() => setActiveTab("plans")}
        >
          Plans
        </button>
        <button
          className={`my-bio-tab ${activeTab === "saved" ? "active" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
        <button
          className={`my-bio-tab ${activeTab === "followings" ? "active" : ""}`}
          onClick={() => setActiveTab("followings")}
        >
          Followings
        </button>
        <button
          className={`my-bio-tab ${activeTab === "followers" ? "active" : ""}`}
          onClick={() => setActiveTab("followers")}
        >
          Followers
        </button>
      </div>

      <div className="my-bio-content">
        {activeTab === "about" && (
          <div className="my-bio-about-box">
            <div className="my-bio-about-title">About me</div>

            {isEditingBio ? (
              <>
                <textarea
                  className="my-bio-about-input"
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  placeholder="Write something about yourself..."
                  maxLength={500}
                  autoFocus
                />
                <div className="my-bio-about-actions">
                  <button className="my-bio-save-btn" onClick={handleSaveBio}>
                    Save
                  </button>
                  <button className="my-bio-cancel-btn" onClick={handleCancelBio}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="my-bio-about-text">
                  {bio || '"This is bio"'}
                </p>
                <button className="my-bio-edit-btn" onClick={handleEditBio}>
                  Edit
                </button>
              </>
            )}
          </div>
        )}

        <div>{renderContent}</div>
      </div>
    </div>
  );
}