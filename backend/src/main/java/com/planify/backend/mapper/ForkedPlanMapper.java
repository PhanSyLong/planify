package com.planify.backend.mapper;

import com.planify.backend.dto.response.ForkedPlanResponse;
import com.planify.backend.model.ForkedPlan;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ForkedPlanMapper {
    @Mapping(source = "originalPlan.id", target = "originalPlanId")
    @Mapping(source = "adoptedPlan.id", target = "adoptedPlanId")
    @Mapping(source = "adopter.id", target = "adopterId")
    @Mapping(source = "createdAt", target = "createdAt")
    ForkedPlanResponse toResponse(ForkedPlan forkedPlan);

    @Mapping(source = "originalPlan.id", target = "originalPlanId")
    @Mapping(source = "adoptedPlan.id", target = "adoptedPlanId")
    @Mapping(source = "adopter.id", target = "adopterId")
    @Mapping(source = "createdAt", target = "createdAt")
    List<ForkedPlanResponse> toResponseList(List<ForkedPlan> forkedPlans);
}
