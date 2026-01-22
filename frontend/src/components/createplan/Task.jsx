import React, { useCallback } from "react";
import Subtask from "./Subtask";
import "./Task.css";

const Task = ({ task, taskNumber, updateTask, deleteTask }) => {
  const handleTitleChange = useCallback((e) => {
    updateTask({ ...task, title: e.target.value });
  }, [task, updateTask]);

  const handleDescriptionChange = useCallback((e) => {
    updateTask({ ...task, description: e.target.value });
  }, [task, updateTask]);

  const handleDurationChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || parseInt(value) >= 0) {
      updateTask({ ...task, duration: value });
    }
  }, [task, updateTask]);

  const handleSubtasksChange = useCallback((subtasks) => {
    updateTask({ ...task, subtasks });
  }, [task, updateTask]);

  return (
    <div className="task-wrapper">
      <div className="task-header">
        <h3>Task {taskNumber}</h3>
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
            onChange={handleTitleChange}
          />
        </div>

        <div className="task-field">
          <label>Description</label>
          <input
            type="text"
            placeholder="Enter task description"
            value={task.description}
            onChange={handleDescriptionChange}
          />
        </div>

        <div className="task-field">
          <label>Duration</label>
          <div className="duration-input">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={task.duration}
              onChange={handleDurationChange}
            />
            <span className="duration-unit">Days</span>
          </div>
        </div>
      </div>

      {/* Subtask Section */}
      <Subtask
        subtasks={task.subtasks}
        setSubtasks={handleSubtasksChange}
      />
    </div>
  );
};

export default Task;