package com.planify.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PlanResponse {
    Integer id;
    String title;
    Integer ownerId;
    String description;
    String visibility;
    String status;
    int duration;
    String picture;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
