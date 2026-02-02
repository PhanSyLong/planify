package com.planify.backend.mapper;

import com.planify.backend.dto.response.DailyPerformanceResponse;
import com.planify.backend.model.DailyPerformance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface DailyPerformanceMapper {
    DailyPerformanceResponse toResponse(DailyPerformance dailyPerformance);
}
