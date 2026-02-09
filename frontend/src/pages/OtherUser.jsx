import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserAvatar from "../components/profiles/UserAvatar";
import UserBioMenu from "../components/profiles/UserBioMenu";
import { usersApi } from "../api/users";
import "./OtherUser.css";

export default function OtherUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await usersApi.getById(id);
        setUser(res.data.result);
      } catch (err) {
        if (err.response?.status === 401) {
          alert("Phiên đăng nhập hết hạn");
          navigate("/");
          return;
        }
        setError("Không tải được thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, navigate]);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return null;

  return (
    <div className="otheruser-page">
      <UserAvatar
        userId={id}
        username={user.username}
        email={user.email}
        avatar={user.avatar}
        initialIsFollowing={user.isFollowing || false}
        isOwnProfile={false}
      />

      <UserBioMenu
        bio={user.bio || "No bio available"}
        // onFollowChange nếu bạn muốn xử lý gì thêm khi follow/unfollow
        // onFollowChange={(userId, isFollowing) => console.log(userId, isFollowing)}
      />
    </div>
  );
}