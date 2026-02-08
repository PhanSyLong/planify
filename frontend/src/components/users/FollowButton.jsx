// src/components/FollowButton.jsx
import { useState, useEffect } from "react";
import { followApi } from "../../api/follow";
import "./FollowButton.css";

function getNormalizedInitial(val) {
  if (val === true || val === "true" || val === 1 || val === "1") return true;
  if (val === false || val === "false" || val === 0 || val === "0") return false;
  return null;
}

export default function FollowButton({
  userId,
  initialIsFollowing,
  size = "default",
  className = "",
  onToggle,
  disabled = false,
}) {
  const normalizedInitial = getNormalizedInitial(initialIsFollowing);

  const [isFollowing, setIsFollowing] = useState(normalizedInitial);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setIsFollowing(false);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadFollowStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const following = await followApi.getIsFollowing(userId);
        if (isMounted) {
          setIsFollowing(following);
        }
      } catch (err) {
        console.error("Failed to load follow status:", err);
        if (isMounted) {
          setError("Không tải được trạng thái follow");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Nếu có initial đáng tin cậy → dùng trước, nhưng vẫn verify bằng cache sau
    if (normalizedInitial !== null) {
      setIsFollowing(normalizedInitial);
      setIsLoading(false);
      // Vẫn verify lại bằng cache để chắc chắn (non-blocking)
      followApi.getIsFollowing(userId).then((realStatus) => {
        if (isMounted) setIsFollowing(realStatus);
      });
    } else {
      loadFollowStatus();
    }

    return () => {
      isMounted = false;
    };
  }, [userId, normalizedInitial]);

  const handleToggle = async () => {
    if (disabled || isLoading || !userId || error) return;

    const prevFollowing = isFollowing;
    setIsFollowing(!prevFollowing);
    setError(null);

    try {
      if (prevFollowing) {
        await followApi.unfollow(userId);
        onToggle?.(false);
      } else {
        await followApi.follow(userId);
        onToggle?.(true);
      }
    } catch (err) {
      console.error("Follow/Unfollow failed:", err);
      setIsFollowing(prevFollowing);
      setError(err?.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  let buttonText = "Follow";
  let buttonClassModifier = "";

  if (isLoading) {
    buttonText = "Đang tải...";
    buttonClassModifier = "loading";
  } else if (error) {
    buttonText = "Lỗi";
    buttonClassModifier = "error";
  } else if (isFollowing) {
    buttonText = "Following";
    buttonClassModifier = "following";
  }

  return (
    <button
      type="button"
      className={`follow-button ${buttonClassModifier} ${size} ${className}`}
      onClick={handleToggle}
      disabled={disabled || isLoading || !!error}
    >
      {buttonText}
    </button>
  );
}