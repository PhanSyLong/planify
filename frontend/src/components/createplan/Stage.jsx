import React, { useCallback, useMemo } from "react";
import Task from "./Task";
import "./Stage.css";

const Stage = ({ stage, stageNumber, updateStage, deleteStage }) => {
  const handleTitleChange = useCallback((e) => {
    updateStage({ ...stage, title: e.target.value });
  }, [stage, updateStage]);

  const handleDescriptionChange = useCallback((e) => {
    updateStage({ ...stage, description: e.target.value });
  }, [stage, updateStage]);

  const updateTask = useCallback((index, updatedTask) => {
    const newTasks = [...stage.tasks];
    newTasks[index] = updatedTask;
    updateStage({ ...stage, tasks: newTasks });
  }, [stage, updateStage]);

  const deleteTask = useCallback((index) => {
    updateStage({
      ...stage,
      tasks: stage.tasks.filter((_, i) => i !== index),
    });
  }, [stage, updateStage]);

  const addTask = useCallback(() => {
    updateStage({
      ...stage,
      tasks: [...stage.tasks, { 
        tempId: crypto.randomUUID(),
        description: "", 
        subtasks: [{
          tempId: crypto.randomUUID(),
          title: '',
          description: '',
          duration: 0,
          status: '',
        }]
      }],
    });
  }, [stage, updateStage]);

  // Tính tổng duration của stage từ tất cả tasks
  const computedStageDuration = useMemo(() => {
    return stage.tasks.reduce((sum, task) => sum + Number(task.duration || 0), 0);
  }, [stage.tasks]);

  return (
    <div className="stage-wrapper">
      <div className="stage-header">
        <h2>Stage {stageNumber}</h2>
        <button className="delete-stage-btn" onClick={deleteStage}>
          Delete Stage
        </button>
      </div>

      <div className="stage-card">
        <div className="stage-field">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter stage title"
            value={stage.title || ""}
            onChange={handleTitleChange}
          />
        </div>

        <div className="stage-field">
          <label>Description</label>
          <input
            type="text"
            placeholder="Enter stage description"
            value={stage.description || ""}
            onChange={handleDescriptionChange}
          />
        </div>

        <div className="stage-field duration-field">
          <label>Duration</label>
          <div className="duration-input">
            <input
              type="number"
              value={computedStageDuration}
              readOnly
              disabled
            />
            <span className="duration-unit">days</span>
          </div>
        </div>
      </div>

      <div className="task-section">
        {stage.tasks.map((task, index) => (
          <Task
            key={index}
            task={task}
            taskNumber={index + 1}
            updateTask={(updated) => updateTask(index, updated)}
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