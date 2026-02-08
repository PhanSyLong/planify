// src/components/profiles/UserBioMenu.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { followApi } from "../../api/follow";
import UserCard from "../users/UserCard";
import PlanCard from "../plans/PlanCard";          // ← import PlanCard
import { usePlans } from "../../queries/usePlans"; // ← giả định bạn có hook này

import "./UserBioMenu.css";

export default function UserBioMenu({ bio, stats, onFollowChange }) {
  const { id: profileId } = useParams(); // profileId từ URL: /user/:id hoặc /profile/:id
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("public-plans");

  // Dữ liệu followers & followings từ API
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy tất cả plans (giả định usePlans trả về plans của toàn hệ thống hoặc có thể filter)
  const { data: plans = [], isLoading: isLoadingPlans } = usePlans();

  // Lọc public plans của user này
  const publicPlans = useMemo(() => {
    if (isLoadingPlans || !plans?.length || !profileId) return [];

    return plans.filter(
      (plan) =>
        plan.ownerId === Number(profileId) && plan.visibility === "public"
    );
  }, [plans, isLoadingPlans, profileId]);

  // Fetch followers / followings khi tab thay đổi
  useEffect(() => {
    if (!profileId || (activeTab !== "followers" && activeTab !== "followings")) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;
        if (activeTab === "followers") {
          res = await followApi.getFollowers(profileId);
          setFollowers(res?.data?.result || []);
        } else {
          res = await followApi.getFollowings(profileId);
          setFollowings(res?.data?.result || []);
        }
      } catch (err) {
        console.error("Lỗi tải danh sách follow:", err);
        setError("Không tải được danh sách");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, profileId]);

  const handleFollowToggle = useCallback(
    (userId, newIsFollowing) => {
      onFollowChange?.(userId, newIsFollowing);
      // Nếu cần cập nhật local state followers/followings thì thêm logic ở đây
    },
    [onFollowChange]
  );

  const renderContent = useMemo(() => {
    // Loading & error chung cho followers/followings
    if (loading && (activeTab === "followers" || activeTab === "followings")) {
      return <div className="user-empty-state">Đang tải...</div>;
    }
    if (error && (activeTab === "followers" || activeTab === "followings")) {
      return <div className="user-empty-state error">{error}</div>;
    }

    switch (activeTab) {
      case "public-plans":
        if (isLoadingPlans) {
          return <div className="user-empty-state">Đang tải kế hoạch...</div>;
        }

        if (publicPlans.length === 0) {
          return (
            <div className="user-empty-state">
              <p>Chưa có kế hoạch công khai nào</p>
              <span>Người dùng này chưa công bố kế hoạch nào</span>
            </div>
          );
        }

        return (
          <div className="user-content-grid public-plans-grid">
            {publicPlans.map((plan) => (
              <PlanCard key={plan.id} item={plan} />
            ))}
          </div>
        );

      case "followings":
        if (followings.length === 0) {
          return (
            <div className="user-empty-state">
              <p>Chưa theo dõi ai</p>
              <span>Người dùng này chưa follow bất kỳ ai</span>
            </div>
          );
        }
        return (
          <div className="user-content-grid">
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
            <div className="user-empty-state">
              <p>Chưa có người theo dõi</p>
              <span>Người dùng này chưa có follower nào</span>
            </div>
          );
        }
        return (
          <div className="user-content-grid">
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