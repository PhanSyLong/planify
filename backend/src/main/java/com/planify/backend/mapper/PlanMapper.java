package com.planify.backend.mapper;

import com.planify.backend.dto.request.PlanRequest;
import com.planify.backend.dto.response.PlanResponse;
import com.planify.backend.model.Plan;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PlanMapper {
    PlanRequest toRequest(Plan plan);
    @Mapping(source = "owner.id", target = "ownerId")
    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(source = "updatedAt", target = "updatedAt")
    PlanResponse toResponse(Plan plan);
    @Mapping(source = "owner.id", target = "ownerId")
    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(source = "updatedAt", target = "updatedAt")
    List<PlanResponse> toResponseList(List<Plan> plans);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updatePlan(PlanRequest request, @MappingTarget Plan targetPlan);
}
