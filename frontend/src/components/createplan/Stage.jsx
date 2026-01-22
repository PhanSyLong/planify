import React, { useCallback } from "react";
import Task from "./Task";
import "./Stage.css";

const Stage = ({ stage, stageNumber, updateStage, deleteStage }) => {
  const handleTitleChange = useCallback((e) => {
    updateStage({ ...stage, title: e.target.value });
  }, [stage, updateStage]);

  const handleDescriptionChange = useCallback((e) => {
    updateStage({ ...stage, description: e.target.value });
  }, [stage, updateStage]);

  const addTask = useCallback(() => {
    updateStage({
      ...stage,
      tasks: [...stage.tasks, { title: '', description: '', duration: '', subtasks: [] }]
    });
  }, [stage, updateStage]);

  const updateTask = useCallback((index, updatedTask) => {
    const newTasks = [...stage.tasks];
    newTasks[index] = updatedTask;
    updateStage({ ...stage, tasks: newTasks });
  }, [stage, updateStage]);

  const deleteTask = useCallback((index) => {
    updateStage({
      ...stage,
      tasks: stage.tasks.filter((_, i) => i !== index)
    });
  }, [stage, updateStage]);

  return (
    <div className="stage-wrapper">
      <div className="stage-header">
        <h2>Stage {stageNumber}</h2>
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
            onChange={handleTitleChange}
          />
        </div>

        <div className="stage-field">
          <label>Description</label>
          <input
            type="text"
            placeholder="Enter stage description"
            value={stage.description}
            onChange={handleDescriptionChange}
          />
        </div>
      </div>

      {/* Task Sections */}
      <div className="task-section">
        {stage.tasks.map((task, index) => (
          <Task
            key={index}
            task={task}
            taskNumber={index + 1}
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