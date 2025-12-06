package com.planify.backend.mapper;

import com.planify.backend.dto.response.UserResponse;
import com.planify.backend.model.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    List<UserResponse> toUserResponseList(List<User> users);
}
