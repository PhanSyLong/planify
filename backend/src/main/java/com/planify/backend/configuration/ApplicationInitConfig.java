package com.planify.backend.configuration;

import com.planify.backend.entity.User;
import com.planify.backend.entity.Role;
import com.planify.backend.entity.Role.RoleName;
import com.planify.backend.entity.UserRole;
import com.planify.backend.repository.RoleRepository;
import com.planify.backend.repository.UserRepository;
import com.planify.backend.repository.UserRoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

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
            if(roleRepository.findAll().isEmpty()){
                roleRepository.save(Role.builder().name(RoleName.ADMIN).build());
                roleRepository.save(Role.builder().name(RoleName.USER).build());
            }

            if(userRepository.findByUsername("admin").isEmpty()){
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
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
