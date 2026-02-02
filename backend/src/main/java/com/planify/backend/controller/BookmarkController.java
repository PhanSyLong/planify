package com.planify.backend.controller;

import com.planify.backend.dto.response.ApiResponse;
import com.planify.backend.dto.response.PlanResponse;
import com.planify.backend.dto.response.UserResponse;
import com.planify.backend.mapper.PlanMapper;
import com.planify.backend.mapper.UserMapper;
import com.planify.backend.service.BookmarkService;
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
public class BookmarkController {
    BookmarkService bookmarkService;
    PlanMapper planMapper;
    UserMapper userMapper;

    @PostMapping("/plans/{planId}/bookmark")
    ResponseEntity<ApiResponse<Void>> bookmark(@PathVariable Integer planId) {
        bookmarkService.bookmark(planId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Void>builder()
                        .code(HttpStatus.OK.value())
                        .build());
    }

    @DeleteMapping("/plans/{planId}/bookmark")
    ResponseEntity<ApiResponse<Void>> removeBookmark(@PathVariable Integer planId) {
        bookmarkService.removeBookmark(planId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Void>builder()
                        .code(HttpStatus.OK.value())
                        .build());
    }

    @GetMapping("/users/{userId}/bookmarks")
    ResponseEntity<ApiResponse<List<PlanResponse>>> getBookmarkedPlans(@PathVariable Integer userId) {
        List<com.planify.backend.model.Plan> plans = bookmarkService.getBookmarkedPlans(userId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<PlanResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(planMapper.toResponseList(plans))
                        .build());
    }

    @GetMapping("/plans/{planId}/bookmarkers")
    ResponseEntity<ApiResponse<List<UserResponse>>> getBookmarkers(@PathVariable Integer planId) {
        List<com.planify.backend.model.User> users = bookmarkService.getBookmarkers(planId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<UserResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(userMapper.toUserResponseList(users))
                        .build());
    }
}
