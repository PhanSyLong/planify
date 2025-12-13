package com.planify.backend.mapper;

import com.planify.backend.dto.response.StageResponse;
import com.planify.backend.model.Stage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StageMapper {
    @Mapping(source = "plan_id.id", target = "planId")
    @Mapping(source = "created_at", target = "createdAt")
    StageResponse toResponse(Stage stage);

    @Mapping(source = "plan_id.id", target = "planId")
    List<StageResponse> toResponseList(List<Stage> stages);
}

