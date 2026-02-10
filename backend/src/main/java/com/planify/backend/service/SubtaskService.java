package com.planify.backend.service;

import com.planify.backend.dto.request.SubtaskRequest;
import com.planify.backend.dto.request.SubtaskUpdateRequest;
import com.planify.backend.dto.response.ProgressResponse;
import com.planify.backend.exception.AppException;
import com.planify.backend.exception.ErrorCode;
import com.planify.backend.model.*;
import com.planify.backend.repository.SubtaskRepository;
import com.planify.backend.repository.TaskRepository;
import com.planify.backend.repository.StageRepository;
import com.planify.backend.repository.PlanRepository;
import com.planify.backend.util.TimeCalculator;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
public class SubtaskService {
    private TaskRepository taskRepository;
    private SubtaskRepository subtaskRepository;
    private TaskService taskService;
    private StageRepository stageRepository;
    private PlanRepository planRepository;

    @Transactional
    public Subtask addSubtask(SubtaskRequest request) {
        Task task = taskRepository.findTaskById(request.getTaskId());
        if (task == null) {
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }
        Subtask subtask = new Subtask();
        subtask.setTask_id(task);
        subtask.setTitle(request.getTitle());
        subtask.setDescription(request.getDescription());
        subtask.setDuration(request.getDuration());
        subtask.setStatus(request.getStatus());

        // Save the new subtask
        Subtask saved = subtaskRepository.save(subtask);

        // Recompute and persist durations up the chain: Task -> Stage -> Plan
        // Use a separate transaction to avoid deadlock during concurrent subtask
        // creation
        updateDurationsAfterSubtaskAdd(task);

        return saved;
    }

    /**
     * Update durations without holding locks on multiple rows simultaneously.
     * Called separately from subtask insertion to avoid deadlock in concurrent
     * scenarios.
     */
    @Transactional
    public void updateDurationsAfterSubtaskAdd(Task task) {
        Integer taskDuration = subtaskRepository.sumDurationByTaskId(task.getId());
        taskRepository.updateDuration(task.getId(), taskDuration);

        Stage stage = task.getStage_id();
        if (stage != null) {
            Integer stageDuration = taskRepository.sumDurationByStageId(stage.getId());
            stageRepository.updateDuration(stage.getId(), stageDuration);

            Plan plan = stage.getPlan_id();
            if (plan != null) {
                Long planDuration = stageRepository.sumDurationByPlanId(plan.getId());
                planRepository.updateDuration(plan.getId(), planDuration);
            }
        }
    }

