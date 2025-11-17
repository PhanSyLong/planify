package com.planify.backend.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
//Class này để kiểm tra xem token đăng nhập đúng hay không
public class IntrospectResponse {
    boolean valid;
}
