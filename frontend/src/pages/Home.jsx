import React from "react";
import WeeklyChart from "../components/home/WeeklyChart";
import "./Home.css";

export default function HomeLayout() {
  return (
    <div className="home-layout">
      {/* Top row */}
      <div className="home-top">
        <div className="welcome-text">Welcome back, user!</div>
      </div>

      {/* Content */}
      <div className="home-content">
        <div className="weekly-card">
          <div className="weekly-title">Weekly Performance</div>
          <WeeklyChart />
        </div>
      </div>
    </div>
  );
}
