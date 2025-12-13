package com.planify.backend.service;

import com.planify.backend.dto.request.SubtaskRequest;
import com.planify.backend.dto.response.TimingResponse;
import com.planify.backend.exception.AppException;
import com.planify.backend.exception.ErrorCode;
import com.planify.backend.model.Subtask;
import com.planify.backend.model.Task;
import com.planify.backend.repository.SubtaskRepository;
import com.planify.backend.repository.TaskRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
public class SubtaskService {
    private TaskRepository taskRepository;
    private SubtaskRepository subtaskRepository;
    private TaskService taskService;

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

        return subtaskRepository.save(subtask);
    }

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

        subtaskRepository.delete(subtask);
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
            Subtask s = subtaskRepository.findById(id).orElse(null);
            if (s != null) results.add(s);
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
}
