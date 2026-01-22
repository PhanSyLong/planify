import UserAvatar from "../components/profiles/UserAvatar";
import UserBioMenu from "../components/profiles/UserBioMenu";
import "./OtherUser.css";

// Mock other user data
const MOCK_USER = {
  username: "john_doe",
  bio: "Fitness enthusiast and plan creator. Love helping others achieve their goals!",
  avatar: null,
  stats: {
    followings: 25,
    followers: 340,
    plans: 12
  }
};

export default function OtherUser() {
  return (
    <div className="otheruser-page">
      <UserAvatar
        username={MOCK_USER.username}
        stats={MOCK_USER.stats}
        avatar={MOCK_USER.avatar}
      />

      <UserBioMenu
        bio={MOCK_USER.bio}
      />
    </div>
  );
}