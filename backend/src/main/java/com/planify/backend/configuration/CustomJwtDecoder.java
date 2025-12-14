package com.planify.backend.configuration;

import com.nimbusds.jose.JOSEException;
import com.planify.backend.dto.request.IntrospectRequest;
import com.planify.backend.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.util.Objects;

@Component
public class CustomJwtDecoder implements JwtDecoder {
    @Value("${jwt.signerKey}")
    private String signerKey; //Sử dụng cái signerKey ở trong file application.yaml

    @Autowired
    @Lazy
    private AuthenticationService authenticationService;

    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @Override
    public Jwt decode(String token) throws JwtException {
        //Đầu tiên dùng hàm introspect ở authenticationService để kiểm tra xem cái token này còn hiệu lực hay không
        try{
            var response = authenticationService.introspect(IntrospectRequest.builder()
                    .token(token)
                    .build());
            if(!response.isValid()){
                throw new JwtException("Token invalid");
            }
        }catch(JOSEException | ParseException e){
            throw new JwtException(e.getMessage());
        }

        //Thứ 2 : Nếu token còn hiệu lực thì mình uỷ quyền cho NimbusJwtDecoder này để nó thực hiện xác thực cái token
        // và nó sẽ build cái jwt này theo cái yêu cầu của Spring Security
        if(Objects.isNull(nimbusJwtDecoder)){
            SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes() , "HS512");
            nimbusJwtDecoder = NimbusJwtDecoder
                    .withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build(); //Chuyển đổi chuỗi JWT thành object để đọc thông tin bên trong:
        }

        return nimbusJwtDecoder.decode(token);
    }
}