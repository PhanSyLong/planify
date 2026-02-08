package com.planify.backend.controller;

import com.planify.backend.dto.request.SubtaskRequest;
import com.planify.backend.dto.response.ApiResponse;
import com.planify.backend.dto.response.ProgressResponse;
import com.planify.backend.dto.response.SubtaskResponse;
import com.planify.backend.dto.response.TodoItemResponse;
import com.planify.backend.dto.request.SubtaskUpdateRequest;
import com.planify.backend.mapper.SubtaskMapper;
import com.planify.backend.model.Plan;
import com.planify.backend.model.Stage;
import com.planify.backend.model.Subtask;
import com.planify.backend.model.Task;
import com.planify.backend.service.SubtaskService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@RestController
@RequestMapping
public class SubtaskController {
    SubtaskService subtaskService;
    SubtaskMapper subtaskMapper;

    @PostMapping("/subtasks")
    ResponseEntity<ApiResponse<SubtaskResponse>> addSubtask(@RequestBody SubtaskRequest request) {
        Subtask subtask = subtaskService.addSubtask(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<SubtaskResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .result(subtaskMapper.toResponse(subtask))
                        .build());
    }

    @DeleteMapping("/plans/{planId}/{stageId}/{taskId}/{subtaskId}")
    ResponseEntity<ApiResponse<Void>> deleteSubtask(@PathVariable Integer planId, @PathVariable Integer stageId,
            @PathVariable Integer taskId, @PathVariable Integer subtaskId) {
        subtaskService.removeSubtask(subtaskId, taskId, stageId, planId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.<Void>builder()
                        .code(HttpStatus.NO_CONTENT.value())
                        .message("Subtask id " + subtaskId + " removed")
                        .build());
    }

    @GetMapping("/plans/{planId}/{stageId}/{taskId}/{subtaskId}")
    ResponseEntity<ApiResponse<SubtaskResponse>> getSubtaskById(@PathVariable Integer planId,
            @PathVariable Integer stageId, @PathVariable Integer taskId, @PathVariable Integer subtaskId) {
        Subtask subtask = subtaskService.getSubtaskById(subtaskId, taskId, stageId, planId);
        SubtaskResponse response = subtaskMapper.toResponse(subtask);
        if (subtask.getScheduledDate() != null) {
            long days = ChronoUnit.DAYS.between(LocalDate.now(), subtask.getScheduledDate());
            response.setDaysLeft((int) days);
        } else {
            response.setDaysLeft(null);
        }
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<SubtaskResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(response)
                        .build());
    }

    @GetMapping("/plans/{planId}/subtasks")
    ResponseEntity<ApiResponse<List<SubtaskResponse>>> getSubtasksByPlanId(@PathVariable Integer planId) {
        List<Subtask> subtasks = subtaskService.getSubtasksByPlanId(planId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<SubtaskResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(subtaskMapper.toResponseList(subtasks))
                        .build());
    }

    @GetMapping("/plans/{planId}/{stageId}/{taskId}/subtasks")
    ResponseEntity<ApiResponse<List<SubtaskResponse>>> getAllSubtasks(@PathVariable Integer planId,
            @PathVariable Integer stageId, @PathVariable Integer taskId) {
        List<Subtask> subtasks = subtaskService.getAllSubtasks(taskId, stageId, planId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<SubtaskResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(subtaskMapper.toResponseList(subtasks))
                        .build());
    }

    // New endpoint: todo list (incomplete subtasks ordered by days left)
    @GetMapping("/users/{userId}/todo")
    ResponseEntity<ApiResponse<List<TodoItemResponse>>> getTodoList(@PathVariable Integer userId) {
        List<Subtask> subtasks = subtaskService.getTodoList(userId);
        LocalDate today = LocalDate.now();

        List<TodoItemResponse> responses = subtasks.stream().map(s -> {
            // Traverse the entity chain to get plan info
            Task task = s.getTask_id();
            Stage stage = task != null ? task.getStage_id() : null;
            Plan plan = stage != null ? stage.getPlan_id() : null;

            Integer daysLeft = null;
            if (s.getScheduledDate() != null) {
                long days = ChronoUnit.DAYS.between(today, s.getScheduledDate().toLocalDate());
                daysLeft = (int) days;
            }

            return TodoItemResponse.builder()
                    .subtaskId(s.getId())
                    .taskId(task != null ? task.getId() : null)
                    .title(s.getTitle())
                    .description(s.getDescription())
                    .duration(s.getDuration())
                    .status(s.getStatus())
                    .daysLeft(daysLeft)
                    .scheduledDate(s.getScheduledDate())
                    .startedAt(s.getStarted_at())
                    .planId(plan != null ? plan.getId() : null)
                    .planTitle(plan != null ? plan.getTitle() : null)
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<TodoItemResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(responses)
                        .build());
    }

    // New: PATCH endpoint to partially update a subtask (propagates duration
    // changes)
    @PatchMapping("/subtasks/{subtaskId}")
    ResponseEntity<ApiResponse<SubtaskResponse>> updateSubtaskPartial(@PathVariable Integer subtaskId,
            @RequestBody SubtaskUpdateRequest request) {
        Subtask updated = subtaskService.updateSubtaskPartial(subtaskId, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<SubtaskResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(subtaskMapper.toResponse(updated))
                        .build());
    }

    @GetMapping("/plans/{planId}/{stageId}/{taskId}/{subtaskId}/progress")
    ResponseEntity<ApiResponse<ProgressResponse>> getSubtaskProgress(@PathVariable Integer planId,
            @PathVariable Integer stageId, @PathVariable Integer taskId, @PathVariable Integer subtaskId) {
        ProgressResponse progress = subtaskService.computeProgress(planId, stageId, taskId, subtaskId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<ProgressResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(progress)
                        .build());
    }

    @PatchMapping("/subtasks/{subtaskId}/start")
    ResponseEntity<ApiResponse<SubtaskResponse>> startSubtask(@PathVariable Integer subtaskId) {
        Subtask subtask = subtaskService.startSubtask(subtaskId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<SubtaskResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(subtaskMapper.toResponse(subtask))
                        .build());
    }

    @PatchMapping("/subtasks/{subtaskId}/complete")
    ResponseEntity<ApiResponse<SubtaskResponse>> completeSubtask(@PathVariable Integer subtaskId) {
        Subtask subtask = subtaskService.completeSubtask(subtaskId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<SubtaskResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(subtaskMapper.toResponse(subtask))
                        .build());
    }
}
