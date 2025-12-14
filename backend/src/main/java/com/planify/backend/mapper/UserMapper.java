package com.planify.backend.mapper;

import com.planify.backend.dto.request.UserCreationRequest;
import com.planify.backend.dto.request.UserUpdateRequest;
import com.planify.backend.dto.response.UserResponse;
import com.planify.backend.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {
    //MapStruct sẽ tạo code để biến UserCreationRequest → User
    //Nếu hai class có field cùng tên → MapStruct tự map.
    User toUser(UserCreationRequest request);

    //Dùng để:
    //Chuyển entity User → thành UserResponse
    UserResponse toUserResponse(User user);

    //@MappingTarget User user = object đích cần update
    //UserUpdateRequest request = object nguồn
    //MapStruct sẽ map các field từ request vào user, nhưng KHÔNG tạo object mới — nó update trực tiếp vào object hiện có.
    //nullValuePropertyMappingStrategy = IGNORE: Chỉ update các field không null (tự động ignore null values)
    //Ignore các field không nên được update từ request
    @Mapping(target = "username", ignore = true)  // Không cho phép update username
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userRoles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request );

    List<UserResponse> toUserResponseList(List<User> users);
}