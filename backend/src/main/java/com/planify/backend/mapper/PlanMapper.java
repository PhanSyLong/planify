package com.planify.backend.mapper;

import com.planify.backend.dto.response.PlanResponse;
import com.planify.backend.model.Plan;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PlanMapper {
    @Mapping(source = "owner.id", target = "ownerId")
    PlanResponse toResponse(Plan plan);
    @Mapping(source = "owner.id", target = "ownerId")
    List<PlanResponse> toResponseList(List<Plan> plans);
}
