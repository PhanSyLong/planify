import React, { useState, useEffect } from "react";
import WeeklyChart from "../components/home/WeeklyChart";
import ToDo from "../components/home/ToDo";
import "./Home.css";
import { authApi } from "../api/auth";

export default function Home() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
      const fetchCurrentUser = async () => {
        try {
          const response = await authApi.me();
          const userData = response?.data?.result;
          if (userData?.username) {
            setUserName(userData.username);
          }
        } catch (error) {
          console.error("Failed to fetch current user:", error);
        }
      };
  
      fetchCurrentUser();
    }, []);
  return (
    <div className="home-layout">
      {/* Top row */}
      <div className="home-top">
        <div className="welcome-text">
          Welcome back, {userName}!
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
