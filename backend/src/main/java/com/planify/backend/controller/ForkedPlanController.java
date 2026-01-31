package com.planify.backend.controller;

import com.planify.backend.dto.request.ApiResponse;
import com.planify.backend.dto.response.ForkedPlanResponse;
import com.planify.backend.dto.response.PlanResponse;
import com.planify.backend.mapper.ForkedPlanMapper;
import com.planify.backend.mapper.PlanMapper;
import com.planify.backend.model.ForkedPlan;
import com.planify.backend.model.Plan;
import com.planify.backend.service.ForkedPlanService;
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
public class ForkedPlanController {
    ForkedPlanService forkedPlanService;
    PlanMapper planMapper;
    private final ForkedPlanMapper forkedPlanMapper;

    @PostMapping("/plans/{planId}/fork")
    ResponseEntity<ApiResponse<PlanResponse>> forkPlan(@PathVariable Integer planId) {
        Plan adoptedPlan = forkedPlanService.forkPlan(planId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<PlanResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .result(planMapper.toResponse(adoptedPlan))
                        .build());
    }

    @PostMapping("/plans/{originalPlanId}/fork_to/{adoptedPlanId}")
    ResponseEntity<ApiResponse<ForkedPlanResponse>> addForkRecord(@PathVariable Integer originalPlanId, @PathVariable Integer adoptedPlanId) {
        ForkedPlan forkedPlan = forkedPlanService.addForkRecord(originalPlanId, adoptedPlanId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<ForkedPlanResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .result(forkedPlanMapper.toResponse(forkedPlan))
                        .build());
    }

    // This removes a fork_plan entry, not unforking
    @DeleteMapping("forked_plan")
    ResponseEntity<ApiResponse<Void>> deleteForkedPlan(@RequestParam Integer userId, @RequestParam Integer planId) {
        forkedPlanService.deleteForkedPlanRecord(userId, planId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.<Void>builder()
                        .code(HttpStatus.NO_CONTENT.value())
                        .build());
    }

    @GetMapping("plans/{planId}/forks")
    ResponseEntity<ApiResponse<List<PlanResponse>>> getPlanForks(@PathVariable Integer planId) {
        List<Plan> forks = forkedPlanService.getForks(planId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<PlanResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(planMapper.toResponseList(forks))
                        .build());
    }

    @GetMapping("plans/{planId}/fork_origin")
    ResponseEntity<ApiResponse<PlanResponse>> getOriginalPlan(@PathVariable Integer planId) {
        Plan original = forkedPlanService.getOriginalPlan(planId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<PlanResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(planMapper.toResponse(original))
                        .build());
    }
}
