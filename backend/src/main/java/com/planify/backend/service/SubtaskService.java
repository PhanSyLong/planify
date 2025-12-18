package com.planify.backend.service;

import com.planify.backend.dto.request.SubtaskRequest;
import com.planify.backend.dto.request.SubtaskUpdateRequest;
import com.planify.backend.dto.response.TimingResponse;
import com.planify.backend.exception.AppException;
import com.planify.backend.exception.ErrorCode;
import com.planify.backend.model.Subtask;
import com.planify.backend.model.Task;
import com.planify.backend.model.Stage;
import com.planify.backend.model.Plan;
import com.planify.backend.repository.SubtaskRepository;
import com.planify.backend.repository.TaskRepository;
import com.planify.backend.repository.StageRepository;
import com.planify.backend.repository.PlanRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

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
    public Subtask addSubtask(SubtaskRequest request){
        Task task = taskRepository.findTaskById(request.getTaskId());
        if(task == null){
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
                Integer planDuration = stageRepository.sumDurationByPlanId(plan.getId());
                planRepository.updateDuration(plan.getId(), planDuration);
            }
        }

        return saved;
    }

    @Transactional
    public void removeSubtask(Integer subtaskId, Integer taskId, Integer stageId, Integer planId) {
        // Validate that the task belongs to the given stage and plan
        Task task = taskService.getTaskByIdAndStageId(taskId, stageId, planId);
        if (task == null){
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        Subtask subtask = subtaskRepository.findSubtaskById(subtaskId, taskId);
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
                Integer planDuration = stageRepository.sumDurationByPlanId(plan.getId());
                planRepository.updateDuration(plan.getId(), planDuration);
            }
        }
    }

    public Subtask getSubtaskById(Integer subtaskId, Integer taskId, Integer stageId, Integer planId){
        // Validate chain
        Task task = taskService.getTaskByIdAndStageId(taskId, stageId, planId);
        if (task == null){
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        Subtask subtask = subtaskRepository.findSubtaskById(subtaskId, taskId);
        if (subtask == null){
            throw new AppException(ErrorCode.SUBTASK_NOT_FOUND);
        }

        return subtask;
    }

    public List<Subtask> getAllSubtasks(Integer taskId, Integer stageId, Integer planId){
        Task task = taskService.getTaskByIdAndStageId(taskId, stageId, planId);
        if (task == null){
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        List<Integer> ids = subtaskRepository.findAllSubtask(taskId);
        List<Subtask> results = new ArrayList<>();
        for (Integer id : ids) {
            subtaskRepository.findById(id).ifPresent(results::add);
        }
        return results;
    }

    // New: compute timing status for a single subtask
    public TimingResponse computeTimeStatus(Integer planId, Integer stageId, Integer taskId, Integer subtaskId) {
        // Validate chain
        Task task = taskService.getTaskByIdAndStageId(taskId, stageId, planId);
        if (task == null){
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        Subtask subtask = subtaskRepository.findSubtaskById(subtaskId, taskId);
        if (subtask == null){
            throw new AppException(ErrorCode.SUBTASK_NOT_FOUND);
        }

        Integer expected = subtask.getDuration();
        Integer actual = "completed".equalsIgnoreCase(subtask.getStatus()) ? subtask.getDuration() : 0;

        com.planify.backend.model.TimeStatus status;
        if (actual < expected) status = com.planify.backend.model.TimeStatus.EARLY;
        else if (actual > expected) status = com.planify.backend.model.TimeStatus.LATE;
        else status = com.planify.backend.model.TimeStatus.ON_TIME;

        return TimingResponse.builder()
                .planId(planId)
                .expectedTime(expected)
                .actualTime(actual)
                .status(status)
                .build();
    }



    // New: return incomplete scheduled subtasks for todo list ordered by scheduled_date asc
    public List<Subtask> getTodoList(Integer ownerId) {
        return subtaskRepository.findIncompleteScheduledByOwnerOrdered(ownerId);
    }

    // New: partial update for Subtask. If duration is updated, propagate changes up to Task, Stage, and Plan.
    @Transactional
    public Subtask updateSubtaskPartial(Integer subtaskId, SubtaskUpdateRequest request) {
        // Find the subtask
        Subtask subtask = subtaskRepository.findById(subtaskId).orElse(null);
        if (subtask == null) {
            throw new AppException(ErrorCode.SUBTASK_NOT_FOUND);
        }

        Integer oldDuration = (subtask.getDuration() == 0) ? 0 : subtask.getDuration();
        boolean durationChanged = false;

        if (request.getTitle() != null) subtask.setTitle(request.getTitle());
        if (request.getDescription() != null) subtask.setDescription(request.getDescription());
        if (request.getStatus() != null) subtask.setStatus(request.getStatus());
        if (request.getDuration() != null) {
            if (request.getDuration() < 0) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
            if (!request.getDuration().equals(oldDuration)) {
                subtask.setDuration(request.getDuration());
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
                        Integer planDuration = stageRepository.sumDurationByPlanId(plan.getId());
                        planRepository.updateDuration(plan.getId(), planDuration);
                    }
                }
            }

            // Flush changes to ensure DB state is consistent within the transaction
            taskRepository.flush();
        }

        return saved;
    }
}
