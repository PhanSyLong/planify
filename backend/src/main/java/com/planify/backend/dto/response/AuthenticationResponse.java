package com.planify.backend.dto.response;

import com.planify.backend.dto.request.AuthenticationRequest;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
//Class này dùng để Kiểm tra xem username và password có đúng không
public class AuthenticationResponse {
    String token;
    boolean authenticated;
}
