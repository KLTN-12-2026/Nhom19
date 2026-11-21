package com.example.device_maintenance_backend.security;

import com.example.device_maintenance_backend.dto.response.UserResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
public class AccessTokenService {
    private static final JwsHeader HEADER = JwsHeader.with(MacAlgorithm.HS256).type("JWT").build();

    private final JwtEncoder encoder;
    private final Duration accessTokenTtl;

    public AccessTokenService(JwtEncoder encoder,
                              @Value("${app.jwt.access-token-ttl-minutes}") long ttlMinutes) {
        if (ttlMinutes <= 0) {
            throw new IllegalArgumentException("app.jwt.access-token-ttl-minutes must be positive");
        }

        accessTokenTtl = Duration.ofMinutes(ttlMinutes);
        this.encoder = encoder;
    }

    public String issue(UserResponseDTO user) {
        Instant now = Instant.now();
        var claims = JwtClaimsSet.builder()
                .subject(user.userId().toString())
                .issuedAt(now)
                .expiresAt(now.plus(accessTokenTtl))
                .claim("userName", user.userName())
                .claim("email", user.email())
                .claim("roleId", user.roleId())
                .build();

        return encoder.encode(JwtEncoderParameters.from(HEADER, claims)).getTokenValue();
    }
}
