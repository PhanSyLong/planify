package com.planify.backend.service;

import com.planify.backend.dto.request.TaskRequest;
import com.planify.backend.dto.request.TaskUpdateRequest;
import com.planify.backend.dto.response.ProgressResponse;

import com.planify.backend.exception.AppException;
import com.planify.backend.exception.ErrorCode;
import com.planify.backend.model.*;
import com.planify.backend.repository.StageRepository;
import com.planify.backend.repository.SubtaskRepository;
import com.planify.backend.repository.TaskRepository;
import com.planify.backend.util.TimeCalculator;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
public class TaskService {
    private StageRepository stageRepository;
    private TaskRepository taskRepository;
    private SubtaskRepository subtaskRepository;

    public Task addTask(TaskRequest taskRequest){
        // Lookup stage by id (TaskRequest doesn't contain planId)
        Stage stage = stageRepository.findStageById(taskRequest.getStageId());
        if (stage == null) {
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        Task task = new Task();
        task.setDescription(taskRequest.getDescription());
//        task.setDuration(taskRequest.getDuration());

        task.setStage_id(stage);

        return taskRepository.save(task);
    }

    // Update removeTask to require planId and validate stage->plan relationship
    public void removeTask(Integer taskId, Integer stageId, Integer planId){
        // Validate stage belongs to plan
        Stage stage = stageRepository.findStageByIdAndPlanId(stageId, planId);
        if (stage == null){
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        Task task = taskRepository.findTaskByIdAndStageId(taskId, stageId);
        if (task == null){
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        taskRepository.delete(task);
    }

    // Updated: accept planId to validate stage belongs to plan
    public List<Task> getAllTasksByStageId(Integer stageId, Integer planId){
        Stage stage = stageRepository.findStageByIdAndPlanId(stageId, planId);
        if (stage == null){
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        return taskRepository.findAllTask(stageId);
    }

    // Updated: accept planId for validation
    public Task getTaskByIdAndStageId(Integer taskId, Integer stageId, Integer planId){
        Stage stage = stageRepository.findStageByIdAndPlanId(stageId, planId);
        if (stage == null){
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        return findTaskByIdAndStageIdHelper(taskId, stageId);
    }

    // Helper to work around method name conflict in patch: call repository properly
    private Task findTaskByIdAndStageIdHelper(Integer taskId, Integer stageId) {
        return taskRepository.findTaskByIdAndStageId(taskId, stageId);
    }

    // New: partial update for Task
    public Task updateTaskPartial(Integer taskId, TaskUpdateRequest request) {
        Task task = taskRepository.findTaskById(taskId);
        if (task == null) {
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        if (request.getDescription() != null) task.setDescription(request.getDescription());

        return taskRepository.save(task);
    }

    public ProgressResponse computeProgress(Integer planId, Integer stageId, Integer taskId) {
        Stage stage = stageRepository.findStageByIdAndPlanId(stageId, planId);
        if (stage == null) {
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        Task task = taskRepository.findTaskByIdAndStageId(taskId, stageId);
        if (task == null) {
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        List<Subtask> subtasks = subtaskRepository.findAllSubtask(taskId);
        if (subtasks.isEmpty()) {
            return new ProgressResponse(
                    0,
                    task.getDuration(),
                    TimeStatus.NOT_STARTED
            );
        }

        LocalDateTime startedAt = subtasks.stream()
                .map(Subtask::getStarted_at)
                .filter(Objects::nonNull)
                .min(Comparator.naturalOrder())
                .orElse(null);

        if (startedAt == null) {
            return new ProgressResponse(
                    0,
                    task.getDuration(),
                    TimeStatus.NOT_STARTED
            );
        }

        LocalDateTime completedAt = subtasks.stream()
                .map(Subtask::getCompleted_at)
                .filter(Objects::nonNull)
                .max(Comparator.naturalOrder())
                .orElse(null);
        if (completedAt == null) {
            return new ProgressResponse(
                    0,
                    task.getDuration(),
                    TimeStatus.IN_PROGRESS
            );
        }

        long actualDuration = TimeCalculator.calculateActualDays(
                startedAt,
                completedAt
        );
        TimeStatus status;

        if (actualDuration < task.getDuration()) {
            status = TimeStatus.EARLY;
        } else if (actualDuration > task.getDuration()) {
            status = TimeStatus.LATE;
        } else {
            status = TimeStatus.ON_TIME;
        }
        return ProgressResponse.builder()
                .expectedDays(task.getDuration())
                .actualDays(actualDuration)
                .status(status)
                .build();
    }

    public Task startTask(Integer taskId) {
        Task task = taskRepository.findTaskById(taskId);
        if (task == null) {
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }
        task.setStarted_at(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public Task completeTask(Integer taskId) {
        Task task = taskRepository.findTaskById(taskId);
        if (task == null) {
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }
        task.setCompleted_at(LocalDateTime.now());
        return taskRepository.save(task);
    }
}
