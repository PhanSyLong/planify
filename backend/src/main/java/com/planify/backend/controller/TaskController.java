package com.planify.backend.controller;

import com.planify.backend.dto.request.TaskRequest;
import com.planify.backend.dto.response.ApiResponse;
import com.planify.backend.dto.response.ProgressResponse;
import com.planify.backend.dto.response.TaskResponse;
import com.planify.backend.mapper.TaskMapper;
import com.planify.backend.model.Task;
import com.planify.backend.service.TaskService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@RestController
@RequestMapping
public class TaskController {
    TaskService taskService;
    TaskMapper taskMapper;

    @PostMapping("/tasks")
    ResponseEntity<ApiResponse<TaskResponse>> addTask(@RequestBody TaskRequest request){
        Task task = taskService.addTask(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<TaskResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .result(taskMapper.toResponse(task))
                        .build());
    }

    @DeleteMapping("/plans/{planId}/{stageId}/{taskId}")
    ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Integer planId, @PathVariable Integer stageId, @PathVariable Integer taskId){
        taskService.removeTask(taskId, stageId, planId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.<Void>builder()
                        .code(HttpStatus.NO_CONTENT.value())
                        .message("Task id " + taskId + " removed")
                        .build());
    }

    @GetMapping("/plans/{planId}/{stageId}/{taskId}")
    ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Integer planId, @PathVariable Integer stageId, @PathVariable Integer taskId){
        Task task = taskService.getTaskByIdAndStageId(taskId, stageId, planId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<TaskResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(taskMapper.toResponse(task))
                        .build());
    }

    @GetMapping("/plans/{planId}/tasks")
    ResponseEntity<ApiResponse<List<TaskResponse>>> getTasksByPlanId(@PathVariable Integer planId){
        List<Task> tasks = taskService.getTasksByPlanId(planId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<TaskResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(taskMapper.toResponseList(tasks))
                        .build());
    }

    @GetMapping("/plans/{planId}/{stageId}/tasks")
    ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks(@PathVariable Integer planId, @PathVariable Integer stageId){
        List<Task> tasks = taskService.getAllTasksByStageId(stageId, planId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<TaskResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(taskMapper.toResponseList(tasks))
                        .build());
    }


    @PatchMapping("/tasks/{taskId}")
    ResponseEntity<ApiResponse<TaskResponse>> updateTaskPartial(@PathVariable Integer taskId, @RequestBody com.planify.backend.dto.request.TaskUpdateRequest request) {
        Task updated = taskService.updateTaskPartial(taskId, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<TaskResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(taskMapper.toResponse(updated))
                        .build());
    }

    @GetMapping("/plans/{planId}/{stageId}/{taskId}/progress")
    ResponseEntity<ApiResponse<ProgressResponse>> getTaskProgress(@PathVariable Integer planId, @PathVariable Integer stageId, @PathVariable Integer taskId) {
        ProgressResponse progress = taskService.computeProgress(planId, stageId, taskId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<ProgressResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(progress)
                        .build());
    }

    @PatchMapping("/tasks/{taskId}/start")
    ResponseEntity<ApiResponse<TaskResponse>> startTask(@PathVariable Integer taskId) {
        Task task = taskService.startTask(taskId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<TaskResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(taskMapper.toResponse(task))
                        .build());
    }

    @PatchMapping("/tasks/{taskId}/complete")
    ResponseEntity<ApiResponse<TaskResponse>> completeTask(@PathVariable Integer taskId) {
        Task task = taskService.completeTask(taskId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<TaskResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(taskMapper.toResponse(task))
                        .build());
    }
}
