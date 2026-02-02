package com.planify.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DailyPerformanceResponse {
    long subtasksCompleted;
    long subtasksIncompleted;
    long subtasksCancelled;
}
