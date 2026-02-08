// src/components/profiles/MyBioMenu.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { followApi } from "../../api/follow";
import UserCard from "../users/UserCard";
import PlanCard from "../plans/PlanCard"; // ← Đảm bảo đường dẫn đúng với dự án của bạn
import { usePlans } from "../../queries/usePlans";

import "./MyBioMenu.css";

export default function MyBioMenu({ bio, stats, onStatsChange, userId }) {
  const [activeTab, setActiveTab] = useState("public-plans");

  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { data: plans = [], isLoading: isLoadingPlans } = usePlans();

  const publicPlans = useMemo(() => {
    if (isLoadingPlans || !plans?.length) return [];

    return plans.filter(
      (plan) => plan.ownerId === Number(userId) && plan.visibility === "public"
    );
  }, [plans, isLoadingPlans, userId]);

  // Fetch followers / followings chỉ khi cần
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
      // Nếu cần cập nhật followings của chính mình → thêm logic tương tự
    },
    [activeTab, onStatsChange]
  );

  const renderContent = useMemo(() => {
    // Loading & error cho followers/followings
    if (loading && (activeTab === "followers" || activeTab === "followings")) {
      return <div className="my-empty-state">Đang tải...</div>;
    }

    if (error && (activeTab === "followers" || activeTab === "followings")) {
      return <div className="my-empty-state error">{error}</div>;
    }

    switch (activeTab) {
      case "public-plans":
        if (isLoadingPlans) {
          return <div className="my-empty-state">Đang tải kế hoạch...</div>;
        }

        if (publicPlans.length === 0) {
          return (
            <div className="my-empty-state">
              <p>Chưa có kế hoạch công khai nào</p>
              <span>Tạo và công bố kế hoạch để hiển thị tại đây</span>
            </div>
          );
        }

        return (
          <div className="my-content-grid public-plans-grid">
            {publicPlans.map((plan) => (
              <PlanCard key={plan.id} item={plan} />
            ))}
          </div>
        );

      case "followings":
        if (followings.length === 0) {
          return (
            <div className="my-empty-state">
              <p>Chưa theo dõi ai</p>
              <span>Khám phá và theo dõi người dùng khác</span>
            </div>
          );
        }
        return (
          <div className="my-content-grid">
            {followings.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onFollowToggle={handleFollowToggle}
              />
            ))}
          </div>
        );

      case "followers":
        if (followers.length === 0) {
          return (
            <div className="my-empty-state">
              <p>Chưa có người theo dõi</p>
              <span>Chia sẻ profile để có thêm follower</span>
            </div>
          );
        }
        return (
          <div className="my-content-grid">
            {followers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onFollowToggle={handleFollowToggle}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  }, [
    activeTab,
    loading,
    error,
    followers,
    followings,
    publicPlans,
    isLoadingPlans,
    handleFollowToggle,
  ]);

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