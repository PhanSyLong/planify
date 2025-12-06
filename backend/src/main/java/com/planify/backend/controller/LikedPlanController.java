package com.planify.backend.controller;

import com.planify.backend.dto.response.ApiResponse;
import com.planify.backend.dto.response.PlanResponse;
import com.planify.backend.dto.response.UserResponse;
import com.planify.backend.mapper.PlanMapper;
import com.planify.backend.mapper.UserMapper;
import com.planify.backend.service.LikedPlanService;
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
public class LikedPlanController {
    LikedPlanService likedPlanService;
    PlanMapper planMapper;
    UserMapper userMapper;

    @PostMapping("/{userId}/like/{planId}")
    ResponseEntity<ApiResponse<String>> likePlan(@PathVariable Integer userId, @PathVariable Integer planId) {
        likedPlanService.likePlan(userId, planId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<String>builder()
                        .code(HttpStatus.CREATED.value())
                        .result("User Id " + userId + " liked " + "plan Id " + planId)
                        .build());
    }

    @DeleteMapping("/{userId}/unlike/{planId}")
    ResponseEntity<ApiResponse<String>> unlikePlan(@PathVariable Integer userId, @PathVariable Integer planId) {
        likedPlanService.unlikePlan(userId, planId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.<String>builder()
                        .code(HttpStatus.NO_CONTENT.value())
                        .result("User Id " + userId + " unliked " + "plan Id " + planId)
                        .build());
    }

    @GetMapping("/likedplans/{userId}")
    ResponseEntity<ApiResponse<List<PlanResponse>>> getLikedPlans(@PathVariable Integer userId) {
        List<com.planify.backend.model.Plan> plans = likedPlanService.getLikedPlans(userId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<PlanResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(planMapper.toResponseList(plans))
                        .build());
    }

    @GetMapping("/likers/{planId}")
    ResponseEntity<ApiResponse<List<UserResponse>>> getLikers(@PathVariable Integer planId) {
        List<com.planify.backend.model.User> users = likedPlanService.getLikers(planId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<UserResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(userMapper.toUserResponseList(users))
                        .build());
    }
}
