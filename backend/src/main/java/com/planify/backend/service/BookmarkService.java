package com.planify.backend.service;

import com.planify.backend.model.Bookmark;
import com.planify.backend.model.Plan;
import com.planify.backend.model.User;
import com.planify.backend.repository.BookmarkRepository;
import com.planify.backend.repository.PlanRepository;
import com.planify.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
@Slf4j
public class BookmarkService {
    UserRepository userRepository;
    PlanRepository planRepository;
    BookmarkRepository bookmarkRepository;
    JwtUserContext jwtUserContext;

    public void bookmark(Integer planId) {
        Integer currentUserId = jwtUserContext.getCurrentUserId();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));

        Bookmark bookmark = new Bookmark();
        if (!bookmarkRepository.existsByUserIdAndPlanId(currentUserId, planId)) {
            bookmark.setUser(currentUser);
            bookmark.setPlan(plan);
            bookmarkRepository.save(bookmark);
        }
        log.info("Bookmark ID {} has been booked", planId);
    }

    @Transactional
    public void removeBookmark(Integer planId) {
        Integer currentUserId = jwtUserContext.getCurrentUserId();
        if (!bookmarkRepository.existsByUserIdAndPlanId(currentUserId, planId)) {
            return;
        }
        bookmarkRepository.deleteByUserIdAndPlanId(currentUserId, planId);
        log.info("Bookmark ID {} has been unbooked", planId);
    }

    public List<Plan> getBookmarkedPlans(Integer userId) {
        return bookmarkRepository.findPlanByUserId(userId);
    }

    public List<User> getBookmarkers(Integer planId) {
        return bookmarkRepository.findUserByPlanId(planId);
    }
}
