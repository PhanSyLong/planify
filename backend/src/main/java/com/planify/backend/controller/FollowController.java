package com.planify.backend.controller;

import com.planify.backend.model.User;
import com.planify.backend.dto.UserDto;
import com.planify.backend.service.FollowService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/follows")
public class FollowController {
    private final FollowService followService;

    @PostMapping("{id}/follow/{targetId}")
    public ResponseEntity<@NonNull String> follow(@PathVariable Integer id, @PathVariable Integer targetId) {
        followService.follow(id, targetId);
        return ResponseEntity.ok("User " + id + " followed " + targetId);
    }

    @DeleteMapping("{id}/unfollow/{targetId}")
    public ResponseEntity<@NonNull String> unfollow(@PathVariable Integer id, @PathVariable Integer targetId) {
        followService.unfollow(id, targetId);
        return ResponseEntity.ok("User " + id + " unfollowed " + targetId);
    }

    @GetMapping("{id}/followers")
    public ResponseEntity<@NonNull List<UserDto>> getFollowers(@PathVariable Integer id) {
        List<User> followers = followService.getFollowers(id);
        List<UserDto> dtos = followers.stream().map(UserDto::from).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("{id}/followings")
    public ResponseEntity<@NonNull List<UserDto>> getFollowing(@PathVariable Integer id) {
        List<User> following = followService.getFollowing(id);
        List<UserDto> dtos = following.stream().map(UserDto::from).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}