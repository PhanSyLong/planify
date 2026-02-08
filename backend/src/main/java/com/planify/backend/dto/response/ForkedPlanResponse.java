package com.planify.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ForkedPlanResponse {
    Integer id;
    Integer originalPlanId;
    Integer adoptedPlanId;
    Integer adopterId;
    LocalDateTime createdAt;
}
