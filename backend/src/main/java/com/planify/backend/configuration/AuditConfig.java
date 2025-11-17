package com.planify.backend.configuration;

import com.planify.backend.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider") //Bật tính năng JPA Auditing: @CreatedBy @LastModifiedBy @CreatedDate @LastModifiedDate
public class AuditConfig {

    //Đăng ký AuditorAware trong AuditConfig
    @Bean
    public AuditorAware<Integer> auditorProvider(UserRepository userRepository){
        return new AuditorAwareImpl(userRepository);
    }
}
