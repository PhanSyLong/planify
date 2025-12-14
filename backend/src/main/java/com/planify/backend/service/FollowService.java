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
     JwtUserContext jwtUserContext;

    @Transactional
    public void follow(Integer followeeId) {
        Integer currentUserId = jwtUserContext.getCurrentUserId();
        if (currentUserId.equals(followeeId)) {
            throw new IllegalArgumentException("Cannot follow yourself!");
        }
        if (followRepository.existsByFollowerIdAndFollowingId(currentUserId, followeeId)) {
            return;
        }
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found!"));
        User followee = userRepository.findById(followeeId)
                .orElseThrow(() -> new EntityNotFoundException("Followee not found!"));

        Follow follow = new Follow();
        follow.setFollower(currentUser);
        follow.setFollowing(followee);
        followRepository.save(follow);

        NotificationRequest notifRequest = NotificationRequest.builder()
                .recipientId(followee.getId())
                .messageText(currentUser.getUsername() + " has followed you on Planify!")
                .type("follower")
                .build();

        notificationService.sendEmailNotification(
                notifRequest,
                currentUser.getUsername() + " followed you");
    }

    @Transactional
    public void unfollow(Integer followeeId) {
        Integer currentUserId = jwtUserContext.getCurrentUserId();
        followRepository.deleteByFollowerIdAndFollowingId(currentUserId, followeeId);
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
