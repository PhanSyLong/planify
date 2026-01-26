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

export default function MyBioMenu({ bio, onBioChange, stats, onStatsChange }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("plans");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState(bio);

  // Track follow state for followings (starts as all followed)
  const [followingStates, setFollowingStates] = useState(
    Object.fromEntries(MOCK_FOLLOWINGS.map(u => [u.id, true]))
  );

  // Track followers list
  const [followers, setFollowers] = useState(MOCK_FOLLOWERS);

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

  const handleToggleFollow = useCallback((userId) => {
    setFollowingStates(prev => {
      const newState = !prev[userId];
      const wasFollowing = prev[userId];

      // Update followings count
      if (wasFollowing && !newState) {
        // Unfollowing
        onStatsChange?.({ ...stats, followings: stats.followings - 1 });
      } else if (!wasFollowing && newState) {
        // Following again
        onStatsChange?.({ ...stats, followings: stats.followings + 1 });
      }

      return { ...prev, [userId]: newState };
    });

    // TODO: API call to follow/unfollow user
    console.log("Toggled follow for user:", userId);
  }, [stats, onStatsChange]);

  const handleRemoveFollower = useCallback((userId) => {
    setFollowers(prev => prev.filter(f => f.id !== userId));
    onStatsChange?.({ ...stats, followers: stats.followers - 1 });

    // TODO: API call to remove follower
    console.log("Removed follower:", userId);
  }, [stats, onStatsChange]);

  const handleUserClick = useCallback((username) => {
    navigate(`/profile/${username}`);
  }, [navigate]);

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "plans":
        return MOCK_PLANS.length > 0 ? (
          <div className="my-content-grid">
            {MOCK_PLANS.map((plan) => (
              <div key={plan.id} className="my-plan-card">
                <div className="my-plan-card-image">📋</div>
                <div className="my-plan-card-content">
                  <div className="my-plan-card-title">{plan.title}</div>
                  <div className="my-plan-card-meta">
                    {plan.stages} stages • {plan.tasks} tasks
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="my-empty-state">
            <p>No plans yet</p>
            <span>Start creating plans to see them here</span>
          </div>
        );

      case "saved":
        return MOCK_SAVED.length > 0 ? (
          <div className="my-content-grid">
            {MOCK_SAVED.map((plan) => (
              <div key={plan.id} className="my-plan-card">
                <div className="my-plan-card-image">📋</div>
                <div className="my-plan-card-content">
                  <div className="my-plan-card-title">{plan.title}</div>
                  <div className="my-plan-card-meta">
                    {plan.stages} stages • {plan.tasks} tasks
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="my-empty-state">
            <p>No saved plans</p>
            <span>Save plans to see them here</span>
          </div>
        );

      case "followings":
        return (
          <div className="my-content-grid">
            {MOCK_FOLLOWINGS.map((user) => (
              <div key={user.id} className="my-user-card">
                <div
                  className="my-user-card-avatar my-user-card-clickable"
                  onClick={() => handleUserClick(user.username)}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div
                  className="my-user-card-info my-user-card-clickable"
                  onClick={() => handleUserClick(user.username)}
                >
                  <div className="my-user-card-name">{user.username}</div>
                  <div className="my-user-card-stats">
                    {user.plans} plans • {user.followers} followers
                  </div>
                </div>
                <button
                  className={`my-user-unfollow-btn ${!followingStates[user.id] ? 'my-user-follow-btn' : ''}`}
                  onClick={() => handleToggleFollow(user.id)}
                >
                  {followingStates[user.id] ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        );

      case "followers":
        return (
          <div className="my-content-grid">
            {followers.map((user) => (
              <div key={user.id} className="my-user-card">
                <div
                  className="my-user-card-avatar my-user-card-clickable"
                  onClick={() => handleUserClick(user.username)}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div
                  className="my-user-card-info my-user-card-clickable"
                  onClick={() => handleUserClick(user.username)}
                >
                  <div className="my-user-card-name">{user.username}</div>
                  <div className="my-user-card-stats">
                    {user.plans} plans • {user.followers} followers
                  </div>
                </div>
                <button
                  className="my-user-remove-btn"
                  onClick={() => handleRemoveFollower(user.id)}
                  title="Remove follower"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  }, [activeTab, followingStates, followers, handleToggleFollow, handleRemoveFollower, handleUserClick]);

  return (
    <div className="my-bio-menu-container">
      <div className="my-bio-section">
        <div className="my-bio-box">
          <div className="my-bio-title">About me</div>
          {isEditingBio ? (
            <>
              <textarea
                className="my-bio-input"
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                placeholder="Write something about yourself..."
                maxLength={500}
                autoFocus
              />
              <div className="my-bio-actions">
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
              <p className="my-bio-text">{bio || "No bio yet"}</p>
              <button className="my-bio-edit-btn" onClick={handleEditBio}>
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      <div className="my-content-section">
        <div className="my-content-tabs">
          <button
            className={`my-content-tab ${activeTab === "plans" ? "active" : ""}`}
            onClick={() => setActiveTab("plans")}
          >
            Plans
          </button>
          <button
            className={`my-content-tab ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            Saved
          </button>
          <button
            className={`my-content-tab ${activeTab === "followings" ? "active" : ""}`}
            onClick={() => setActiveTab("followings")}
          >
            Followings
          </button>
          <button
            className={`my-content-tab ${activeTab === "followers" ? "active" : ""}`}
            onClick={() => setActiveTab("followers")}
          >
            Followers
          </button>
        </div>
        <div className="my-content-area">{renderContent}</div>
      </div>
    </div>
  );
}