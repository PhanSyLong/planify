package com.planify.backend.controller;

import com.planify.backend.dto.request.StageRequest;
import com.planify.backend.dto.response.ApiResponse;
import com.planify.backend.dto.response.PlanResponse;
import com.planify.backend.dto.response.StageResponse;
import com.planify.backend.model.Stage;
import com.planify.backend.service.StageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.List;

@Slf4j
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@RestController
@RequestMapping("/plans/stage")
public class StageController {
    StageService stageService;
    private final RestClient.Builder builder;

    @PostMapping
    ResponseEntity<ApiResponse<PlanResponse>> addStage(@RequestBody StageRequest stageRequest) {
        Stage stage = stageService.addStage(stageRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<PlanResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .build());
    }

    @DeleteMapping("/{planId}/{stageId}")
    ResponseEntity<ApiResponse<PlanResponse>> deleteStage(@PathVariable Integer planId, @PathVariable Integer stageId) {
        stageService.removeStageById(stageId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.<PlanResponse>builder()
                        .code(HttpStatus.NO_CONTENT.value())
                        .build());
    }

    @GetMapping("/{planId}/{stageId}")
    ResponseEntity<ApiResponse<StageResponse>> getStageById(@PathVariable Integer planId, @PathVariable Integer stageId) {
        Stage stage = stageService.getStageById(stageId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<StageResponse>builder()
                        .code(HttpStatus.OK.value())
                        .build());
    }

    @GetMapping("/{planId}/stages")
    ResponseEntity<ApiResponse<List<StageResponse>>> getAllStages(@PathVariable Integer planId) {
        List<Stage> stages = stageService.getAllStages();

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<StageResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .build());
    }
}
