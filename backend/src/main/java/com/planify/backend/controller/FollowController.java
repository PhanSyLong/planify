package com.planify.backend.controller;

import com.planify.backend.dto.response.ApiResponse;
import com.planify.backend.mapper.UserMapper;
import com.planify.backend.model.User;
import com.planify.backend.dto.response.UserResponse;
import com.planify.backend.service.FollowService;
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
public class FollowController {
    FollowService followService;
    UserMapper userMapper;

    @PostMapping("/{id}/follow/{targetId}")
    ResponseEntity<ApiResponse<String>> follow(@PathVariable Integer id, @PathVariable Integer targetId) {
        followService.follow(id, targetId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<String>builder()
                        .code(HttpStatus.CREATED.value())
                        .result("User " + id + " followed " + targetId)
                        .build());
    }

    @DeleteMapping("/{id}/unfollow/{targetId}")
    ResponseEntity<ApiResponse<String>> unfollow(@PathVariable Integer id, @PathVariable Integer targetId) {
        followService.unfollow(id, targetId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.<String>builder()
                        .code(HttpStatus.NO_CONTENT.value())
                        .result("User " + id + " followed " + targetId)
                        .build());
    }

    @GetMapping("/followers/{id}")
    ResponseEntity<ApiResponse<List<UserResponse>>> getFollowers(@PathVariable Integer id) {
        List<User> followers = followService.getFollowers(id);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<UserResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(userMapper.toUserResponseList(followers))
                        .build());
    }

    @GetMapping("/followings/{id}")
    ResponseEntity<ApiResponse<List<UserResponse>>> getFollowing(@PathVariable Integer id) {
        List<User> following = followService.getFollowing(id);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<UserResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(userMapper.toUserResponseList(following))
                        .build());
    }
}