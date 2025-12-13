package com.planify.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubtaskResponse {
    Integer id;
    Integer taskId;
    String title;
    String description;
    Integer duration;
    String status;
}
