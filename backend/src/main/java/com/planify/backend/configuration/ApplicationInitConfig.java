package com.planify.backend.configuration;

import com.planify.backend.model.User;
import com.planify.backend.model.Role;
import com.planify.backend.model.Role.RoleName;
import com.planify.backend.model.UserRole;
import com.planify.backend.repository.RoleRepository;
import com.planify.backend.repository.UserRepository;
import com.planify.backend.repository.UserRoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE , makeFinal = true)
@Slf4j //Dùng để log
//Class này nó sẽ tự tạo cho mình một ADMIN khi Web được khởi chạy
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @Bean
    //Cái hàm này nó sẽ được khởi chạy mỗi khi ứng dụng của chúng ta start
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository, UserRoleRepository userRoleRepository){
        return args -> {
            // Đảm bảo luôn tồn tại cả 2 role ADMIN và USER
            roleRepository.findByName(RoleName.ADMIN)
                    .or(() -> {
                        log.info("Role ADMIN not found, creating default ADMIN role");
                        return Optional.of(roleRepository.save(Role.builder().name(RoleName.ADMIN).build()));
                    });

            roleRepository.findByName(RoleName.USER)
                    .or(() -> {
                        log.info("Role USER not found, creating default USER role");
                        return Optional.of(roleRepository.save(Role.builder().name(RoleName.USER).build()));
                    });

            if(userRepository.findByUsername("admin").isEmpty()){
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .email("admin@gmail.com")
                        .build();

                admin = userRepository.save(admin);

                Role adminRole = roleRepository.findByName(RoleName.ADMIN).get();

                UserRole ur = UserRole.builder()
                        .user(admin)
                        .role(adminRole)
                        .build();

                userRoleRepository.save(ur);
                log.warn("admin user has been created with default password: admin , please change it");
            }
        };
    }
}
