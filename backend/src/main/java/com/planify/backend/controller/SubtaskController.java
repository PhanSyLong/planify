package com.planify.backend.controller;

import com.planify.backend.dto.request.SubtaskRequest;
import com.planify.backend.dto.response.ApiResponse;
import com.planify.backend.dto.response.SubtaskResponse;
import com.planify.backend.mapper.SubtaskMapper;
import com.planify.backend.model.Subtask;
import com.planify.backend.service.SubtaskService;
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
@RequestMapping("/subtasks")
public class SubtaskController {
    SubtaskService subtaskService;
    SubtaskMapper subtaskMapper;

    @PostMapping
    ResponseEntity<ApiResponse<SubtaskResponse>> addSubtask(@RequestBody SubtaskRequest request){
        Subtask subtask = subtaskService.addSubtask(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<SubtaskResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .result(subtaskMapper.toResponse(subtask))
                        .build());
    }

    @DeleteMapping("/plans/{planId}/{stageId}/{taskId}/{subtaskId}")
    ResponseEntity<ApiResponse<Void>> deleteSubtask(@PathVariable Integer planId, @PathVariable Integer stageId, @PathVariable Integer taskId, @PathVariable Integer subtaskId){
        subtaskService.removeSubtask(subtaskId, taskId, stageId, planId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.<Void>builder()
                        .code(HttpStatus.NO_CONTENT.value())
                        .message("Subtask id " + subtaskId + " removed")
                        .build());
    }

    @GetMapping("/plans/{planId}/{stageId}/{taskId}/{subtaskId}")
    ResponseEntity<ApiResponse<SubtaskResponse>> getSubtaskById(@PathVariable Integer planId, @PathVariable Integer stageId, @PathVariable Integer taskId, @PathVariable Integer subtaskId){
        Subtask subtask = subtaskService.getSubtaskById(subtaskId, taskId, stageId, planId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<SubtaskResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(subtaskMapper.toResponse(subtask))
                        .build());
    }

    @GetMapping("/plans/{planId}/{stageId}/{taskId}/subtasks")
    ResponseEntity<ApiResponse<List<SubtaskResponse>>> getAllSubtasks(@PathVariable Integer planId, @PathVariable Integer stageId, @PathVariable Integer taskId){
        List<Subtask> subtasks = subtaskService.getAllSubtasks(taskId, stageId, planId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<SubtaskResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(subtaskMapper.toResponseList(subtasks))
                        .build());
    }
}
