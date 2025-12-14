package com.planify.backend.service;

import com.planify.backend.model.LikedPlan;
import com.planify.backend.model.Plan;
import com.planify.backend.model.User;
import com.planify.backend.repository.LikedPlanRepository;
import com.planify.backend.repository.PlanRepository;
import com.planify.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
public class LikedPlanService {
    UserRepository userRepository;
    PlanRepository planRepository;
    LikedPlanRepository likedPlanRepository;
    JwtUserContext jwtUserContext;

    public void likePlan(Integer planId) {
        Integer currentUserId = jwtUserContext.getCurrentUserId();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));

        LikedPlan likedPlan = new LikedPlan();
        if (!likedPlanRepository.existsByUserIdAndPlanId(currentUserId, planId)) {
            likedPlan.setUser(currentUser);
            likedPlan.setPlan(plan);
        }

        likedPlanRepository.save(likedPlan);
    }

    @Transactional
    public void unlikePlan(Integer planId) {
        Integer currentUserId = jwtUserContext.getCurrentUserId();
        if (!likedPlanRepository.existsByUserIdAndPlanId(currentUserId, planId)) {
            return;
        }
        likedPlanRepository.deleteByUserIdAndPlanId(currentUserId, planId);
    }

    public List<Plan> getLikedPlans(Integer userId) {
        return likedPlanRepository.findPlanByUserId(userId);
    }

    public List<User> getLikers(Integer planId) {
        return likedPlanRepository.findUserByPlanId(planId);
    }
}
