import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import UserAvatar from "../components/profiles/UserAvatar";
import UserBioMenu from "../components/profiles/UserBioMenu";
import "./OtherUser.css";

// Mock user database
const MOCK_USERS = {
  john_doe: {
    username: "john_doe",
    bio: "Fitness enthusiast and plan creator. Love helping others achieve their goals!",
    avatar: null,
    stats: {
      followings: 25,
      followers: 340,
      plans: 12
    }
  },
  jane_smith: {
    username: "jane_smith",
    bio: "Language learner and teacher. Passionate about education!",
    avatar: null,
    stats: {
      followings: 30,
      followers: 230,
      plans: 15
    }
  },
  alex_dev: {
    username: "alex_dev",
    bio: "Full-stack developer. Building cool stuff every day.",
    avatar: null,
    stats: {
      followings: 40,
      followers: 180,
      plans: 12
    }
  },
  mike_wilson: {
    username: "mike_wilson",
    bio: "Entrepreneur and productivity enthusiast.",
    avatar: null,
    stats: {
      followings: 15,
      followers: 90,
      plans: 5
    }
  },
  sarah_jones: {
    username: "sarah_jones",
    bio: "Life coach and wellness expert.",
    avatar: null,
    stats: {
      followings: 50,
      followers: 450,
      plans: 20
    }
  },
  fitness_pro: {
    username: "fitness_pro",
    bio: "Professional fitness trainer. Let's get fit together!",
    avatar: null,
    stats: {
      followings: 20,
      followers: 340,
      plans: 12
    }
  },
  chef_master: {
    username: "chef_master",
    bio: "Culinary expert. Making cooking accessible for everyone.",
    avatar: null,
    stats: {
      followings: 35,
      followers: 890,
      plans: 25
    }
  },
  health_fan: {
    username: "health_fan",
    bio: "Health and wellness advocate.",
    avatar: null,
    stats: {
      followings: 12,
      followers: 120,
      plans: 7
    }
  },
  gym_buddy: {
    username: "gym_buddy",
    bio: "Gym enthusiast. Never skip leg day!",
    avatar: null,
    stats: {
      followings: 18,
      followers: 280,
      plans: 15
    }
  },
  yoga_life: {
    username: "yoga_life",
    bio: "Yoga instructor. Find your inner peace.",
    avatar: null,
    stats: {
      followings: 22,
      followers: 195,
      plans: 10
    }
  }
};

export default function OtherUser() {
  const { username } = useParams();

  // Get user data from mock database or use default
  const userData = MOCK_USERS[username] || {
    username: username || "unknown_user",
    bio: "No bio available",
    avatar: null,
    stats: {
      followings: 0,
      followers: 0,
      plans: 0
    }
  };

  const [isFollowing, setIsFollowing] = useState(false);
  const [stats, setStats] = useState(userData.stats);

  const handleFollowToggle = useCallback(() => {
    setIsFollowing(!isFollowing);
    // Update followers count when main user follows/unfollows
    setStats(prev => ({
      ...prev,
      followers: isFollowing ? prev.followers - 1 : prev.followers + 1
    }));
    // TODO: API call to follow/unfollow
    console.log(isFollowing ? "Unfollowed" : "Followed", userData.username);
  }, [isFollowing, userData.username]);

  const handleFollowChange = useCallback((userId, nowFollowing) => {
    // This would update your following count if you follow someone from their followers list
    // TODO: Update backend
    console.log("Follow state changed for user:", userId, nowFollowing);
  }, []);

  return (
    <div className="otheruser-page">
      <UserAvatar
        username={userData.username}
        stats={stats}
        avatar={userData.avatar}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
      />

      <UserBioMenu
        bio={userData.bio}
        stats={stats}
        onFollowChange={handleFollowChange}
      />
    </div>
  );
}