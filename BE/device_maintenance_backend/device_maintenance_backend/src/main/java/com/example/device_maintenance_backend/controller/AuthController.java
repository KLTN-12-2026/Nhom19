package com.example.device_maintenance_backend.controller;

import com.example.device_maintenance_backend.api.ApiPaths;
import com.example.device_maintenance_backend.dto.request.UserRequestDTO;
import com.example.device_maintenance_backend.dto.response.LoginResponseDTO;
import com.example.device_maintenance_backend.mapper.UserMapper;
import com.example.device_maintenance_backend.response.SuccessResponse;
import com.example.device_maintenance_backend.security.AccessTokenService;
import com.example.device_maintenance_backend.security.DatabaseUserDetails;
import jakarta.validation.Valid;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.V1 + "/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final AccessTokenService accessTokenService;

    public AuthController(AuthenticationManager authenticationManager, AccessTokenService accessTokenService) {
        this.authenticationManager = authenticationManager;
        this.accessTokenService = accessTokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<SuccessResponse<LoginResponseDTO>> login(@Valid @RequestBody UserRequestDTO request) {
        var credentials = UserMapper.toAuthenticationToken(request);
        Authentication authentication = authenticationManager.authenticate(credentials);
        var principal = (DatabaseUserDetails) authentication.getPrincipal();
        var profile = principal.getProfile();
        var result = new LoginResponseDTO(profile, accessTokenService.issue(profile));
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(SuccessResponse.of(HttpStatus.OK, "Login successful", result));
    }
}
