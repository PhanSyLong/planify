import React, { useState, useCallback } from 'react';
import EditPlanInfo from './EditPlanInfo';
import PreviewModal from '../createplan/Preview';
import { updatePlan } from '../../api/plan';
import { createStage, updateStage, deleteStagebyPlanAndStageId } from '../../api/stage';
import { createTask, updateTask, deleteTask } from '../../api/task';
import { createSubtask, updateSubtask, deleteSubtask } from '../../api/subtask';
import { uploadImage } from '../../api/image';
import { setTagsForPlan } from '../../api/tag';
import './EditPlan.css';

const EditPlan = ({ plan, setPlan, onPreview, onSave, onCancel }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [localPlan, setLocalPlan] = useState(plan);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePreview = useCallback(() => {
    setShowPreview(true);
    onPreview?.();
  }, [onPreview]);

  const handleSaveClick = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const handleConfirmSave = useCallback(async () => {
    setShowConfirm(false);
    setIsSaving(true);

    try {
      const planId = plan.id;
      const originalStages = plan.stages || [];
      const updatedStages = localPlan.stages || [];

      // 1. Handle image upload if picture was changed
      let picturePath = localPlan.picture;
      if (localPlan.picture instanceof File) {
        try {
          const imageResponse = await uploadImage(localPlan.picture);
          picturePath = imageResponse.data?.result;
        } catch (imageError) {
          console.error('Failed to upload image:', imageError);
          // Continue without updating image if upload fails
          picturePath = plan.picture; // Keep original
        }
      }

      // 2. Update plan info
      await updatePlan(planId, {
        title: localPlan.title,
        description: localPlan.description,
        picture: picturePath,
        visibility: localPlan.visibility,
      });

      // 3. Update tags for the plan
      if (localPlan.categories) {
        try {
          await setTagsForPlan(planId, localPlan.categories);
        } catch (tagError) {
          console.error('Failed to update tags:', tagError);
        }
      }

      // 2. Process stages
      for (const stage of updatedStages) {
        if (stage.tempId && !stage.id) {
          // New stage - create it
          const stageRes = await createStage({
            planId: planId,
            title: stage.title,
            description: stage.description
          });
          const createdStage = stageRes.data?.result;
          const newStageId = createdStage?.id;

          // Create tasks for new stage
          if (newStageId && stage.tasks) {
            for (const task of stage.tasks) {
              const taskRes = await createTask({
                stageId: newStageId,
                description: task.description
              });
              const newTaskId = taskRes.data?.result?.id;

              // Create subtasks for new task
              if (newTaskId && task.subtasks) {
                for (const subtask of task.subtasks) {
                  await createSubtask({
                    taskId: newTaskId,
                    title: subtask.title,
                    description: subtask.description || '',
                    duration: subtask.duration || 0,
                    status: subtask.status || 'incompleted'
                  });
                }
              }
            }
          }
        } else if (stage.id) {
          // Existing stage - update it
          await updateStage(stage.id, {
            title: stage.title,
            description: stage.description
          });

          // Process tasks for existing stage
          const originalStage = originalStages.find(s => s.id === stage.id);
          const originalTasks = originalStage?.tasks || [];
          const updatedTasks = stage.tasks || [];

          for (const task of updatedTasks) {
            if (task.tempId && !task.id) {
              // New task - create it
              const taskRes = await createTask({
                stageId: stage.id,
                description: task.description
              });
              const newTaskId = taskRes.data?.result?.id;

              // Create subtasks for new task
              if (newTaskId && task.subtasks) {
                for (const subtask of task.subtasks) {
                  await createSubtask({
                    taskId: newTaskId,
                    title: subtask.title,
                    description: subtask.description || '',
                    duration: subtask.duration || 0,
                    status: subtask.status || 'incompleted'
                  });
                }
              }
            } else if (task.id) {
              // Existing task - update it
              await updateTask(task.id, {
                description: task.description
              });

              // Process subtasks for existing task
              const originalTask = originalTasks.find(t => t.id === task.id);
              const originalSubtasks = originalTask?.subtasks || [];
              const updatedSubtasks = task.subtasks || [];

              for (const subtask of updatedSubtasks) {
                if (subtask.tempId && !subtask.id) {
                  // New subtask - create it
                  await createSubtask({
                    taskId: task.id,
                    title: subtask.title,
                    description: subtask.description || '',
                    duration: subtask.duration || 0,
                    status: subtask.status || 'incompleted'
                  });
                } else if (subtask.id) {
                  // Existing subtask - update it
                  await updateSubtask(subtask.id, {
                    title: subtask.title,
                    description: subtask.description,
                    duration: subtask.duration,
                    status: subtask.status
                  });
                }
              }

              // Delete removed subtasks
              for (const origSubtask of originalSubtasks) {
                const stillExists = updatedSubtasks.find(s => s.id === origSubtask.id);
                if (!stillExists && origSubtask.id) {
                  await deleteSubtask(planId, stage.id, task.id, origSubtask.id);
                }
              }
            }
          }

          // Delete removed tasks
          for (const origTask of originalTasks) {
            const stillExists = updatedTasks.find(t => t.id === origTask.id);
            if (!stillExists && origTask.id) {
              await deleteTask(planId, stage.id, origTask.id);
            }
          }
        }
      }

      // 3. Delete removed stages
      for (const origStage of originalStages) {
        const stillExists = updatedStages.find(s => s.id === origStage.id);
        if (!stillExists && origStage.id) {
          await deleteStagebyPlanAndStageId(planId, origStage.id);
        }
      }

      // Update local state and parent with the new picture path
      const savedPlan = { ...localPlan, picture: picturePath };
      setPlan(savedPlan);
      onSave?.();

    } catch (error) {
      console.error('Failed to save plan:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [localPlan, plan, setPlan, onSave]);

  const handleCancelConfirm = useCallback(() => {
    setShowConfirm(false);
  }, []);

  const handleCancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  const handleUpdateFromChild = useCallback((updatedPlan) => {
    setLocalPlan(updatedPlan);
  }, []);

  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  return (
    <div className="createplan-page">
      <div className="createplan-header">
        <h1>Edit Plan</h1>
      </div>

      <div className="createplan-content">
        <EditPlanInfo
          initialPlan={plan}
          currentPlan={localPlan}
          onPlanChange={handleUpdateFromChild}
        />
      </div>

      <div className="createplan-actions">
        <button className="review-btn" onClick={handlePreview}>
          Preview
        </button>
        <button
          className="save-btn"
          onClick={handleSaveClick}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>

      {showPreview && (
        <PreviewModal
          planData={localPlan}
          onClose={handleClosePreview}
        />
      )}

      {showConfirm && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3>Confirm Changes</h3>
            <p>Are you sure you want to save the changes to this plan?</p>
            <div className="confirm-modal-actions">
              <button className="confirm-yes-btn" onClick={handleConfirmSave}>
                Yes, Save
              </button>
              <button className="confirm-no-btn" onClick={handleCancelConfirm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(EditPlan);