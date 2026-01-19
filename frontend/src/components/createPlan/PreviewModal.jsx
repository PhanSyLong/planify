import React from "react";
import "./PreviewModal.css";

const PreviewModal = ({ planData, onClose }) => {
  return (
    <div className="preview-overlay">
      <div className="preview-modal">
        <button className="preview-close" onClick={onClose}>
          &times;
        </button>

        <h1 className="preview-title">Plan Preview</h1>

        <div className="preview-plan-title">
          <h2>{planData.title || 'Untitled Plan'}</h2>
        </div>

        <div className="preview-info">
          <p className="preview-description">
            <strong>Description:</strong> {planData.description || 'No description'}
          </p>
          {planData.categories.length > 0 && (
            <div className="preview-categories">
              <strong>Categories:</strong>
              {planData.categories.map((cat, i) => (
                <span key={i} className="preview-category-tag">{cat}</span>
              ))}
            </div>
          )}
        </div>

        {planData.stages.map((stage, stageIdx) => (
          <div key={stageIdx} className="preview-stage">
            <h3 className="preview-stage-title">
              Stage {stageIdx + 1}: {stage.title || 'Untitled Stage'}
            </h3>
            <p className="preview-stage-description">
              {stage.description || 'No description'}
            </p>

            {stage.tasks.map((task, taskIdx) => (
              <div key={taskIdx} className="preview-task">
                <h4 className="preview-task-title">
                  Task {taskIdx + 1}: {task.title || 'Untitled Task'}
                </h4>
                <p className="preview-task-description">
                  {task.description || 'No description'}
                </p>
                {task.duration && (
                  <p className="preview-task-duration">
                    Duration: {task.duration} days
                  </p>
                )}

                {task.subtasks.length > 0 && (
                  <ul className="preview-subtasks">
                    {task.subtasks.map((subtask, subIdx) => (
                      <li key={subIdx}>{subtask}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviewModal;