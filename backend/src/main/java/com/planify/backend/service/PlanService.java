package com.planify.backend.service;

import com.planify.backend.dto.request.PlanRequest;
import com.planify.backend.dto.request.PlanUpdateRequest;
import com.planify.backend.dto.response.TimingResponse;
import com.planify.backend.exception.AppException;
import com.planify.backend.exception.ErrorCode;
import com.planify.backend.model.Plan;
import com.planify.backend.model.TimeStatus;
import com.planify.backend.repository.PlanRepository;
import com.planify.backend.repository.UserRepository;
import com.planify.backend.repository.StageRepository;
import com.planify.backend.repository.SubtaskRepository;
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
    StageRepository stageRepository;
    SubtaskRepository subtaskRepository;

    public Plan addPlan(PlanRequest request) {
        Plan plan = new Plan();
        plan.setTitle(request.getTitle());
        plan.setDescription(request.getDescription());
        plan.setVisibility(request.getVisibility());
        plan.setStatus(request.getStatus());
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

    // New helpers to compute expected and actual times
    public Integer computeExpectedTime(Integer planId) {
        return stageRepository.sumDurationByPlanId(planId);
    }

    public Integer computeActualTime(Integer planId) {
        return subtaskRepository.sumCompletedDurationByPlanId(planId);
    }

    // New: compute time status for plan
    public TimingResponse computeTimeStatus(Integer planId) {
        Integer expected = computeExpectedTime(planId);
        Integer actual = computeActualTime(planId);

        TimeStatus status;
        if (actual < expected) {
            status = TimeStatus.EARLY;
        } else if (actual > expected) {
            status = TimeStatus.LATE;
        } else {
            status = TimeStatus.ON_TIME;
        }

        return TimingResponse.builder()
                .planId(planId)
                .expectedTime(expected)
                .actualTime(actual)
                .status(status)
                .build();
    }

    // New: partial update for Plan
    public Plan updatePlanPartial(Integer planId, PlanUpdateRequest request) {
        Plan plan = planRepository.findPlanById(planId);
        if (plan == null) {
            throw new AppException(ErrorCode.PLAN_NOT_FOUND);
        }

        if (request.getTitle() != null) plan.setTitle(request.getTitle());
        if (request.getDescription() != null) plan.setDescription(request.getDescription());
        if (request.getPicture() != null) plan.setPicture(request.getPicture());
        if (request.getStatus() != null) plan.setStatus(request.getStatus());

        return planRepository.save(plan);
    }
}
