package com.planify.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PlanRequest {
    String title;
    String description;
    String visibility;
    String status;
    int duration;
    String picture;
}
