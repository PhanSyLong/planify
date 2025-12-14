package com.planify.backend.controller;

import com.planify.backend.dto.request.PlanRequest;
import com.planify.backend.dto.response.ApiResponse;
import com.planify.backend.dto.response.PlanResponse;
import com.planify.backend.mapper.PlanMapper;
import com.planify.backend.model.Plan;
import com.planify.backend.service.PlanService;
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
public class PlanController {
    PlanService planService;
    PlanMapper planMapper;

    @PostMapping("/plans")
    ResponseEntity<ApiResponse<PlanResponse>> addPlan(@RequestBody PlanRequest request) {
        Plan plan = planService.addPlan(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<PlanResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .result(planMapper.toResponse(plan))
                        .build());
    }

    @DeleteMapping("/plans/{planId}")
    ResponseEntity<ApiResponse<Void>> deletePlan(@PathVariable Integer planId) {
        planService.deletePlanById(planId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Void>builder()
                        .code(HttpStatus.OK.value())
                        .message("Plan removed successfully")
                        .build());
    }

    @GetMapping("/plans/{planId}")
    ResponseEntity<ApiResponse<PlanResponse>> getPlanById(@PathVariable("planId") Integer planId) {
        Plan plan = planService.getPlanById(planId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<PlanResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(planMapper.toResponse(plan))
                        .build());
    }

    @GetMapping("/plans/{planTitle}")
    ResponseEntity<ApiResponse<PlanResponse>> getPlanByName(@PathVariable("planTitle") String planTitle) {
        Plan plan = planService.getPlanByName(planTitle);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<PlanResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(planMapper.toResponse(plan))
                        .build());
    }

    @GetMapping("/users/{userId}/plans")
    ResponseEntity<ApiResponse<List<PlanResponse>>> getPlanFromUser(@PathVariable Integer userId) {
        List<Plan> plans = planService.getPlanByUser(userId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<PlanResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(planMapper.toResponseList(plans))
                        .build());
    }

    @GetMapping("/plans")
    ResponseEntity<ApiResponse<List<PlanResponse>>> getAllPlan() {
        List<Plan> plans = planService.getAllPlans();

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<PlanResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(planMapper.toResponseList(plans))
                        .build());
    }

    @PatchMapping("/plans/{planId}")
    ResponseEntity<ApiResponse<PlanResponse>> updatePlan(@PathVariable Integer planId, @RequestBody PlanRequest request) {
        Plan plan = planService.updatePlan(planId, request);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<PlanResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(planMapper.toResponse(plan))
                        .build());
    }
}
