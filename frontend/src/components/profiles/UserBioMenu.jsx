import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./UserBioMenu.css";

const MOCK_USER_PLANS = [
  { id: 1, title: "Morning Workout Routine", stages: 3, tasks: 9 },
  { id: 2, title: "Healthy Meal Prep", stages: 4, tasks: 12 },
  { id: 3, title: "Yoga for Beginners", stages: 5, tasks: 15 },
];

const MOCK_USER_SAVED = [
  { id: 4, title: "Advanced JavaScript", stages: 8, tasks: 32 },
];

const MOCK_USER_FOLLOWINGS = [
  { id: 1, username: "fitness_pro", plans: 12, followers: 340 },
  { id: 2, username: "chef_master", plans: 25, followers: 890 },
];

const MOCK_USER_FOLLOWERS = [
  { id: 3, username: "health_fan", plans: 7, followers: 120 },
  { id: 4, username: "gym_buddy", plans: 15, followers: 280 },
  { id: 5, username: "yoga_life", plans: 10, followers: 195 },
];

function UserFollowerCard({ user, isFollowing, onFollowToggle, onUserClick }) {
  return (
    <div className="user-follower-card">
      <div
        className="user-follower-card-avatar user-follower-card-clickable"
        onClick={() => onUserClick(user.username)}
      >
        {user.username.charAt(0).toUpperCase()}
      </div>
      <div
        className="user-follower-card-info user-follower-card-clickable"
        onClick={() => onUserClick(user.username)}
      >
        <div className="user-follower-card-name">{user.username}</div>
        <div className="user-follower-card-stats">
          {user.plans} plans • {user.followers} followers
        </div>
      </div>
      <button
        className={`user-follower-follow-btn ${isFollowing ? "following" : ""}`}
        onClick={() => onFollowToggle(user.id)}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}

export default function UserBioMenu({ bio, stats, onFollowChange }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("plans");

  // Track follow state for all users in followings and followers
  const [followStates, setFollowStates] = useState({
    // Initialize followings as followed
    ...Object.fromEntries(MOCK_USER_FOLLOWINGS.map(u => [u.id, true])),
    // Initialize followers as not followed
    ...Object.fromEntries(MOCK_USER_FOLLOWERS.map(u => [u.id, false]))
  });

  const handleFollowToggle = useCallback((userId) => {
    setFollowStates(prev => {
      const newState = !prev[userId];

      // Notify parent component about follow change
      onFollowChange?.(userId, newState);

      // TODO: API call to follow/unfollow user
      console.log(newState ? "Followed" : "Unfollowed", "user:", userId);

      return { ...prev, [userId]: newState };
    });
  }, [onFollowChange]);

  const handleUserClick = useCallback((username) => {
    navigate(`/user/${username}`);
  }, [navigate]);

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "plans":
        return MOCK_USER_PLANS.length > 0 ? (
          <div className="user-content-grid">
            {MOCK_USER_PLANS.map((plan) => (
              <div key={plan.id} className="user-plan-card">
                <div className="user-plan-card-image">📋</div>
                <div className="user-plan-card-content">
                  <div className="user-plan-card-title">{plan.title}</div>
                  <div className="user-plan-card-meta">
                    {plan.stages} stages • {plan.tasks} tasks
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="user-empty-state">
            <p>No plans yet</p>
            <span>This user hasn't created any plans</span>
          </div>
        );

      case "saved":
        return MOCK_USER_SAVED.length > 0 ? (
          <div className="user-content-grid">
            {MOCK_USER_SAVED.map((plan) => (
              <div key={plan.id} className="user-plan-card">
                <div className="user-plan-card-image">📋</div>
                <div className="user-plan-card-content">
                  <div className="user-plan-card-title">{plan.title}</div>
                  <div className="user-plan-card-meta">
                    {plan.stages} stages • {plan.tasks} tasks
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="user-empty-state">
            <p>No saved plans</p>
          </div>
        );

      case "followings":
        return (
          <div className="user-content-grid">
            {MOCK_USER_FOLLOWINGS.map((user) => (
              <UserFollowerCard
                key={user.id}
                user={user}
                isFollowing={followStates[user.id]}
                onFollowToggle={handleFollowToggle}
                onUserClick={handleUserClick}
              />
            ))}
          </div>
        );

      case "followers":
        return (
          <div className="user-content-grid">
            {MOCK_USER_FOLLOWERS.map((user) => (
              <UserFollowerCard
                key={user.id}
                user={user}
                isFollowing={followStates[user.id]}
                onFollowToggle={handleFollowToggle}
                onUserClick={handleUserClick}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  }, [activeTab, followStates, handleFollowToggle, handleUserClick]);

  return (
    <div className="user-bio-menu-container">
      <div className="user-bio-section">
        <div className="user-bio-box">
          <div className="user-bio-title">About</div>
          <p className="user-bio-text">{bio || "No bio yet"}</p>
        </div>
      </div>

      <div className="user-content-section">
        <div className="user-content-tabs">
          <button
            className={`user-content-tab ${activeTab === "plans" ? "active" : ""}`}
            onClick={() => setActiveTab("plans")}
          >
            Plans
          </button>
          <button
            className={`user-content-tab ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            Saved
          </button>
          <button
            className={`user-content-tab ${activeTab === "followings" ? "active" : ""}`}
            onClick={() => setActiveTab("followings")}
          >
            Followings
          </button>
          <button
            className={`user-content-tab ${activeTab === "followers" ? "active" : ""}`}
            onClick={() => setActiveTab("followers")}
          >
            Followers
          </button>
        </div>
        <div className="user-content-area">{renderContent}</div>
      </div>
    </div>
  );
}