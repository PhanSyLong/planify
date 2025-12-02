package com.planify.backend.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.planify.backend.dto.request.AuthenticationRequest;
import com.planify.backend.dto.request.IntrospectRequest;
import com.planify.backend.dto.request.LogoutRequest;
import com.planify.backend.dto.response.AuthenticationResponse;
import com.planify.backend.dto.response.IntrospectResponse;
import com.planify.backend.model.InvalidatedToken;
import com.planify.backend.model.User;
import com.planify.backend.exception.AppException;
import com.planify.backend.exception.ErrorCode;
import com.planify.backend.repository.InvalidatedTokenRepository;
import com.planify.backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class AuthenticationService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    InvalidatedTokenRepository invalidatedTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    public AuthenticationResponse authenticate(AuthenticationRequest request){
        log.info("Attempting to authenticate user: {}", request.getUsername());
        
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> {
                    log.warn("User not found: {}", request.getUsername());
                    return new AppException(ErrorCode.USER_NOT_EXISTED);
                });

        //Check Hash Password
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        
        log.info("Password match result for user {}: {}", request.getUsername(), authenticated);

        if(!authenticated){
            log.warn("Authentication failed for user: {}", request.getUsername());
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        var token = generateToken(user);
        log.info("Token generated successfully for user: {}", request.getUsername());

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    //Tạo 1 token : gồm có 3 phần header , payload và kí(sign)
    private String generateToken(User user){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("thang.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString()) //Tự gen ra 1 ID duy nhất cho 1 token
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header , payload);

        //Kí : Sign để tăng tính bảo mật , để thông tin không bị thay đổi
        try{
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes())); //MACSigner thuật toán dùng để kí
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    //Tạo 1 hàm để xác định cái scope role cho user
    private String buildScope(User user){
        StringJoiner stringJoiner = new StringJoiner(" "); //Giữa 2 cái role trong scope được ngăn cách bằng dấu cách " "

        if(user.getUserRoles() != null) {
            user.getUserRoles()
                    .stream()
                    .filter(ur -> ur != null && ur.getRole() != null && ur.getRole().getName() != null)
                    .forEach(ur -> stringJoiner.add(ur.getRole().getName().name()));
        }

        return stringJoiner.toString();
    }

    //Method Introspect
    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;
        try {
            verifyToken(token);
        }catch(AppException e) {
            isValid = false;
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    //Hàm logout
    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        var signToken = verifyToken(request.getToken());

        String jit = signToken.getJWTClaimsSet().getJWTID(); //ID của Token
        Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .expiryTime(expiryTime)
                .build();

        //Lưu vào bảng Token trong database
        invalidatedTokenRepository.save(invalidatedToken);
    }

    private SignedJWT verifyToken(String token) throws JOSEException, ParseException {
        //Verify Token bằng Class JWSVerifier
        JWSVerifier jwsVerifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        //Kiểm tra xem token này đã hết hạn hay chưa
        Date expityTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(jwsVerifier);

        //Nếu chữ ký không đúng hoặc hết hạn
        if(!(verified && expityTime.after(new Date()))){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        //Nếu ID của một Token tồn tại trong bảng database InvalidatedToken thì
        if(invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return signedJWT;
    }
}
