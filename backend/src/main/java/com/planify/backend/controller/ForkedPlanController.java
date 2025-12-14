package com.planify.backend.controller;

import com.planify.backend.dto.request.ApiResponse;
import com.planify.backend.model.Plan;
import com.planify.backend.service.ForkedPlanService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@RestController
@RequestMapping
public class ForkedPlanController {
    ForkedPlanService forkedPlanService;

    @PostMapping("/plans/{planId}/fork")
    ResponseEntity<ApiResponse<Plan>> forkPlan(@PathVariable Integer planId) {
        Plan adoptedPlan = forkedPlanService.forkPlan(planId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<Plan>builder()
                        .code(HttpStatus.CREATED.value())
                        .message("Plan forked successfully")
                        .result(adoptedPlan)
                        .build());
    }

    @DeleteMapping("forked_plan")
    ResponseEntity<ApiResponse<Void>> deleteForkedPlan(@RequestParam Integer userId, @RequestParam Integer planId) {
        forkedPlanService.deleteForkedPlanRecord(userId, planId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.<Void>builder()
                        .code(HttpStatus.NO_CONTENT.value())
                        .build());
    }
}
