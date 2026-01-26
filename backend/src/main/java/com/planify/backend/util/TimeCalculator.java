package com.planify.backend.util;

import com.planify.backend.model.TimeStatus;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public class TimeCalculator {
    public static long calculateActualDays(
            LocalDateTime start,
            LocalDateTime end
    ) {
        if (start == null || end == null) return 0;
        return ChronoUnit.DAYS.between(start, end);
    }

}
