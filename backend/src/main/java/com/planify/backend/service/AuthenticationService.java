package com.planify.backend.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.planify.backend.dto.request.AuthenticationRequest;
import com.planify.backend.dto.request.IntrospectRequest;
import com.planify.backend.dto.request.LogoutRequest;
import com.planify.backend.dto.request.RefreshRequest;
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

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

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
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString()) //Tự gen ra 1 ID duy nhất cho 1 token
                .claim("scope", buildScope(user))
                .claim("userId", user.getId())
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
                    .filter(ur -> ur != null &&
                            ur.getRole() != null &&
                            ur.getRole().getName() != null)
                    .forEach(ur -> stringJoiner.add(ur.getRole().getName().name()));
        }

        return stringJoiner.toString();
    }

    //Method Introspect
    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;
        try {
            verifyToken(token , false);
        }catch(AppException e) {
            isValid = false;
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    //Hàm logout
    public void logout(LogoutRequest request) throws ParseException , JOSEException {
        try {
            var signToken = verifyToken(request.getToken(), true);

            String jit = signToken.getJWTClaimsSet().getJWTID(); //ID của Token
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jit)
                    .expiryTime(expiryTime)
                    .build();

            //Lưu vào bảng InvalidatedToken trong database
            invalidatedTokenRepository.save(invalidatedToken);
        }catch(AppException e){
            log.info("Token already expired");
        }
    }

    //Nếu isRefresh là false thì hàm này để verifyToken cho authenticate và introspect , còn nếu là false thì là refresh
    private SignedJWT verifyToken(String token, boolean isRefresh ) throws JOSEException, ParseException {
        //Verify Token bằng Class JWSVerifier
        JWSVerifier jwsVerifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        //Kiểm tra xem token này đã hết hạn hay chưa
        Date expityTime = (isRefresh) //Nếu isRefresh là true thì thời gian hết hạn = tgian issue + tgian mà mình refresh Token đó  , còn nếu là false thì nó chính là cái tgian hết hạn lúc mới tạo token luôn
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                    .toInstant().plus(REFRESHABLE_DURATION,ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

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

    //Hàm refresh Token
    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        //Đầu tiên kiểm tra hiệu lực của Token còn hay không (phải còn hiệu lực)
        var signedJWT = verifyToken(request.getToken(), true);

        //Tiếp theo làm mất hiệu lực token cũ đi
        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .expiryTime(expiryTime)
                .build();
        //Lưu vào bảng InvalidatedToken trong database
        invalidatedTokenRepository.save(invalidatedToken);

        //Tiếp theo: Tạo token mới
        var username = signedJWT.getJWTClaimsSet().getSubject();
        var user = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.UNAUTHENTICATED)
        );

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }
}
