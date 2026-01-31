package com.planify.backend.service;

import com.planify.backend.dto.request.PlanRequest;
import com.planify.backend.mapper.PlanMapper;
import com.planify.backend.model.ForkedPlan;
import com.planify.backend.model.Plan;
import com.planify.backend.model.User;
import com.planify.backend.repository.ForkedPlanRepository;
import com.planify.backend.repository.PlanRepository;
import com.planify.backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
public class ForkedPlanService {
    ForkedPlanRepository forkedPlanRepository;
    UserRepository userRepository;
    PlanRepository planRepository;
    PlanMapper planMapper;
    PlanService planService;
    JwtUserContext jwtUserContext;

    public Plan forkPlan(Integer planId) {
        Integer currentUserId = jwtUserContext.getCurrentUserId();
        User currentUser =  userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Plan originalPlan =  planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found!"));

        if (originalPlan.getOwner().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You cannot fork your own plan!");
        }

        if (!"public".equals(originalPlan.getVisibility())){
            throw new AccessDeniedException("You do not have permission to fork this plan!");
        }

        PlanRequest adoptedPlanRequest = planMapper.toRequest(originalPlan);
        Plan adoptedPlan = planService.addPlan(adoptedPlanRequest);

        addForkRecord(planId, adoptedPlan.getId());
        return adoptedPlan;
    }

    public ForkedPlan addForkRecord(Integer originalPlanId, Integer adoptedPlanId) {
        ForkedPlan forkedPlan = new ForkedPlan();

        Plan originalPlan = planRepository.findById(originalPlanId)
                .orElseThrow(() -> new RuntimeException("Original plan not found!"));
        Plan adoptedPlan = planRepository.findById(adoptedPlanId)
                .orElseThrow(() -> new RuntimeException("Adopted plan not found!"));
        User adopter = userRepository.findById(jwtUserContext.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        forkedPlan.setOriginalPlan(originalPlan);
        forkedPlan.setAdoptedPlan(adoptedPlan);
        forkedPlan.setAdopter(adopter);
        return forkedPlanRepository.save(forkedPlan);
    }

    public List<Plan> getForks(Integer originalPlanId) {
        return forkedPlanRepository.findPlanForksByOriginalPlanId(originalPlanId)
                .stream().filter(plan -> {
                    boolean isPublic = "public".equals(plan.getVisibility());
                    return isPublic || !jwtUserContext.neitherPlanOwnerNorAdmin(plan);
                })
                .collect(Collectors.toList());
    }

    public Plan getOriginalPlan(Integer planId) {
        Plan originalPlan = forkedPlanRepository.findOriginalPlanByAdoptedPlanId(planId);
        if (originalPlan == null) {
            return null;
        }

        if (!"public".equals(originalPlan.getVisibility()) && jwtUserContext.neitherPlanOwnerNorAdmin(originalPlan)) {
            // Hide the plan completely
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found");
        }
        return originalPlan;
    }

    // This deletes the forked_plan entries, not unforking
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void deleteForkedPlanRecord(Integer userId, Integer planId) {
        forkedPlanRepository.deleteByAdopterIdAndAdoptedPlanId(userId, planId);
    }
}
