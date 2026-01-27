package com.planify.backend.configuration;

import jakarta.servlet.http.Cookie;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    //Khai báo endpoints
    private final String[] PUBLIC_ENDPOINTS = {  "/auth/token",  "/auth/introspect" , "/users" , "/auth/logout", "/auth/refresh"};

    private final CustomJwtDecoder customJwtDecoder;

    // Sử dụng constructor injection với @Lazy để tránh circular dependency
    public SecurityConfig(@Lazy CustomJwtDecoder customJwtDecoder) {
        this.customJwtDecoder = customJwtDecoder;
    }
//    @Bean
//    public BearerTokenResolver bearerTokenResolver() {
//        return request -> {
//            if (request.getCookies() == null) return null;
//
//            for (Cookie c : request.getCookies()) {
//                if ("access_token".equals(c.getName())) {
//                    return c.getValue(); // 👈 JWT lấy từ cookie
//                }
//            }
//            return null;
//        };
//    }
    @Bean
    @Order(1)
    public SecurityFilterChain sseFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/notifications/stream")
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 ->
                        oauth2
                                .bearerTokenResolver(request -> {
                                    if (request.getCookies() == null) return null;
                                    for (Cookie c : request.getCookies()) {
                                        if ("access_token".equals(c.getName())) {
                                            return c.getValue(); // COOKIE ONLY
                                        }
                                    }
                                    return null;
                                })
                                .jwt(jwt -> jwt.decoder(customJwtDecoder))
                );

        return http.build();
        }


    @Bean
    @Order(2)
    public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 ->
                                oauth2.jwt(jwt -> jwt.decoder(customJwtDecoder))
                        //  đọc Authorization header
                );

        return http.build();
    }



    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(10);
    }

    // Tạo CorsConfigurationSource để sử dụng trong SecurityFilterChain
    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        corsConfiguration.addAllowedOriginPattern("*");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);

        return urlBasedCorsConfigurationSource;
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web -> web.ignoring().requestMatchers("/uploads/**");
    }

}