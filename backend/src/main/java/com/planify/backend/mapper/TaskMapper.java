package com.planify.backend.mapper;

import com.planify.backend.dto.response.TaskResponse;
import com.planify.backend.model.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(source = "stage_id.id", target = "stageId")
    TaskResponse toResponse(Task task);

    @Mapping(source = "stage_id.id", target = "stageId")
    List<TaskResponse> toResponseList(List<Task> tasks);
}

