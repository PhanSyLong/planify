package com.planify.backend.dto.response;

import com.planify.backend.model.TimeStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProgressResponse {
    private long actualDays;
    private long expectedDays;
    private TimeStatus status;
}
