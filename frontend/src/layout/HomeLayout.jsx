import React from "react";
import RightSidebar from "../components/home/RightSidebar";
import WeeklyChart from "../components/home/WeeklyChart";
import TodayToDoList from "../components/home/TodayToDoList";

export default function HomeLayout({ children }) {
  return (
    <>
      <style>{`
        .home-layout {
          display: flex;
          width: 100%;
          height: 100vh;
          margin: 0;
          padding: 0;
        }

        /* Main content (WeeklyChart area) */
        .home-content {
          flex: 1;                /* take remaining space */
          margin: 0;
          padding: 20px;          /* optional inner spacing */
          overflow-y: auto;
          box-sizing: border-box;
        }

        /* Right sidebar wrapper */
        .right-sidebar {
          width: 300px;           /* fixed sidebar width */
          box-sizing: border-box;
        }
      `}</style>

      <div className="home-layout">
        <div className="home-content">
          <WeeklyChart />
          <TodayToDoList />
        </div>

        <div className="right-sidebar">
          <RightSidebar />
        </div>
      </div>
    </>
  );
}