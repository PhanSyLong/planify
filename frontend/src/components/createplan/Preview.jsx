import React, { useEffect, useCallback } from "react";
import "./Preview.css";

const PreviewModal = ({ planData, onClose }) => {
  const handleEscapeKey = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [handleEscapeKey]);

  const hasStages = planData.stages.length > 0;
  const hasTasks = hasStages && planData.stages.some(stage => stage.tasks.length > 0);

  return (
    <div className="preview-overlay" onClick={handleOverlayClick}>
      <div className="preview-modal">
        <button className="preview-close" onClick={onClose} aria-label="Close preview">
          ×
        </button>

        <h1 className="preview-title">Plan Preview</h1>

        <div className="preview-plan-title">
          <h2>{planData.title || 'Untitled Plan'}</h2>
        </div>

        {planData.reviewUrl && (
          <img
            src={planData.reviewUrl}
            alt={planData.title || 'Plan'}
            className="preview-image"
          />
        )}

        <div className="preview-info">
          <p className="preview-description">
            <strong>Description: </strong>
            {planData.description || 'No description provided'}
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

        {hasStages ? (
          planData.stages.map((stage, stageIdx) => (
            <div key={stageIdx} className="preview-stage">
              <h3 className="preview-stage-title">
                Stage {stageIdx + 1}: {stage.title || 'Untitled Stage'}
              </h3>
              <p className="preview-stage-description">
                {stage.description || 'No description provided'}
              </p>

              {stage.tasks.length > 0 ? (
                stage.tasks.map((task, taskIdx) => (
                  <div key={taskIdx} className="preview-task">
                    <h4 className="preview-task-title">
                      Task {taskIdx + 1}: {task.title || 'Untitled Task'}
                    </h4>
                    <p className="preview-task-description">
                      {task.description || 'No description provided'}
                    </p>
                    {task.duration && (
                      <p className="preview-task-duration">
                        Duration: {task.duration} {parseInt(task.duration) === 1 ? 'day' : 'days'}
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
                ))
              ) : (
                <p className="preview-empty">No tasks in this stage</p>
              )}
            </div>
          ))
        ) : (
          <div className="preview-empty">
            <p>No stages added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;