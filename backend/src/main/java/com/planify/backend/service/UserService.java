package com.planify.backend.service;

import com.planify.backend.dto.request.UserCreationRequest;
import com.planify.backend.dto.request.UserUpdateRequest;
import com.planify.backend.dto.response.UserResponse;
import com.planify.backend.model.Role;
import com.planify.backend.model.User;
import com.planify.backend.model.UserRole;
import com.planify.backend.exception.AppException;
import com.planify.backend.exception.ErrorCode;
import com.planify.backend.mapper.UserMapper;
import com.planify.backend.repository.RoleRepository;
import com.planify.backend.repository.UserRepository;
import com.planify.backend.repository.UserRoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.planify.backend.model.Role.RoleName;


import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
public class UserService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    UserMapper userMapper;
    RoleRepository roleRepository;
    UserRoleRepository userRoleRepository;

    public UserResponse createUser(UserCreationRequest request){
        User user = userMapper.toUser(request);

        //Hash Password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Lưu lần 1: để JPA fill created_date, updated_date, id,...
        User savedUser = userRepository.save(user);

        //Xử lý Role
        Role roleUser = roleRepository.findByName(RoleName.user)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        UserRole userRole = UserRole.builder()
                .user(savedUser)
                .role(roleUser)
                .build();

        userRoleRepository.save(userRole);

        //Xử lý created_by trong trường hợp tự đăng nhập sẽ lấy người tạo là chính id đó
        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean noAuthenticatedUser = (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName()));

        if(noAuthenticatedUser){
            savedUser.setCreated_by(savedUser.getId());
            savedUser = userRepository.save(savedUser); // Lưu lại lần 2 để update created_by
        }

        return buildUserResponse(savedUser);
    }

    private UserResponse buildUserResponse(User user){
        Set<String> roles = new HashSet<>();
        if(user.getUserRoles() != null) {
            roles = user.getUserRoles()
                    .stream()
                    .filter(ur -> ur != null && ur.getRole() != null && ur.getRole().getName() != null)
                    .map(ur -> ur.getRole().getName().name())
                    .collect(Collectors.toSet());
        }

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .roles(roles)
                .build();
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public List<UserResponse> getUsers(){
        log.info("In method get User");
        return userRepository.findAll().stream()
                .map(this::buildUserResponse)
                .toList();
    }

    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse getUser(Integer id){
        return buildUserResponse(userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED))
        );
    }

    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse updateUser(Integer id, UserUpdateRequest request ){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUser(user , request);

        // Chỉ update password nếu có trong request
        if(request.getPassword() != null && !request.getPassword().isEmpty()){
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        //Khi update User → updated_by = ID user đang đăng nhập
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setUpdated_by(currentUser.getId());

        return buildUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @Transactional
    public void deleteUser(Integer id){
        // Kiểm tra user có tồn tại không
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Xóa các foreign key references trước khi xóa user
        // Set created_by = NULL cho các user được tạo bởi user này
        userRepository.clearCreatedByReferences(id);

        // Set updated_by = NULL cho các user được update bởi user này
        userRepository.clearUpdatedByReferences(id);

        // Xóa các UserRole liên quan (có thể đã có cascade, nhưng để chắc chắn)
        userRoleRepository.deleteAll(user.getUserRoles());

        // Cuối cùng mới xóa user
        userRepository.deleteById(id);

        log.info("User with id {} has been deleted", id);
    }

    public UserResponse getMyInfo(){
        var context = SecurityContextHolder.getContext();
        var authentication = context.getAuthentication();

        if(authentication == null || authentication.getName() == null){
            log.error("Authentication is null or name is null");
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String name = authentication.getName();
        log.info("Getting my info for user: {}", name);

        User user = userRepository.findByUsername(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return buildUserResponse(user);
    }

}
