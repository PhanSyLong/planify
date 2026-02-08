package com.planify.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TodoItemResponse {
    Integer subtaskId;
    Integer taskId;
    String title;
    String description;
    Integer duration;
    String status;
    Integer daysLeft;
    LocalDateTime scheduledDate;
    LocalDateTime startedAt;
    Integer planId;
    String planTitle;
}
