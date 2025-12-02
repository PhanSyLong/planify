package com.planify.backend.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.spec.SecretKeySpec;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    //Khai báo endpoints
    private final String[] PUBLIC_ENDPOINTS = {  "/auth/token",  "/auth/introspect" , "/users"};

    @Value("${jwt.signerKey}")
    private String signerKey; //Sử dụng cái signerKey ở trong file application.yaml

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception{
        httpSecurity.authorizeHttpRequests(request ->
                request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS).permitAll()
                        .anyRequest().authenticated());

        //Đến phần security của phương thức GET token , chúng ta sẽ cấu hình rằng : Nếu User mà có một token hợp lệ thì sẽ Get được
        httpSecurity.oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(jwtDecoder())) //decoder : Chuyển đổi chuỗi JWT thành object để đọc thông tin bên trong:)
        );

        httpSecurity.csrf(AbstractHttpConfigurer::disable); //Cái này nó sẽ bảo vệ app của bạn khỏi attach 2 , ở đây mình không cần nên mình tắt nó đi
        return httpSecurity.build();
    }

    @Bean//Đây là 1 cái decoder để gắn vào hàm trên
    JwtDecoder jwtDecoder(){
        SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(),"HS512");

        return NimbusJwtDecoder
                .withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build(); //Chuyển đổi chuỗi JWT thành object để đọc thông tin bên trong:
    }

    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(10);
    }
}
