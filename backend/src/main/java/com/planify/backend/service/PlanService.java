package com.planify.backend.service;

import com.planify.backend.dto.request.PlanRequest;
import com.planify.backend.mapper.PlanMapper;
import com.planify.backend.model.Plan;
import com.planify.backend.repository.PlanRepository;
import com.planify.backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
public class PlanService {
    PlanRepository planRepository;
    UserRepository userRepository;
    PlanMapper planMapper;
    JwtUserContext jwtUserContext;

    public Plan addPlan(PlanRequest request) {
        Plan plan = new Plan();
        plan.setTitle(request.getTitle());
        plan.setDescription(request.getDescription());
        plan.setVisibility(request.getVisibility());
        plan.setStatus(request.getStatus());
        plan.setDuration(request.getDuration());
        plan.setPicture(request.getPicture());

        plan.setOwner(userRepository.findById(jwtUserContext.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Owner not found")));
        return planRepository.save(plan);
    }

    public void deletePlanById(Integer planId) {
        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        if (jwtUserContext.neitherPlanOwnerNorAdmin(plan)){
            throw new AccessDeniedException("You are not allowed to delete this plan");
        }
        planRepository.deleteById(planId);
    }

    public Plan updatePlan(Integer planId, PlanRequest request) {
        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        boolean isOwner = plan.getOwner().getId().equals(jwtUserContext.getCurrentUserId());
        if (!isOwner) {
            throw new AccessDeniedException("You are not allowed to update this plan");
        }

        planMapper.updatePlan(request, plan);
        return planRepository.save(plan);
    }

    public Plan getPlanById(Integer planId) {
        Plan plan = planRepository.findPlanById(planId);
        boolean isPublic = "public".equals(plan.getVisibility());

        if (!isPublic && jwtUserContext.neitherPlanOwnerNorAdmin(plan)) {
            // Hide the plan completely
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found");
        }
        return plan;
    }

    public Plan getPlanByName(String name) {
        Plan plan = planRepository.findPlanByName(name);
        boolean isPublic = "public".equals(plan.getVisibility());

        if (!isPublic && jwtUserContext.neitherPlanOwnerNorAdmin(plan)) {
            // Hide the plan completely
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found");
        }
        return plan;
    }

    public List<Plan> getPlanByUser(Integer userId) {
        List<Plan> plans = planRepository.findPlanByUserId(userId);
        return plans.stream()
                .filter(plan -> {
                    boolean isPublic = "public".equals(plan.getVisibility());
                    return isPublic || !jwtUserContext.neitherPlanOwnerNorAdmin(plan);
                })
                .collect(Collectors.toList());
    }

    public List<Plan> getAllPlans() {
        List<Plan> plans = planRepository.findAll();
        return plans.stream()
                .filter(plan -> {
                    boolean isPublic = "public".equals(plan.getVisibility());
                    return isPublic || !jwtUserContext.neitherPlanOwnerNorAdmin(plan);
                })
                .collect(Collectors.toList());
    }
}
