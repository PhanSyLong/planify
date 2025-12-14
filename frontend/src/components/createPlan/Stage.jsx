import React, { useState } from "react";
import Task from "./Task";

const Stage = () => {
  const [tasks, setTasks] = useState([0]);

  const addTask = () => {
    setTasks([...tasks, tasks.length]);
  };

  return (
    <>
      <style>{`
        .stage-wrapper {
          width: 100%;
          margin-bottom: 32px;
        }

        /* Stage card */
        .stage-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          margin-bottom: 24px;
        }

        .stage-field {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }

        .stage-field label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 6px;
          color: #333;
        }

        .stage-field input {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 14px;
          outline: none;
        }

        .stage-field input:focus {
          border-color: #4e085f;
        }

        /* Task section */
        .task-section {
          padding-left: 8px;
        }

        /* Add task button */
        .add-task-btn {
          margin-top: 16px;
          padding: 10px 16px;
          background-color: #4e085f;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
        }

        .add-task-btn:hover {
          opacity: 0.9;
        }
      `}</style>

      <div className="stage-wrapper">
        <h2>Stage</h2>

        {/* Stage Card */}
        <div className="stage-card">
          <div className="stage-field">
            <label>Title</label>
            <input type="text" placeholder="Enter stage title" />
          </div>

          <div className="stage-field">
            <label>Description</label>
            <input type="text" placeholder="Enter stage description" />
          </div>
        </div>

        {/* Task Sections */}
        <div className="task-section">
          {tasks.map((_, index) => (
            <Task key={index} />
          ))}

          <button className="add-task-btn" onClick={addTask}>
            + Add Task
          </button>
        </div>
      </div>
    </>
  );
};

export default Stage;