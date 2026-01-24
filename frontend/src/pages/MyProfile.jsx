import { useState, useCallback } from "react";
import MyAvatar from "../components/profiles/MyAvatar";
import MyBioMenu from "../components/profiles/MyBioMenu";
import "./MyProfile.css";

export default function MyProfile() {
  const [avatar, setAvatar] = useState(null);
  const [bio, setBio] = useState("Passionate developer and fitness enthusiast. Love creating useful apps!");
  const [stats, setStats] = useState({
    followings: 15,
    followers: 5,
    plans: 12
  });

  const handleAvatarChange = useCallback((newAvatar) => {
    setAvatar(newAvatar);
    // TODO: Upload to backend
    console.log("Avatar changed");
  }, []);

  const handleBioChange = useCallback((newBio) => {
    setBio(newBio);
    // TODO: Save to backend
    console.log("Bio updated:", newBio);
  }, []);

  const handleStatsChange = useCallback((newStats) => {
    setStats(newStats);
    // TODO: Update stats in backend
    console.log("Stats updated:", newStats);
  }, []);

  return (
    <div className="myprofile-page">
      <MyAvatar
        username="Choi1505"
        stats={stats}
        avatar={avatar}
        onAvatarChange={handleAvatarChange}
      />

      <MyBioMenu
        bio={bio}
        onBioChange={handleBioChange}
        stats={stats}
        onStatsChange={handleStatsChange}
      />
    </div>
  );
}