import React from "react";
import WeeklyChart from "../components/home/WeeklyChart";
import ToDo from "../components/home/ToDo";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-layout">
      {/* Top row */}
      <div className="home-top">
        <div className="welcome-text">
          Welcome back, user!
        </div>
      </div>

      {/* Content */}
      <div className="home-content">
        {/* Weekly chart */}
        <div className="weekly-card">
          <div className="weekly-title">
            Weekly Performance
          </div>
          <WeeklyChart />
        </div>

        {/* To-do list */}
        <div className="todo-card">
          <ToDo />
        </div>
      </div>
    </div>
  );
}
