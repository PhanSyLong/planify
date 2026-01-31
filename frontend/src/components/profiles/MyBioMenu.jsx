// src/components/profiles/MyBioMenu.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { followApi } from "../../api/follow";
import UserCard from "../users/UserCard";

import "./MyBioMenu.css";

// Giữ mock data cho Public Plans
const MOCK_PUBLIC_PLANS = [
];

export default function MyBioMenu({ bio, stats, onStatsChange, userId }) {
  const [activeTab, setActiveTab] = useState("public-plans");

  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch chỉ khi có userId thật và tab phù hợp
  useEffect(() => {
    if (!userId || (activeTab !== "followers" && activeTab !== "followings")) {
      return;
    }

    const fetchList = async () => {
      setLoading(true);
      setError(null);

      try {
        let res;
        if (activeTab === "followers") {
          res = await followApi.getFollowers(userId);
          setFollowers(res?.data?.result || []);
        } else if (activeTab === "followings") {
          res = await followApi.getFollowings(userId);
          setFollowings(res?.data?.result || []);
        }
      } catch (err) {
        console.error(`Lỗi tải ${activeTab}:`, err);
        console.error("Response error:", err.response?.data);
        setError(
          `Không tải được danh sách ${
            activeTab === "followers" ? "người theo dõi" : "đang theo dõi"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [activeTab, userId]);

  const handleFollowToggle = useCallback(
    (userId, newIsFollowing) => {
      if (activeTab === "followers") {
        onStatsChange?.((prev) => ({
          ...prev,
          followers: newIsFollowing
            ? prev.followers + 1
            : Math.max(0, prev.followers - 1),
        }));
      }
      // Nếu cần cập nhật followings của chính mình thì thêm logic ở đây
    },
    [activeTab, onStatsChange]
  );

  const renderContent = useMemo(() => {
    if (loading && (activeTab === "followers" || activeTab === "followings")) {
      return <div className="my-empty-state">Đang tải...</div>;
    }

    if (error && (activeTab === "followers" || activeTab === "followings")) {
      return <div className="my-empty-state error">{error}</div>;
    }

    switch (activeTab) {
      case "public-plans":
        return MOCK_PUBLIC_PLANS.length > 0 ? (
          <div className="my-content-grid">
            {MOCK_PUBLIC_PLANS.map((plan) => (
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
            <p>No public plans yet</p>
            <span>Create and publish plans to showcase them here</span>
          </div>
        );

      case "followings":
        return followings.length > 0 ? (
          <div className="my-content-grid">
            {followings.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onFollowToggle={handleFollowToggle}
              />
            ))}
          </div>
        ) : (
          <div className="my-empty-state">
            <p>Chưa theo dõi ai</p>
            <span>Khám phá và theo dõi người dùng khác</span>
          </div>
        );

      case "followers":
        return followers.length > 0 ? (
          <div className="my-content-grid">
            {followers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onFollowToggle={handleFollowToggle}
              />
            ))}
          </div>
        ) : (
          <div className="my-empty-state">
            <p>Chưa có người theo dõi</p>
            <span>Chia sẻ profile để có thêm follower</span>
          </div>
        );

      default:
        return null;
    }
  }, [activeTab, loading, error, followers, followings, handleFollowToggle]);

  return (
    <div className="my-bio-menu-container">
      <div className="my-content-section">
        <div className="my-content-tabs">
          <button
            className={`my-content-tab ${activeTab === "public-plans" ? "active" : ""}`}
            onClick={() => setActiveTab("public-plans")}
          >
            Public Plans
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