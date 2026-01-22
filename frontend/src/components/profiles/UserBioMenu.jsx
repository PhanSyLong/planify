import { useState, useMemo } from "react";
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

function UserFollowerCard({ user }) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="user-follower-card">
      <div className="user-follower-avatar">
        {user.username.charAt(0).toUpperCase()}
      </div>
      <div className="user-follower-info">
        <div className="user-follower-name">{user.username}</div>
        <div className="user-follower-stats">
          {user.plans} plans • {user.followers} followers
        </div>
      </div>
      <button
        className={`user-follower-follow-btn ${isFollowing ? "following" : ""}`}
        onClick={() => setIsFollowing(!isFollowing)}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}

export default function UserBioMenu({ bio }) {
  const [activeTab, setActiveTab] = useState("about");

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "about":
        return null;

      case "plans":
        return MOCK_USER_PLANS.length > 0 ? (
          <div className="user-bio-grid">
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
          <div className="user-bio-empty">
            <p>No plans yet</p>
            <span>This user hasn't created any plans</span>
          </div>
        );

      case "saved":
        return MOCK_USER_SAVED.length > 0 ? (
          <div className="user-bio-grid">
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
          <div className="user-bio-empty">
            <p>No saved plans</p>
          </div>
        );

      case "followings":
        return (
          <div className="user-bio-users-grid">
            {MOCK_USER_FOLLOWINGS.map((user) => (
              <UserFollowerCard key={user.id} user={user} />
            ))}
          </div>
        );

      case "followers":
        return (
          <div className="user-bio-users-grid">
            {MOCK_USER_FOLLOWERS.map((user) => (
              <UserFollowerCard key={user.id} user={user} />
            ))}
          </div>
        );

      default:
        return null;
    }
  }, [activeTab]);

  return (
    <div className="user-bio-menu">
      <div className="user-bio-tabs">
        <button
          className={`user-bio-tab ${activeTab === "about" ? "active" : ""}`}
          onClick={() => setActiveTab("about")}
        >
          About me
        </button>
        <button
          className={`user-bio-tab ${activeTab === "plans" ? "active" : ""}`}
          onClick={() => setActiveTab("plans")}
        >
          Plans
        </button>
        <button
          className={`user-bio-tab ${activeTab === "saved" ? "active" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
        <button
          className={`user-bio-tab ${activeTab === "followings" ? "active" : ""}`}
          onClick={() => setActiveTab("followings")}
        >
          Followings
        </button>
        <button
          className={`user-bio-tab ${activeTab === "followers" ? "active" : ""}`}
          onClick={() => setActiveTab("followers")}
        >
          Followers
        </button>
      </div>

      <div className="user-bio-content">
        {activeTab === "about" && (
          <div className="user-bio-about-box">
            <div className="user-bio-about-title">About me</div>
            <p className="user-bio-about-text">
              {bio || "No bio yet"}
            </p>
          </div>
        )}

        <div>{renderContent}</div>
      </div>
    </div>
  );
}