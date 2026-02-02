package com.planify.backend.service;

import com.planify.backend.dto.request.PlanRequest;
import com.planify.backend.mapper.PlanMapper;
import com.planify.backend.dto.request.PlanUpdateRequest;
import com.planify.backend.dto.response.ProgressResponse;
import com.planify.backend.exception.AppException;
import com.planify.backend.exception.ErrorCode;
import com.planify.backend.model.Plan;
import com.planify.backend.model.Stage;
import com.planify.backend.model.TimeStatus;
import com.planify.backend.repository.PlanRepository;
import com.planify.backend.repository.StageRepository;
import com.planify.backend.repository.UserRepository;
import com.planify.backend.util.TimeCalculator;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
public class PlanService {
    PlanRepository planRepository;
    UserRepository userRepository;
    PlanMapper planMapper;
    StageRepository stageRepository;
    JwtUserContext jwtUserContext;

    public Plan addPlan(PlanRequest request) {
        Plan plan = new Plan();
        plan.setTitle(request.getTitle());
        plan.setDescription(request.getDescription());
        plan.setVisibility(request.getVisibility());
        plan.setStatus(request.getStatus());

        String requestPicture = request.getPicture();
        if (requestPicture != null) {
            plan.setPicture(request.getPicture().replace(" ", "_"));
        }
        plan.setReminderAt(request.getReminderAt());
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

    public List<Plan> filterPlans(String query, List<String> tags) {

        boolean hasQuery = query != null && !query.trim().isEmpty();
        boolean hasTags = tags != null && !tags.isEmpty();

        if (!hasQuery && !hasTags) {
            return planRepository.findAll();
        }

        if (hasQuery && !hasTags) {
            return planRepository.searchByTitle(query);
        }

        if (!hasQuery && hasTags) {
            return planRepository.findByTagNames(tags);
        }

        // 👇 có cả query + tag
        return planRepository.searchByQueryAndTags(query, tags);
    }



    // New: partial update for Plan
    public Plan updatePlanPartial(Integer planId, PlanUpdateRequest request) {
        Plan plan = planRepository.findPlanById(planId);
        if (plan == null) {
            throw new AppException(ErrorCode.PLAN_NOT_FOUND);
        }

        if (request.getTitle() != null) plan.setTitle(request.getTitle());
        if (request.getDescription() != null) plan.setDescription(request.getDescription());
        if (request.getVisibility() != null) plan.setVisibility(request.getVisibility());
        if (request.getPicture() != null) plan.setPicture(request.getPicture());
        if (request.getStatus() != null) plan.setStatus(request.getStatus());

        return planRepository.save(plan);
    }

    public ProgressResponse computeProgress(Integer planId) {
        Plan plan = planRepository.findPlanById(planId);
        if (plan == null) {
            throw new AppException(ErrorCode.PLAN_NOT_FOUND);
        }

        List<Stage> stages = stageRepository.findAllStage(planId);

        if (stages.isEmpty()) {
            return new ProgressResponse(
                    0,
                    plan.getDuration(),
                    TimeStatus.NOT_STARTED
            );
        }

        LocalDateTime startedAt = stages.stream()
                .map(Stage::getStarted_at)
                .filter(Objects::nonNull)
                .min(Comparator.naturalOrder())
                .orElse(null);
        if (startedAt == null) {
            return new ProgressResponse(
                    0,
                    plan.getDuration(),
                    TimeStatus.NOT_STARTED
            );
        }

        LocalDateTime completedAt = stages.stream()
                .map(Stage::getCompleted_at)
                .filter(Objects::nonNull)
                .max(Comparator.naturalOrder())
                .orElse(null);
        if (completedAt == null) {
            return new ProgressResponse(
                    0,
                    plan.getDuration(),
                    TimeStatus.IN_PROGRESS
            );
        }

        long actualDuration = TimeCalculator.calculateActualDays(
                startedAt,
                completedAt
        );
        TimeStatus status;

        if (actualDuration > plan.getDuration()) {
            status = TimeStatus.LATE;
        } else {
            status = TimeStatus.ON_TIME;
        }
        return ProgressResponse.builder()
                .expectedDays(plan.getDuration())
                .actualDays(actualDuration)
                .status(status)
                .build();
    }

    public Plan startPlan(Integer planId) {
        Plan plan = planRepository.findPlanById(planId);
        if (plan == null) {
            throw new AppException(ErrorCode.PLAN_NOT_FOUND);
        }
        plan.setStarted_at(LocalDateTime.now());
        return planRepository.save(plan);
    }

    public Plan completePlan(Integer planId) {
        Plan plan = planRepository.findPlanById(planId);
        if (plan == null) {
            throw new AppException(ErrorCode.PLAN_NOT_FOUND);
        }
        plan.setCompleted_at(LocalDateTime.now());
        return planRepository.save(plan);
    }
}
