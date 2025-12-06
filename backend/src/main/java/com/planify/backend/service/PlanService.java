package com.planify.backend.service;

import com.planify.backend.dto.request.PlanRequest;
import com.planify.backend.model.Plan;
import com.planify.backend.repository.PlanRepository;
import com.planify.backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
public class PlanService {
    PlanRepository planRepository;
    UserRepository userRepository;

    public Plan addPlan(PlanRequest request) {
        Plan plan = new Plan();
        plan.setTitle(request.getTitle());
        plan.setDescription(request.getDescription());
        plan.setVisibility(request.getVisibility());
        plan.setStatus(request.getStatus());
        plan.setDuration(request.getDuration());
        plan.setPicture(request.getPicture());

        plan.setOwner(userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found")));
        return planRepository.save(plan);
    }

    public void removePlanById(Integer planId) {
        planRepository.deleteById(planId);
    }

    public Plan getPlan(Integer planId) {
        return planRepository.findPlanById(planId);
    }

    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }
}
