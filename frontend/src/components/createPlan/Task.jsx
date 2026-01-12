import React from "react";
import Subtask from "./Subtask";
import "./Task.css";

const Task = ({ task, updateTask, deleteTask }) => {
  return (
    <div className="task-wrapper">
      <div className="task-header">
        <h2>Task</h2>
        <button className="delete-task-btn" onClick={deleteTask}>
          Delete Task
        </button>
      </div>

      {/* Task Card */}
      <div className="task-card">
        <div className="task-field">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter task title"
            value={task.title}
            onChange={(e) => updateTask({ ...task, title: e.target.value })}
          />
        </div>

        <div className="task-field">
          <label>Description</label>
          <input
            type="text"
            placeholder="Enter task description"
            value={task.description}
            onChange={(e) => updateTask({ ...task, description: e.target.value })}
          />
        </div>

        <div className="task-field duration-field">
          <label>Duration</label>
          <div className="duration-input">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={task.duration}
              onChange={(e) => updateTask({ ...task, duration: e.target.value })}
            />
            <span className="duration-unit">Days</span>
          </div>
        </div>
      </div>

      {/* Subtask Section */}
      <Subtask
        subtasks={task.subtasks}
        setSubtasks={(subtasks) => updateTask({ ...task, subtasks })}
      />
    </div>
  );
};

export default Task;