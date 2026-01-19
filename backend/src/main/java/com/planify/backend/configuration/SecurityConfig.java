package com.planify.backend.configuration;

import jakarta.servlet.http.Cookie;
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
    @Bean
    public BearerTokenResolver bearerTokenResolver() {
        return request -> {
            if (request.getCookies() == null) return null;

            for (Cookie c : request.getCookies()) {
                if ("access_token".equals(c.getName())) {
                    return c.getValue(); // 👈 JWT lấy từ cookie
                }
            }
            return null;
        };
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception{
        httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)//Cái này nó sẽ bảo vệ app của bạn khỏi attach 2 , ở đây mình không cần nên mình tắt nó đi

                .authorizeHttpRequests(request -> request
                        .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers("/planify/notifications/stream").authenticated()
                        .anyRequest().authenticated());

        //Đến phần security của phương thức GET token , chúng ta sẽ cấu hình rằng : Nếu User mà có một token hợp lệ thì sẽ Get được
        httpSecurity.oauth2ResourceServer(oauth2 ->
                oauth2
                        // lấy JWT từ cookie
                        .bearerTokenResolver(bearerTokenResolver())

                        // decode + verify JWT
                        .jwt(jwtConfigurer ->
                                jwtConfigurer.decoder(customJwtDecoder)
                        ) //decoder : Chuyển đổi chuỗi JWT thành object để đọc thông tin bên trong:)
        );


        return httpSecurity.build();
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