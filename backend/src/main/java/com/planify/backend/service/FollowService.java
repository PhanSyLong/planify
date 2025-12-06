package com.planify.backend.service;

import com.planify.backend.dto.request.NotificationRequest;
import com.planify.backend.model.Follow;
import com.planify.backend.model.User;
import com.planify.backend.repository.FollowRepository;
import com.planify.backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
public class FollowService {
     FollowRepository followRepository;
     UserRepository userRepository;
     NotificationService notificationService;

    @Transactional
    public void follow(Integer followerId, Integer followeeId) {
        if (followerId.equals(followeeId)) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }
        if (followRepository.existsByFollowerIdAndFollowingId(followerId, followeeId)) {
            return;
        }
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new EntityNotFoundException("Follower not found"));
        User followee = userRepository.findById(followeeId)
                .orElseThrow(() -> new EntityNotFoundException("Followee not found"));

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(followee);
        followRepository.save(follow);

        NotificationRequest notifRequest = NotificationRequest.builder()
                .recipientId(followee.getId())
                .messageText(follower.getUsername() + " has followed you on Planify!")
                .type("follower")
                .build();

        notificationService.sendEmailNotification(
                notifRequest,
                follower.getUsername() + " followed you");
    }

    @Transactional
    public void unfollow(Integer followerId, Integer followingId) {
        followRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Transactional
    public List<User> getFollowers(Integer userId) {
        return followRepository.findFollowersByUserId(userId);
    }

    @Transactional
    public List<User> getFollowing(Integer userId) {
        return followRepository.findFollowingByUserId(userId);
    }
}
