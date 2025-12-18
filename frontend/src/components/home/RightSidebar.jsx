import React from "react";
import Calendar from "./Calendar";
import TodayPieChart from "./TodayPieChart";

export default function RightSidebar() {
  return (
    <>
      <style>{`
        .right-sidebar {
          position: fixed;
          top: 70px;                 /* Adjust if your header height changes */
          right: 0;
          width: 300px;
          height: calc(100vh - 70px); /* Full height minus header */
          background-color: #e0e0e0;
          padding: 15px;
          overflow-y: hidden;        /* Fixed, unscrollable */
        }

        .today-performance {
          margin-top: 20px;
        }

        /* Optional: styling for sections inside the sidebar */
        .calendar-section {
          margin-bottom: 20px;
        }

        .pie-chart-label {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
          text-align: center;
        }
      `}</style>

      <div className="right-sidebar">
        <div className="calendar-section">
          <Calendar />
        </div>

        <div className="today-performance">
          <div className="pie-chart-label">Today's Performance</div>
          <TodayPieChart />
        </div>
      </div>
    </>
  );
}