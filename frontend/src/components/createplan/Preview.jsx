import React, { useEffect, useCallback, useMemo } from "react";
import httpPublic from "../../api/httpPublic";
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

  // Normalize plan data to handle both create and edit mode structures
  const normalizedData = useMemo(() => {
    const stages = planData?.stages || [];
    const categories = planData?.categories || [];

    // Get image URL - could be reviewUrl (create mode) or picture (edit mode)
    // For existing plans, picture is a relative path that needs the API base URL
    let imageUrl = null;
    if (planData?.reviewUrl) {
      // Create mode - reviewUrl is already a full URL or blob URL
      imageUrl = planData.reviewUrl;
    } else if (planData?.picture) {
      // Edit mode - picture is a relative path (e.g., /public/images/xxx.jpg)
      // Need to check if it's already a full URL or a File object
      if (planData.picture instanceof File) {
        // New file uploaded during edit - create blob URL
        imageUrl = URL.createObjectURL(planData.picture);
      } else if (planData.picture.startsWith('http')) {
        // Already a full URL
        imageUrl = planData.picture;
      } else {
        // Relative path - prefix with API base URL
        imageUrl = `${httpPublic.defaults.baseURL}${planData.picture}`;
      }
    }

    return {
      title: planData?.title || '',
      description: planData?.description || '',
      duration: planData?.duration || 0,
      visibility: planData?.visibility || 'private',
      categories,
      imageUrl,
      stages: stages.map(stage => ({
        ...stage,
        title: stage?.title || '',
        description: stage?.description || '',
        duration: stage?.duration || 0,
        tasks: (stage?.tasks || []).map(task => ({
          ...task,
          title: task?.title || '',
          description: task?.description || '',
          duration: task?.duration || null,
          // Normalize subtasks - could be array of objects or array of strings
          subtasks: (task?.subtasks || []).map(subtask => {
            if (typeof subtask === 'string') {
              return { title: subtask, description: '', duration: 0 };
            }
            return {
              title: subtask?.title || '',
              description: subtask?.description || '',
              duration: subtask?.duration || 0
            };
          })
        }))
      }))
    };
  }, [planData]);

  const hasStages = normalizedData.stages.length > 0;

  // Helper to get subtask display text
  const getSubtaskDisplay = (subtask) => {
    if (subtask.title) {
      if (subtask.duration && subtask.duration > 0) {
        return `${subtask.title} (${subtask.duration} ${parseInt(subtask.duration) === 1 ? 'day' : 'days'})`;
      }
      return subtask.title;
    }
    return 'Untitled Subtask';
  };

  return (
    <div className="preview-overlay" onClick={handleOverlayClick}>
      <div className="preview-modal">
        <button className="preview-close" onClick={onClose} aria-label="Close preview">
          ×
        </button>

        <h1 className="preview-title">Plan Preview</h1>

        <div className="preview-plan-title">
          <h2>{normalizedData.title || 'Untitled Plan'}</h2>
        </div>

        {normalizedData.imageUrl && (
          <img
            src={normalizedData.imageUrl}
            alt={normalizedData.title || 'Plan'}
            className="preview-image"
          />
        )}

        <div className="preview-info">
          <p className="preview-description">
            <strong>Description: </strong>
            {normalizedData.description || 'No description provided'}
          </p>
          {normalizedData.categories.length > 0 && (
            <div className="preview-categories">
              <strong>Categories:</strong>
              {normalizedData.categories.map((cat, i) => (
                <span key={i} className="preview-category-tag">{cat}</span>
              ))}
            </div>
          )}
          {normalizedData.duration > 0 && (
            <p className="preview-duration">
              <strong>Duration: </strong>
              {normalizedData.duration} {parseInt(normalizedData.duration) === 1 ? 'day' : 'days'}
            </p>
          )}
          <p className="preview-visibility">
            <strong>Visibility: </strong>
            <span className={`visibility-badge visibility-${normalizedData.visibility}`}>
              {normalizedData.visibility.charAt(0).toUpperCase() + normalizedData.visibility.slice(1)}
            </span>
          </p>
        </div>

        {hasStages ? (
          normalizedData.stages.map((stage, stageIdx) => (
            <div key={stage.id || stage.tempId || stageIdx} className="preview-stage">
              <h3 className="preview-stage-title">
                Stage {stageIdx + 1}: {stage.title || 'Untitled Stage'}
              </h3>
              <p className="preview-stage-description">
                {stage.description || 'No description provided'}
              </p>
              {stage.duration > 0 && (
                <p className="preview-stage-duration">
                  <strong>Duration: </strong>
                  {stage.duration} {parseInt(stage.duration) === 1 ? 'day' : 'days'}
                </p>
              )}

              {stage.tasks.length > 0 ? (
                stage.tasks.map((task, taskIdx) => (
                  <div key={task.id || task.tempId || taskIdx} className="preview-task">
                    <h4 className="preview-task-title">
                      Task {taskIdx + 1}: {task.title || task.description || 'Untitled Task'}
                    </h4>
                    {task.title && task.description && (
                      <p className="preview-task-description">
                        {task.description}
                      </p>
                    )}
                    {!task.title && !task.description && (
                      <p className="preview-task-description">
                        No description provided
                      </p>
                    )}
                    {task.duration && (
                      <p className="preview-task-duration">
                        Duration: {task.duration} {parseInt(task.duration) === 1 ? 'day' : 'days'}
                      </p>
                    )}

                    {task.subtasks.length > 0 && (
                      <ul className="preview-subtasks">
                        {task.subtasks
                          .filter(subtask => subtask.title && subtask.title.trim())
                          .map((subtask, subIdx) => (
                            <li key={subtask.id || subtask.tempId || subIdx}>
                              {getSubtaskDisplay(subtask)}
                            </li>
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