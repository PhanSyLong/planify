package com.planify.backend.controller;

import com.planify.backend.dto.request.StageRequest;
import com.planify.backend.dto.response.ApiResponse;
import com.planify.backend.dto.response.StageResponse;
import com.planify.backend.dto.response.TimingResponse;
import com.planify.backend.mapper.StageMapper;
import com.planify.backend.model.Stage;
import com.planify.backend.service.StageService;
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
@RequestMapping("/stages")
public class StageController {
    StageService stageService;
    StageMapper stageMapper;

    @PostMapping
    ResponseEntity<ApiResponse<StageResponse>> addStage(@RequestBody StageRequest request){
        Stage stage = stageService.addStage(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<StageResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .result(stageMapper.toResponse(stage))
                        .build());
    }

    // New: DELETE /stages/plans/{planId}/{stageId} - delete a stage belonging to a plan
    @DeleteMapping("/plans/{planId}/{stageId}")
    ResponseEntity<ApiResponse<Void>> deleteStageByPlanAndStageId(@PathVariable Integer planId, @PathVariable Integer stageId){
        stageService.removeStageByPlanIdAndStageId(planId, stageId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.<Void>builder()
                        .code(HttpStatus.NO_CONTENT.value())
                        .message("Stage id " + stageId + " from plan " + planId + " removed")
                        .build());
    }

    // New: GET /plans/{planId}/stages - returns all stages for a given plan
    @GetMapping("/plans/{planId}/stages")
    ResponseEntity<ApiResponse<List<StageResponse>>> getStagesByPlan(@PathVariable Integer planId) {
        List<Stage> stages = stageService.getStagesByPlanId(planId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<StageResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(stageMapper.toResponseList(stages))
                        .build());
    }

    // New: GET /plans/{planId}/stages/{stageId} - returns a specific stage of a plan
    @GetMapping("/plans/{planId}/{stageId}")
    ResponseEntity<ApiResponse<StageResponse>> getStageByPlanAndStageId(@PathVariable Integer planId, @PathVariable Integer stageId) {
        Stage stage = stageService.getStageByPlanIdAndStageId(planId, stageId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<StageResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(stageMapper.toResponse(stage))
                        .build());
    }

    // New endpoint: timing for a stage
    @GetMapping("/plans/{planId}/{stageId}/timing")
    ResponseEntity<ApiResponse<TimingResponse>> getTimingForStage(@PathVariable Integer planId, @PathVariable Integer stageId) {
        TimingResponse timing = stageService.computeTimeStatus(planId, stageId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<TimingResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(timing)
                        .build());
    }
}
