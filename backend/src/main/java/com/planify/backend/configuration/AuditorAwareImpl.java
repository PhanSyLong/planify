package com.planify.backend.configuration;


import com.planify.backend.entity.User;
import com.planify.backend.repository.UserRepository;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

//Spring tự lấy ID user đang đăng nhập
public class AuditorAwareImpl implements AuditorAware<Integer> {

    private final UserRepository userRepository;

    public AuditorAwareImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<Integer> getCurrentAuditor(){ //Optional<T> là một “hộp” có thể: Có giá trị, hoặc Không có gì cả (empty). Giúp ta tránh lỗi NullPointerException (NPE)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null || !authentication.isAuthenticated()){
            return Optional.empty();
        }

        // Lấy username từ token (ví dụ "admin", "thang")
        String username = authentication.getName();

        // Tìm user trong database
        Optional<User> user = userRepository.findByUsername(username);

        // Nếu không tìm thấy user -> trả empty
        if (user.isEmpty()) {
            return Optional.empty();
        }

        // Lấy ID user để Spring tự fill vào created_by / updated_by
        return Optional.of(user.get().getId());
    }
}
