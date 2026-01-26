package com.planify.backend.mapper;

import com.planify.backend.dto.response.SubtaskResponse;
import com.planify.backend.model.Subtask;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SubtaskMapper {
    @Mapping(source = "task_id.id", target = "taskId")
    @Mapping(source = "started_at", target = "startedAt")
    @Mapping(source = "completed_at", target = "completedAt")
    SubtaskResponse toResponse(Subtask subtask);

    @Mapping(source = "task_id.id", target = "taskId")
    @Mapping(source = "started_at", target = "startedAt")
    @Mapping(source = "completed_at", target = "completedAt")
    List<SubtaskResponse> toResponseList(List<Subtask> subtasks);
}

