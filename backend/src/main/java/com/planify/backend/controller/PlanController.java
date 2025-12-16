package com.planify.backend.controller;

import com.planify.backend.dto.request.PlanRequest;
import com.planify.backend.dto.request.PlanUpdateRequest;
import com.planify.backend.dto.response.ApiResponse;
import com.planify.backend.dto.response.PlanResponse;
import com.planify.backend.dto.response.TimingResponse;
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
import java.util.stream.Collectors;

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

        // Map and set computed fields
        PlanResponse resp = planMapper.toResponse(plan);
        resp.setExpectedTime(planService.computeExpectedTime(plan.getId()));
        resp.setActualTime(planService.computeActualTime(plan.getId()));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<PlanResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .result(resp)
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

        PlanResponse resp = planMapper.toResponse(plan);
        resp.setExpectedTime(planService.computeExpectedTime(planId));
        resp.setActualTime(planService.computeActualTime(planId));

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<PlanResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(resp)
                        .build());
    }

    @GetMapping("/getall")
    ResponseEntity<ApiResponse<List<PlanResponse>>> getAllPlan() {
        List<Plan> plans = planService.getAllPlans();

        List<PlanResponse> responses = planMapper.toResponseList(plans).stream().peek(r -> {
            r.setExpectedTime(planService.computeExpectedTime(r.getId()));
            r.setActualTime(planService.computeActualTime(r.getId()));
        }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<PlanResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(responses)
                        .build());
    }

    // New endpoint: timing status
    @GetMapping("/{planId}/timing")
    ResponseEntity<ApiResponse<TimingResponse>> getTiming(@PathVariable("planId") Integer planId) {
        TimingResponse timing = planService.computeTimeStatus(planId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<TimingResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(timing)
                        .build());
    }
}
