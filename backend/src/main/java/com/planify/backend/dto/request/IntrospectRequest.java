package com.planify.backend.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
//Class này dùng để verify token xem có đúng hay không
public class IntrospectRequest {
    String token;
}
