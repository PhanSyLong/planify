package com.planify.backend.controller;

import com.planify.backend.Service.UserService;
import com.planify.backend.dto.request.ApiResponse;
import com.planify.backend.dto.request.UserCreationRequest;
import com.planify.backend.dto.request.UserUpdateRequest;
import com.planify.backend.dto.response.UserResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request){
        return ApiResponse.<UserResponse>builder() //builder() = đưa ra bản thiết kế để bắt đầu xây.
                .result(userService.createUser(request)) //✔ builder() → Tạo bộ khung ApiResponse //result(...) → Gắn dữ liệu trả về vào result// build() → Hoàn thành, tạo object cuối cùng để trả về API
                .build();
    }

    @GetMapping
    ApiResponse<List<UserResponse>> getUsers(){
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getUsers())
                .build();
    }

    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUser(@PathVariable("userId") Integer userId){ //@PathVariable giúp chuyển userId từ @GetMapping("/{userId}") vào 1 biến đó là Integer "userId"
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(Integer.valueOf(userId)))
                .build();
    }

    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable Integer userId, @RequestBody UserUpdateRequest request){
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId,request))
                .build();
    }

    @DeleteMapping("/{userId}")
    ApiResponse<String> deleteUser(@PathVariable Integer userId){
        userService.deleteUser(userId);
        return ApiResponse.<String>builder().result("User has been deleted").build();
    }

    @GetMapping("/myInfo")
    ApiResponse<UserResponse> getMyInfo(){
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }
}
