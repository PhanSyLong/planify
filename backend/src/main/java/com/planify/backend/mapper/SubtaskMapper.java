package com.planify.backend.mapper;

import com.planify.backend.dto.response.SubtaskResponse;
import com.planify.backend.model.Subtask;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SubtaskMapper {
    @Mapping(source = "task_id.id", target = "taskId")
    SubtaskResponse toResponse(Subtask subtask);

    @Mapping(source = "task_id.id", target = "taskId")
    List<SubtaskResponse> toResponseList(List<Subtask> subtasks);
}

