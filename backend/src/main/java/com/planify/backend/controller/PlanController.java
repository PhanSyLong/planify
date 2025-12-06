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
@RequestMapping("/plans")
public class PlanController {
    PlanService planService;
    PlanMapper planMapper;

    @PostMapping
    ResponseEntity<ApiResponse<PlanResponse>> addPlan(@RequestBody PlanRequest request) {
        Plan plan = planService.addPlan(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<PlanResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .result(planMapper.toResponse(plan))
                        .build());
    }

    @DeleteMapping("/{planId}")
    ResponseEntity<ApiResponse<Void>> deletePlan(@PathVariable Integer planId) {
        planService.removePlanById(planId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.<Void>builder()
                        .code(HttpStatus.NO_CONTENT.value())
                        .message("Plan id " + planId + "removed")
                        .build());

    }

    @GetMapping("/{planId}")
    ResponseEntity<ApiResponse<PlanResponse>> getPlanById(@PathVariable("planId") Integer planId) {
        Plan plan = planService.getPlan(planId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<PlanResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(planMapper.toResponse(plan))
                        .build());
    }

    @GetMapping("/getall")
    ResponseEntity<ApiResponse<List<PlanResponse>>> getAllPlan() {
        List<Plan> plans = planService.getAllPlans();

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<PlanResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(planMapper.toResponseList(plans))
                        .build());
    }
}
