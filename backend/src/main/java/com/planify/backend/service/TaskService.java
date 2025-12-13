package com.planify.backend.service;

import com.planify.backend.dto.request.TaskRequest;
import com.planify.backend.exception.AppException;
import com.planify.backend.exception.ErrorCode;
import com.planify.backend.model.Task;
import com.planify.backend.model.Stage;
import com.planify.backend.repository.StageRepository;
import com.planify.backend.repository.TaskRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
public class TaskService {
    private StageRepository stageRepository;
    private TaskRepository taskRepository;

    public Task addTask(TaskRequest taskRequest){
        // Lookup stage by id (TaskRequest doesn't contain planId)
        Stage stage = stageRepository.findStageById(taskRequest.getStageId());
        if (stage == null) {
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }

        Task task = new Task();
        task.setDescription(taskRequest.getDescription());
        task.setDuration(taskRequest.getDuration());
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

        return task_repository_findTaskByIdAndStageId_suppressed(taskId, stageId);
    }

    // Helper to work around method name conflict in patch: call repository properly
    private Task task_repository_findTaskByIdAndStageId_suppressed(Integer taskId, Integer stageId) {
        return taskRepository.findTaskByIdAndStageId(taskId, stageId);
    }
}