    @Transactional
    public void removeSubtask(Integer subtaskId, Integer taskId, Integer stageId, Integer planId) {
        // Validate that the task belongs to the given stage and plan
        Task task = taskService.getTaskByIdAndStageId(taskId, stageId, planId);
        if (task == null) {
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        Subtask subtask = subtaskRepository.findSubtaskByIdAndTaskId(subtaskId, taskId);
        if (subtask == null) {
            throw new AppException(ErrorCode.SUBTASK_NOT_FOUND);
        }

        // Delete the subtask
        subtaskRepository.delete(subtask);

        // Detach all entities to prevent cascading issues
        taskRepository.flush();

        // Recompute and persist durations up the chain: Task -> Stage -> Plan
        Integer taskDuration = subtaskRepository.sumDurationByTaskId(task.getId());
        taskRepository.updateDuration(task.getId(), taskDuration);

        Stage stage = task.getStage_id();
        if (stage != null) {
            Integer stageDuration = taskRepository.sumDurationByStageId(stage.getId());
            stageRepository.updateDuration(stage.getId(), stageDuration);

            Plan plan = stage.getPlan_id();
            if (plan != null) {
                Long planDuration = stageRepository.sumDurationByPlanId(plan.getId());
                planRepository.updateDuration(plan.getId(), planDuration);
            }
        }
    }

    public Subtask getSubtaskById(Integer subtaskId, Integer taskId, Integer stageId, Integer planId) {
        // Validate chain
        Task task = taskService.getTaskByIdAndStageId(taskId, stageId, planId);
        if (task == null) {
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        Subtask subtask = subtaskRepository.findSubtaskByIdAndTaskId(subtaskId, taskId);
        if (subtask == null) {
            throw new AppException(ErrorCode.SUBTASK_NOT_FOUND);
        }

        return subtask;
    }

    public List<Subtask> getSubtasksByPlanId(Integer planId) {
        return subtaskRepository.findAllSubtaskByPlanId(planId);
    }

    public List<Subtask> getAllSubtasks(Integer taskId, Integer stageId, Integer planId) {
        Task task = taskService.getTaskByIdAndStageId(taskId, stageId, planId);
        if (task == null) {
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        return subtaskRepository.findAllSubtask(taskId);
    }

    public ProgressResponse computeProgress(Integer planId, Integer stageId, Integer taskId, Integer subtaskId) {
        Task task = taskService.getTaskByIdAndStageId(taskId, stageId, planId);
        if (task == null) {
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        Subtask subtask = subtaskRepository.findSubtaskByIdAndTaskId(subtaskId, taskId);
        if (subtask == null) {
            throw new AppException(ErrorCode.SUBTASK_NOT_FOUND);
        }
        if (subtask.getStarted_at() == null) {
            return new ProgressResponse(
                    0,
                    subtask.getDuration(),
                    TimeStatus.NOT_STARTED);
        }
        if (subtask.getCompleted_at() == null) {
            if (Objects.equals(subtask.getStatus(), "cancelled")) {
                return new ProgressResponse(
                        0,
                        subtask.getDuration(),
                        TimeStatus.CANCELLED);
            } else {
                return new ProgressResponse(
                        0,
                        subtask.getDuration(),
                        TimeStatus.IN_PROGRESS);
            }
        }

        long actualDuration = TimeCalculator.calculateActualDays(
                subtask.getStarted_at(),
                subtask.getCompleted_at());
        TimeStatus status;

        if (actualDuration > subtask.getDuration()) {
            status = TimeStatus.LATE;
        } else {
            status = TimeStatus.ON_TIME;
        }
        return ProgressResponse.builder()
                .expectedDays(subtask.getDuration())
                .actualDays(actualDuration)
                .status(status)
                .build();
    }

    // Return today's todo list: all started today + incomplete from past days
    public List<Subtask> getTodoList(Integer ownerId) {
        return subtaskRepository.findTodayTodoList(ownerId);
    }

    // New: partial update for Subtask. If duration is updated, propagate changes up
    // to Task, Stage, and Plan.
    @Transactional
    public Subtask updateSubtaskPartial(Integer subtaskId, SubtaskUpdateRequest request) {
        // Find the subtask
        Subtask subtask = subtaskRepository.findById(subtaskId).orElse(null);
        if (subtask == null) {
            throw new AppException(ErrorCode.SUBTASK_NOT_FOUND);
        }

        Integer oldDuration = (subtask.getDuration() == 0) ? 0 : subtask.getDuration();
        boolean durationChanged = false;

        if (request.getTitle() != null)
            subtask.setTitle(request.getTitle());
        if (request.getDescription() != null)
            subtask.setDescription(request.getDescription());
        if (request.getStatus() != null)
            subtask.setStatus(request.getStatus());
        if (request.getDuration() != null) {
            if (request.getDuration() < 0) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
            if (!request.getDuration().equals(oldDuration)) {
                subtask.setDuration(request.getDuration());
                LocalDateTime startDate = subtask.getStarted_at();
                if (startDate != null) {
                    LocalDateTime endDate = startDate.plusDays(request.getDuration());
                    subtask.setScheduledDate(endDate);
                }
                durationChanged = true;
            }
        }

        Subtask saved = subtaskRepository.save(subtask);

        if (durationChanged) {
            // Recompute task duration as sum of its subtasks
            Task task = saved.getTask_id();
            if (task != null) {
                Integer taskDuration = subtaskRepository.sumDurationByTaskId(task.getId());
                taskRepository.updateDuration(task.getId(), taskDuration);

                Stage stage = task.getStage_id();
                if (stage != null) {
                    Integer stageDuration = taskRepository.sumDurationByStageId(stage.getId());
                    stageRepository.updateDuration(stage.getId(), stageDuration);

                    Plan plan = stage.getPlan_id();
                    if (plan != null) {
                        Long planDuration = stageRepository.sumDurationByPlanId(plan.getId());
                        planRepository.updateDuration(plan.getId(), planDuration);
                    }
                }
            }

            // Flush changes to ensure DB state is consistent within the transaction
            taskRepository.flush();
        }

        return saved;
    }

    public Subtask startSubtask(Integer subtaskId) {
        Subtask subtask = subtaskRepository.findById(subtaskId).orElse(null);
        if (subtask == null) {
            throw new AppException(ErrorCode.SUBTASK_NOT_FOUND);
        }
        subtask.setStarted_at(LocalDateTime.now());
        LocalDateTime startDate = subtask.getStarted_at();
        LocalDateTime endDate = startDate.plusDays(subtask.getDuration());
        subtask.setScheduledDate(endDate);
        return subtaskRepository.save(subtask);
    }

    public Subtask completeSubtask(Integer subtaskId) {
        Subtask subtask = subtaskRepository.findById(subtaskId).orElse(null);
        if (subtask == null) {
            throw new AppException(ErrorCode.SUBTASK_NOT_FOUND);
        }
        subtask.setCompleted_at(LocalDateTime.now());
        return subtaskRepository.save(subtask);
    }
}
