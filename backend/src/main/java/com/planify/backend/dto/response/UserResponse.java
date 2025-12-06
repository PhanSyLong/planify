package com.planify.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Integer id;
    String username;
    public static UserResponse from(com.planify.backend.model.User user) {
        if (user == null) {
            return null;
        }
        return new UserResponse(user.getId(), user.getUsername());
    }
}
