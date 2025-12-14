import React from "react";
import StatusDropdown from "../buttons/StatusDropdown";

const plans = [
  {
    id: 1,
    title: "Plan 1",
    tasks: [
      "Finish task 1",
      "Review notes",
      "Complete subtask A",
    ],
  },
  {
    id: 2,
    title: "Plan 2",
    tasks: [
      "Start project outline",
      "Do research",
      "Prepare presentation",
    ],
  },
];

const TodayToDoList = () => {
  return (
    <>
      <style>{`
        /* Wrapper */
        .today-todo-wrapper {
          width: 800px;
          border-radius: 16px;
          overflow: hidden;
          background-color: transparent;
        }

        /* Header (dark) */
        .today-todo-header {
          background-color: #153677;
          padding: 16px 20px;
        }

        .today-todo-header h2 {
          margin: 0;
          color: #ffffff;
          font-size: 18px;
          font-weight: 600;
        }

        /* Plan card (white) */
        .today-plan-card {
          background-color: #ffffff;
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
        }

        .today-plan-card h3 {
          margin: 0 0 12px;
          font-size: 15px;
          font-weight: 600;
          color: #002765;
        }

        /* Todo list reset */
        .today-todo-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        /* Each todo item */
        .todo-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 8px 0;
        }

        /* Todo text (LEFT) */
        .todo-text {
          flex: 1;
          font-size: 14px;
          color: #333;
          line-height: 1.4;
        }

        /* Status dropdown (RIGHT) */
        .todo-status {
          margin-left: 12px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        /* Override legacy global styles */
        .today-todo-list li {
          padding-left: 0 !important;
          position: static !important;
        }

        .today-todo-list li span {
          position: static !important;
        }
      `}</style>

      <div className="today-todo-wrapper">
        {/* Header */}
        <div className="today-todo-header">
          <h2>Today To-do List</h2>
        </div>

        {/* Plans */}
        {plans.map((plan) => (
          <div className="today-plan-card" key={plan.id}>
            <h3>{plan.title}</h3>

            <ul className="today-todo-list">
              {plan.tasks.map((task, index) => (
                <li className="todo-item" key={index}>
                  <span className="todo-text">{task}</span>

                  <div className="todo-status">
                    <StatusDropdown />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default TodayToDoList;