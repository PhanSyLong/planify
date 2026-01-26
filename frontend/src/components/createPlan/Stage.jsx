import React from "react";
import Task from "./Task";
import "./Stage.css";

const Stage = ({ stage, updateStage, deleteStage }) => {
  const addTask = () => {
    updateStage({
      ...stage,
      tasks: [...stage.tasks, { title: '', description: '', duration: '', subtasks: [] }]
    });
  };

  const updateTask = (index, updatedTask) => {
    const newTasks = [...stage.tasks];
    newTasks[index] = updatedTask;
    updateStage({ ...stage, tasks: newTasks });
  };

  const deleteTask = (index) => {
    updateStage({ ...stage, tasks: stage.tasks.filter((_, i) => i !== index) });
  };

  return (
    <div className="stage-wrapper">
      <div className="stage-header">
        <h2>Stage</h2>
        <button className="delete-stage-btn" onClick={deleteStage}>
          Delete Stage
        </button>
      </div>

      {/* Stage Card */}
      <div className="stage-card">
        <div className="stage-field">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter stage title"
            value={stage.title}
            onChange={(e) => updateStage({ ...stage, title: e.target.value })}
          />
        </div>

        <div className="stage-field">
          <label>Description</label>
          <input
            type="text"
            placeholder="Enter stage description"
            value={stage.description}
            onChange={(e) => updateStage({ ...stage, description: e.target.value })}
          />
        </div>
      </div>

      {/* Task Sections */}
      <div className="task-section">
        {stage.tasks.map((task, index) => (
          <Task
            key={index}
            task={task}
            updateTask={(updatedTask) => updateTask(index, updatedTask)}
            deleteTask={() => deleteTask(index)}
          />
        ))}

        <button className="add-task-btn" onClick={addTask}>
          + Add Task
        </button>
      </div>
    </div>
  );
};

export default Stage;