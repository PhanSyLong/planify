// UserBioMenu.jsx (đã cập nhật: giữ mock plans, dùng API cho followings/followers, dùng UserCard)
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { followApi } from "../../api/follow"; // giả định path đúng
import UserCard from "../users/UserCard"; // dùng component bạn đã có

import "./UserBioMenu.css";

// Giữ mock cho Public Plans
const MOCK_USER_PUBLIC_PLANS = [
  { id: 1, title: "Morning Workout Routine", stages: 3, tasks: 9 },
  { id: 2, title: "Healthy Meal Prep", stages: 4, tasks: 12 },
  { id: 3, title: "Yoga for Beginners", stages: 5, tasks: 15 },
];

export default function UserBioMenu({ bio, stats, onFollowChange }) {
  const { id: profileId } = useParams(); // lấy từ URL nếu là /user/:id hoặc /profile/:id
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("public-plans");

  // Dữ liệu thật từ API
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch followers & followings khi tab được chọn
  useEffect(() => {
    if (!profileId || (activeTab !== "followers" && activeTab !== "followings")) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === "followers") {
          const res = await followApi.getFollowers(profileId);
          setFollowers(res?.data?.result || []);
        } else {
          const res = await followApi.getFollowings(profileId);
          setFollowings(res?.data?.result || []);
        }
      } catch (err) {
        setError("Không tải được danh sách");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, profileId]);

  const handleUserClick = useCallback((username) => {
    navigate(`/user/${username}`); // hoặc /profile/${username} tùy route của bạn
  }, [navigate]);

  // Callback từ UserCard khi follow/unfollow
  const handleFollowToggle = useCallback(
    (userId, newIsFollowing) => {
      onFollowChange?.(userId, newIsFollowing);
      // Có thể cập nhật stats nếu component cha cần
    },
    [onFollowChange]
  );

  const renderContent = useMemo(() => {
    if (loading) return <div className="user-empty-state">Đang tải...</div>;
    if (error) return <div className="user-empty-state">{error}</div>;

    switch (activeTab) {
      case "public-plans":
        return MOCK_USER_PUBLIC_PLANS.length > 0 ? (
          <div className="user-content-grid">
            {MOCK_USER_PUBLIC_PLANS.map((plan) => (
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
            <p>No public plans yet</p>
            <span>This user hasn't published any plans</span>
          </div>
        );

      case "followings":
        return followings.length > 0 ? (
          <div className="user-content-grid">
            {followings.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onFollowToggle={handleFollowToggle}
                // Nếu UserCard cần onUserClick, truyền thêm
                // onUserClick={() => handleUserClick(user.username)}
              />
            ))}
          </div>
        ) : (
          <div className="user-empty-state">
            <p>Chưa theo dõi ai</p>
            <span>Người dùng này chưa follow ai</span>
          </div>
        );

      case "followers":
        return followers.length > 0 ? (
          <div className="user-content-grid">
            {followers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onFollowToggle={handleFollowToggle}
              />
            ))}
          </div>
        ) : (
          <div className="user-empty-state">
            <p>Chưa có người theo dõi</p>
            <span>Người dùng này chưa có follower</span>
          </div>
        );

      default:
        return null;
    }
  }, [activeTab, loading, error, followers, followings, handleFollowToggle]);

  return (
    <div className="user-bio-menu-container">
      <div className="user-content-section">
        <div className="user-content-tabs">
          <button
            className={`user-content-tab ${activeTab === "public-plans" ? "active" : ""}`}
            onClick={() => setActiveTab("public-plans")}
          >
            Public Plans
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