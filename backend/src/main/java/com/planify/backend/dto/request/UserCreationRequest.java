package com.planify.backend.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    @Size(min = 3 , message = "USERNAME_INVALID")
    String username;
    @Size(min = 8 , message = "INVALID_PASSWORD")
    String password;
    String email;
    String avatar;
    String notification_enabled;
}
