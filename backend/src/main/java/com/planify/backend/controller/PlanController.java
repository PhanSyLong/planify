package com.planify.backend.controller;

import com.planify.backend.dto.request.PlanRequest;
import com.planify.backend.dto.request.PlanUpdateRequest;
import com.planify.backend.dto.response.ApiResponse;
import com.planify.backend.dto.response.PlanResponse;
import com.planify.backend.dto.response.ProgressResponse;
import com.planify.backend.mapper.PlanMapper;
import com.planify.backend.model.Plan;
import com.planify.backend.service.PlanService;
import com.planify.backend.service.TagService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@RestController
@RequestMapping
public class PlanController {
        PlanService planService;
        PlanMapper planMapper;
        TagService tagService;

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
                        .build());
    }

        @GetMapping("/plans/{planId}")
        ResponseEntity<ApiResponse<PlanResponse>> getPlanById(@PathVariable Integer planId) {
                Plan plan = planService.getPlanById(planId);

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

    @GetMapping("/plans/filter")
    ResponseEntity<ApiResponse<List<PlanResponse>>> filterPlans(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) List<String> tags
    ) {
        List<Plan> results = planService.filterPlans(query, tags);

        return ResponseEntity.ok(
                ApiResponse.<List<PlanResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(planMapper.toResponseList(results))
                        .build()
        );
    }


        @PatchMapping("/plans/{planId}")
        ResponseEntity<ApiResponse<PlanResponse>> updatePlanPartial(@PathVariable Integer planId,
                        @RequestBody PlanUpdateRequest request) {
                Plan updated = planService.updatePlanPartial(planId, request);
                PlanResponse resp = planMapper.toResponse(updated);

                return ResponseEntity.status(HttpStatus.OK)
                                .body(ApiResponse.<PlanResponse>builder()
                                                .code(HttpStatus.OK.value())
                                                .result(resp)
                                                .build());
        }

        @GetMapping("/plans/{planId}/progress")
        ResponseEntity<ApiResponse<ProgressResponse>> getPlanProgress(@PathVariable Integer planId) {
                ProgressResponse progress = planService.computeProgress(planId);
                return ResponseEntity.status(HttpStatus.OK)
                                .body(ApiResponse.<ProgressResponse>builder()
                                                .code(HttpStatus.OK.value())
                                                .result(progress)
                                                .build());
        }

        @PatchMapping("/plans/{planId}/start")
        ResponseEntity<ApiResponse<PlanResponse>> startPlan(@PathVariable Integer planId) {
                Plan plan = planService.startPlan(planId);
                return ResponseEntity.status(HttpStatus.OK)
                                .body(ApiResponse.<PlanResponse>builder()
                                                .code(HttpStatus.OK.value())
                                                .result(planMapper.toResponse(plan))
                                                .build());
        }

        @PatchMapping("/plans/{planId}/complete")
        ResponseEntity<ApiResponse<PlanResponse>> completePlan(@PathVariable Integer planId) {
                Plan plan = planService.completePlan(planId);
                return ResponseEntity.status(HttpStatus.OK)
                                .body(ApiResponse.<PlanResponse>builder()
                                                .code(HttpStatus.OK.value())
                                                .result(planMapper.toResponse(plan))
                                                .build());
        }

        // ===== TAG ENDPOINTS =====

        /**
         * Get all available tags grouped by category
         */
        @GetMapping("/plans/tags")
        ResponseEntity<ApiResponse<Map<String, List<String>>>> getAllTags() {
                Map<String, List<String>> tags = tagService.getAllTagsGrouped();
                return ResponseEntity.status(HttpStatus.OK)
                                .body(ApiResponse.<Map<String, List<String>>>builder()
                                                .code(HttpStatus.OK.value())
                                                .result(tags)
                                                .build());
        }

        /**
         * Get tags for a specific plan
         */
        @GetMapping("/plans/{planId}/tags")
        ResponseEntity<ApiResponse<List<String>>> getTagsForPlan(@PathVariable Integer planId) {
                List<String> tags = tagService.getTagsByPlanId(planId);
                return ResponseEntity.status(HttpStatus.OK)
                                .body(ApiResponse.<List<String>>builder()
                                                .code(HttpStatus.OK.value())
                                                .result(tags)
                                                .build());
        }

        /**
         * Set/update tags for a plan (replaces existing tags)
         */
        @PutMapping("/plans/{planId}/tags")
        ResponseEntity<ApiResponse<List<String>>> setTagsForPlan(
                        @PathVariable Integer planId,
                        @RequestBody List<String> tagNames) {
                List<String> savedTags = tagService.setTagsForPlan(planId, tagNames);
                return ResponseEntity.status(HttpStatus.OK)
                                .body(ApiResponse.<List<String>>builder()
                                                .code(HttpStatus.OK.value())
                                                .message("Tags updated successfully")
                                                .result(savedTags)
                                                .build());
        }
}
