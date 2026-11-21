package com.example.device_maintenance_backend.security;

import com.example.device_maintenance_backend.api.ApiPaths;
import jakarta.servlet.DispatcherType;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.util.List;

@Configuration
public class SecurityConfig {
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    AuthenticationManager authenticationManager(DatabaseUserDetailsService users, PasswordEncoder encoder) {
        var provider = new DaoAuthenticationProvider(users);
        provider.setPasswordEncoder(encoder);
        return new ProviderManager(provider);
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http,
            @Qualifier("handlerExceptionResolver") HandlerExceptionResolver exceptionResolver) throws Exception {
        var adminUsers = PathPatternRequestMatcher.withDefaults().matcher(HttpMethod.POST, ApiPaths.ADMIN_USERS);
        var bearerChallenge = new BearerTokenAuthenticationEntryPoint();
        AuthenticationEntryPoint unauthorized = (request, response, exception) -> {
            bearerChallenge.commence(request, response, exception);
            exceptionResolver.resolveException(request, response, null,
                    new InsufficientAuthenticationException("Valid access token required"));
        };

        var jwtAuthentication = new JwtAuthenticationConverter();
        jwtAuthentication.setJwtGrantedAuthoritiesConverter(jwt ->
                switch (String.valueOf(jwt.getClaims().get("roleId"))) {
                    case "1" -> List.of(new SimpleGrantedAuthority("ROLE_USER"));
                    case "2" -> List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
                    default -> List.of();
                });

        return http
                .csrf(csrf -> csrf.ignoringRequestMatchers(ApiPaths.V1 + "/auth/login", ApiPaths.ADMIN_USERS))
                .exceptionHandling(errors -> errors
                        .accessDeniedHandler((request, response, exception) ->
                                exceptionResolver.resolveException(request, response, null, exception))
                        .authenticationEntryPoint((request, response, exception) -> {
                            if (adminUsers.matches(request)) {
                                unauthorized.commence(request, response, exception);
                            } else {
                                exceptionResolver.resolveException(request, response, null,
                                        new AccessDeniedException("Forbidden", exception));
                            }
                        }))
                .oauth2ResourceServer(oauth2 -> oauth2
                        .authenticationEntryPoint(unauthorized)
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthentication)))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                        .requestMatchers(HttpMethod.POST, ApiPaths.V1 + "/auth/login").permitAll()
                        .requestMatchers(adminUsers).hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, ApiPaths.V1 + "/hello").permitAll()
                        .anyRequest().denyAll())
                .build();
    }
}
