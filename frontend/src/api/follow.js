// src/api/follow.js
import httpAuth from "./httpAuth";
import { authApi } from "./auth";

// Cache toàn cục (trong session): Set chứa các user ID mà current user đang follow
let followingCache = null; // null = chưa load, Set = đã load

export const followApi = {
  // POST /users/{targetId}/follow
  follow: async (targetId) => {
    const res = await httpAuth.post(`/users/${targetId}/follow`);
    if (followingCache instanceof Set) {
      followingCache.add(Number(targetId));
    }
    return res;
  },

  // DELETE /users/{targetId}/unfollow
  unfollow: async (targetId) => {
    const res = await httpAuth.delete(`/users/${targetId}/unfollow`);
    if (followingCache instanceof Set) {
      followingCache.delete(Number(targetId));
    }
    return res;
  },

  // GET /users/{id}/followers
  getFollowers: (id) => httpAuth.get(`/users/${id}/followers`),

  // GET /users/{id}/followings
  getFollowings: (id) => httpAuth.get(`/users/${id}/followings`),

  // Ưu tiên dùng hàm này để check trạng thái follow (dùng cache nếu có)
  getIsFollowing: async (targetId) => {
    if (!targetId) return false;
    targetId = Number(targetId);

    // Cache đã load → trả về ngay (nhanh nhất)
    if (followingCache instanceof Set) {
      return followingCache.has(targetId);
    }

    // Cache chưa có → load followings của mình
    try {
      const meRes = await authApi.me();
      const myId = meRes?.data?.result?.id;

      if (!myId) {
        console.warn("Không lấy được myId");
        return false;
      }

      const res = await httpAuth.get(`/users/${myId}/followings`);
      const followings = res?.data?.result || [];

      followingCache = new Set(
        followings.map((u) => Number(u.id || u.userId || 0))
      );

      return followingCache.has(targetId);
    } catch (err) {
      console.error("Lỗi khi load followings để check:", err);
      return false;
    }
  },

  // Giữ lại cho tương thích (nếu code cũ vẫn gọi)
  isFollowing: async (targetId) => {
    console.warn("isFollowing deprecated → dùng getIsFollowing thay thế");
    return followApi.getIsFollowing(targetId);
  },

  // Gọi khi logout để clear cache
  clearFollowingCache: () => {
    followingCache = null;
  },
};