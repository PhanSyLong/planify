import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditPlan from './EditPlan';
import PreviewModal from '../createplan/Preview';
import StatusDropdown from '../../components/home/StatusDropdown';
import ReviewPlanPopup from './ReviewPlanPopUp';
import { usePlans } from '../../context/PlanContext';
import { deletePlan } from '../../api/plan';
import httpPublic from '../../api/httpPublic';
import './ViewMyPlan.css';

const ViewMyPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reviewBtnRef = useRef(null);

  const [plan, setPlan] = useState(null);
  const [originalPlan, setOriginalPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Track started subtasks and confirmation dialogs
  const [startedSubtasks, setStartedSubtasks] = useState(new Set());
  const [hasStartedAnySubtask, setHasStartedAnySubtask] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    type: null, // 'start-first', 'done', 'cancel'
    stageIdx: null,
    taskIdx: null,
    subtaskIdx: null,
    newStatus: null
  });

  const { getCachedPlanById, plans } = usePlans();

  // Get plan from context
  const contextPlan = useMemo(() => {
    return getCachedPlanById(Number(id));
  }, [id, getCachedPlanById]);

  // Initialize plan state from context
  useMemo(() => {
    if (contextPlan && !plan) {
      setPlan(contextPlan);
      setOriginalPlan(JSON.parse(JSON.stringify(contextPlan)));
    }
  }, [contextPlan, plan]);

  // Calculate review statistics
  const calculateReviewData = useCallback(() => {
    if (!plan) return {};

    let totalSubtasks = 0;
    let cancelled = 0;
    let completedOnTime = 0;
    let completedLate = 0;
    let inProgress = 0;
    let incomplete = 0;

    plan.stages.forEach(stage => {
      stage.tasks.forEach(task => {
        if (task.subtasks) {
          task.subtasks.forEach(subtask => {
            totalSubtasks++;

            switch (subtask.status) {
              case 'DONE':
                if (subtask.completedAt && subtask.deadline) {
                  const completed = new Date(subtask.completedAt);
                  const deadline = new Date(subtask.deadline);
                  if (completed <= deadline) {
                    completedOnTime++;
                  } else {
                    completedLate++;
                  }
                } else {
                  completedOnTime++;
                }
                break;
              case 'CANCELLED':
                cancelled++;
                break;
              case 'IN_PROGRESS':
                inProgress++;
                break;
              case 'INCOMPLETE':
                incomplete++;
                break;
              default:
                incomplete++;
            }
          });
        }
      });
    });

    return {
      totalSubtasks,
      cancelled,
      completedOnTime,
      completedLate,
      inProgress,
      incomplete,
    };
  }, [plan]);

  // Handle subtask status change
  const handleSubtaskStatusChange = useCallback((stageIdx, taskIdx, subtaskIdx, newStatus) => {
    setPlan(prevPlan => {
      const updatedPlan = JSON.parse(JSON.stringify(prevPlan));
      const subtask = updatedPlan.stages[stageIdx].tasks[taskIdx].subtasks[subtaskIdx];

      subtask.status = newStatus;

      // Set completedAt timestamp when marked as DONE
      if (newStatus === 'DONE' && !subtask.completedAt) {
        subtask.completedAt = new Date().toISOString().split('T')[0];
      } else if (newStatus !== 'DONE') {
        subtask.completedAt = null;
      }

      // TODO: Send update to backend API
      // await updateSubtaskStatus(planId, stageIdx, taskIdx, subtaskIdx, { status: newStatus, completedAt: subtask.completedAt });

      return updatedPlan;
    });
  }, []);

  const handleSave = useCallback(() => {
    console.log('Saved plan:', plan);
    setOriginalPlan(JSON.parse(JSON.stringify(plan)));
    setIsEditing(false);
    // TODO: Send to API
    // await savePlan(id, plan);
  }, [plan]);

  const handleCancel = useCallback(() => {
    setPlan(JSON.parse(JSON.stringify(originalPlan)));
    setIsEditing(false);
  }, [originalPlan]);

  const handlePreview = useCallback(() => {
    setShowPreview(true);
  }, []);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deletePlan(id);
      // Refresh the page and navigate to My Plan
      window.location.href = '/myplan';
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [id]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  // Check if all subtasks in a task are completed (DONE or CANCELLED)
  const isTaskCompleted = useCallback((stageIdx, taskIdx) => {
    if (!plan) return false;
    const task = plan.stages[stageIdx]?.tasks[taskIdx];
    if (!task?.subtasks?.length) return true;

    return task.subtasks.every(subtask => {
      const key = `${stageIdx}-${taskIdx}-${task.subtasks.indexOf(subtask)}`;
      const status = typeof subtask === 'object' ? subtask.status : 'INCOMPLETE';
      return startedSubtasks.has(key) && (status === 'DONE' || status === 'CANCELLED');
    });
  }, [plan, startedSubtasks]);

  // Check if all tasks in a stage are completed
  const isStageCompleted = useCallback((stageIdx) => {
    if (!plan) return false;
    const stage = plan.stages[stageIdx];
    if (!stage?.tasks?.length) return true;

    return stage.tasks.every((_, taskIdx) => isTaskCompleted(stageIdx, taskIdx));
  }, [plan, isTaskCompleted]);

  // Determine if a subtask's Start button should be enabled
  const isSubtaskEnabled = useCallback((stageIdx, taskIdx, subtaskIdx) => {
    if (!plan) return false;

    // First stage, first task - always enabled initially
    if (stageIdx === 0 && taskIdx === 0) return true;

    // Check if previous task in the same stage is completed
    if (taskIdx > 0) {
      return isTaskCompleted(stageIdx, taskIdx - 1);
    }

    // First task of a new stage - check if previous stage is completed
    if (stageIdx > 0 && taskIdx === 0) {
      return isStageCompleted(stageIdx - 1);
    }

    return false;
  }, [plan, isTaskCompleted, isStageCompleted]);

  // Check if subtask has been started
  const isSubtaskStarted = useCallback((stageIdx, taskIdx, subtaskIdx) => {
    return startedSubtasks.has(`${stageIdx}-${taskIdx}-${subtaskIdx}`);
  }, [startedSubtasks]);

  // Check if subtask is finished (DONE or CANCELLED)
  const isSubtaskFinished = useCallback((stageIdx, taskIdx, subtaskIdx) => {
    if (!plan) return false;
    const subtask = plan.stages[stageIdx]?.tasks[taskIdx]?.subtasks?.[subtaskIdx];
    if (!subtask || typeof subtask !== 'object') return false;
    return subtask.status === 'DONE' || subtask.status === 'CANCELLED';
  }, [plan]);

  // Handle starting a subtask
  const handleStartSubtask = useCallback((stageIdx, taskIdx, subtaskIdx) => {
    const isFirstEver = !hasStartedAnySubtask;

    if (isFirstEver) {
      // Show confirmation dialog for first subtask
      setConfirmModal({
        visible: true,
        type: 'start-first',
        stageIdx,
        taskIdx,
        subtaskIdx,
        newStatus: null
      });
    } else {
      // Start immediately for subsequent subtasks
      setStartedSubtasks(prev => new Set([...prev, `${stageIdx}-${taskIdx}-${subtaskIdx}`]));
    }
  }, [hasStartedAnySubtask]);

  // Handle status change with confirmation
  const handleStatusChangeWithConfirmation = useCallback((stageIdx, taskIdx, subtaskIdx, newStatus) => {
    if (newStatus === 'DONE' || newStatus === 'CANCELLED') {
      setConfirmModal({
        visible: true,
        type: newStatus === 'DONE' ? 'done' : 'cancel',
        stageIdx,
        taskIdx,
        subtaskIdx,
        newStatus
      });
    }
  }, []);

  // Confirm the modal action
  const handleConfirmModal = useCallback(() => {
    const { type, stageIdx, taskIdx, subtaskIdx, newStatus } = confirmModal;

    if (type === 'start-first') {
      // Start the first subtask
      setStartedSubtasks(prev => new Set([...prev, `${stageIdx}-${taskIdx}-${subtaskIdx}`]));
      setHasStartedAnySubtask(true);
    } else if (type === 'done' || type === 'cancel') {
      // Update the subtask status
      handleSubtaskStatusChange(stageIdx, taskIdx, subtaskIdx, newStatus);
    }

    setConfirmModal({ visible: false, type: null, stageIdx: null, taskIdx: null, subtaskIdx: null, newStatus: null });
  }, [confirmModal, handleSubtaskStatusChange]);

  // Cancel the modal
  const handleCancelModal = useCallback(() => {
    setConfirmModal({ visible: false, type: null, stageIdx: null, taskIdx: null, subtaskIdx: null, newStatus: null });
  }, []);

  // Show loading state while plans are being fetched from context
  if (!plans || plans.length === 0) {
    return (
      <div className="viewplan-loading">
        <div className="spinner" role="status" aria-label="Loading"></div>
        <p>Loading plan...</p>
      </div>
    );
  }

  // Show error if plan not found
  if (!plan) {
    return (
      <div className="viewplan-error">
        <h2>Plan not found</h2>
        <button onClick={handleGoBack}>Go Back</button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <>
        <EditPlan
          plan={plan}
          setPlan={setPlan}
          onPreview={handlePreview}
          onSave={handleSave}
          onCancel={handleCancel}
        />
        {showPreview && (
          <PreviewModal
            planData={plan}
            onClose={() => setShowPreview(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="viewplan-container">
      <div className="viewplan-header">
        <button className="viewplan-back-btn" onClick={handleGoBack}>
          ← Back
        </button>

        <div className="viewplan-actions">
          <div ref={reviewBtnRef} style={{ position: 'relative' }}>
            <button className="btn-review" onClick={() => setShowReview(!showReview)}>
              Review
            </button>
            <ReviewPlanPopup
              isOpen={showReview}
              onClose={() => setShowReview(false)}
              containerRef={reviewBtnRef}
              reviewData={calculateReviewData()}
            />
          </div>
          <button className="btn-edit" onClick={() => setIsEditing(true)} disabled={hasStartedAnySubtask}>
            Edit Plan
          </button>
          <button className="btn-delete" onClick={handleDeleteClick}>
            Delete
          </button>
        </div>
      </div>

      <h1 className="viewplan-title">{plan.title}</h1>

      <div className="viewplan-main">
        <div className="viewplan-sidebar">
          <div className="viewplan-image">
            {plan.picture ? (
              <img src={`${httpPublic.defaults.baseURL}${plan.picture}`} alt={plan.title} />
            ) : (
              <div className="placeholder-image">
                <div className="landscape-icon"></div>
              </div>
            )}
          </div>

          <div className="viewplan-info">
            <div className="info-section">
              <strong>Description</strong>
              <p>{plan.description}</p>
            </div>

            <div className="info-section">
              <strong>Tags</strong>
              <div className="category-tags">
                {(plan.categories || []).map((cat, i) => (
                  <span key={i} className="category-tag">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className='info-section'>
              <strong>Duration</strong>
              <p>{plan.duration} Days</p>
            </div>

            <div className='info-section'>
              <strong>Visibility</strong>
              <p>{plan.visibility}</p>
            </div>
          </div>
        </div>

        <div className="viewplan-stages">
          {plan.stages.map((stage, stageIdx) => (
            <div key={stageIdx} className="viewplan-stage">
              <div className="stage-header">
                <h3 className="stage-title">
                  Stage {stageIdx + 1}: {stage.title || 'Untitled Stage'}
                </h3>
              </div>

              {stage.description && (
                <p className="stage-description">{stage.description}</p>
              )}

              {stage.duration && (
                <p className="stage-duration">Duration: {stage.duration} Days</p>
              )}

              <div className="stage-tasks">
                {stage.tasks.map((task, taskIdx) => (
                  <div key={taskIdx} className="viewplan-task">
                    <div className="task-header">
                      <h4 className="task-title">
                        Task {taskIdx + 1}: {task.description || 'Untitled Task'}
                      </h4>
                    </div>

                    {task.duration && (
                      <p className="task-duration">
                        Duration: {task.duration} Days
                      </p>
                    )}

                    {task.subtasks?.length > 0 && (
                      <div className="subtasks">
                        <strong>Subtasks:</strong>
                        <ul>
                          {task.subtasks.map((subtask, subtaskIdx) => (
                            <li key={subtaskIdx} className="subtask-item">
                              <div className="subtask-content">
                                <span className="subtask-title">
                                  {typeof subtask === 'string' ? subtask : subtask.title}
                                </span>
                                {typeof subtask === 'object' && subtask.description && (
                                  <div className="subtask-description">{subtask.description}</div>
                                )}
                                {typeof subtask === 'object' && subtask.duration && (
                                  <div className="subtask-duration">Duration: {subtask.duration} Days</div>
                                )}
                              </div>
                              {typeof subtask === 'object' && (
                                <>
                                  {!isSubtaskStarted(stageIdx, taskIdx, subtaskIdx) ? (
                                    // Show Start button if not started
                                    <button
                                      className="btn-start-subtask"
                                      onClick={() => handleStartSubtask(stageIdx, taskIdx, subtaskIdx)}
                                      disabled={!isSubtaskEnabled(stageIdx, taskIdx, subtaskIdx)}
                                    >
                                      Start
                                    </button>
                                  ) : (
                                    // Show StatusDropdown if started
                                    <StatusDropdown
                                      value={subtask.status || 'INCOMPLETE'}
                                      onChange={(newStatus) =>
                                        handleStatusChangeWithConfirmation(stageIdx, taskIdx, subtaskIdx, newStatus)
                                      }
                                      disabled={isSubtaskFinished(stageIdx, taskIdx, subtaskIdx)}
                                      hideIncomplete={true}
                                    />
                                  )}
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {plan.stages.length === 0 && (
            <p className="no-stages">No stages defined yet.</p>
          )}
        </div>
      </div>

      {/* Subtask Confirmation Modal */}
      {confirmModal.visible && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3>
              {confirmModal.type === 'start-first' && 'Start Your Plan'}
              {confirmModal.type === 'done' && 'Complete Subtask'}
              {confirmModal.type === 'cancel' && 'Cancel Subtask'}
            </h3>
            <p>
              {confirmModal.type === 'start-first' &&
                'You are about to start working on this plan. Once you start, you won\'t be able to edit the plan anymore. Are you sure you want to begin?'}
              {confirmModal.type === 'done' &&
                'Are you sure you want to mark this subtask as done? This action cannot be undone.'}
              {confirmModal.type === 'cancel' &&
                'Are you sure you want to cancel this subtask? This action cannot be undone.'}
            </p>
            <div className="confirm-modal-actions">
              <button className="confirm-no-btn" onClick={handleCancelModal}>
                No, Go Back
              </button>
              <button
                className={`confirm-yes-btn ${confirmModal.type === 'cancel' ? 'delete-confirm-btn' : ''}`}
                onClick={handleConfirmModal}
              >
                {confirmModal.type === 'start-first' && 'Yes, Start'}
                {confirmModal.type === 'done' && 'Yes, Complete'}
                {confirmModal.type === 'cancel' && 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>Delete Plan</h3>
            <p>Are you sure you want to delete "{plan.title}"?</p>
            <p className="delete-warning">This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <button
                className="btn-cancel"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-delete"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMyPlan;