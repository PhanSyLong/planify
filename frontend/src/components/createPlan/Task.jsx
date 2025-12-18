import React from "react";
import Subtask from "./Subtask";

const Task = () => {
  return (
    <>
      <style>{`
        .task-wrapper {
          width: 100%;
          margin: 20px 0;
        }

        /* Card container */
        .task-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          margin-bottom: 24px;
        }

        /* Each field */
        .task-field {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }

        .task-field label {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 6px;
        }

        .task-field input {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 14px;
          outline: none;
        }

        .task-field input:focus {
          border-color: #4e085f;
        }

        /* Duration */
        .duration-input {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .duration-input input {
          width: 100px;
        }

        .duration-unit {
          font-size: 14px;
          color: #555;
        }
      `}</style>

      <div className="task-wrapper">
        <h2>Task</h2>

        {/* Task Card */}
        <div className="task-card">
          <div className="task-field">
            <label>Title</label>
            <input type="text" placeholder="Enter task title" />
          </div>

          <div className="task-field">
            <label>Description</label>
            <input type="text" placeholder="Enter task description" />
          </div>

          <div className="task-field duration-field">
            <label>Duration</label>
            <div className="duration-input">
              <input type="number" min="0" placeholder="0" />
              <span className="duration-unit">Days</span>
            </div>
          </div>
        </div>

        {/* Subtask Section */}
        <Subtask />
      </div>
    </>
  );
};

export default Task;