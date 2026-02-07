package com.planify.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DailyPerformanceResponse {
    LocalDate date;
    long subtasksCompleted;
    long subtasksIncompleted;
    long subtasksCancelled;

    // Constructor for today's summary (without date)
    public DailyPerformanceResponse(long subtasksCompleted, long subtasksIncompleted, long subtasksCancelled) {
        this.subtasksCompleted = subtasksCompleted;
        this.subtasksIncompleted = subtasksIncompleted;
        this.subtasksCancelled = subtasksCancelled;
    }

    // Constructor for weekly summary (with date)
    public DailyPerformanceResponse(LocalDate date, long subtasksCompleted, long subtasksIncompleted,
            long subtasksCancelled) {
        this.date = date;
        this.subtasksCompleted = subtasksCompleted;
        this.subtasksIncompleted = subtasksIncompleted;
        this.subtasksCancelled = subtasksCancelled;
    }
}
