package com.example.device_maintenance_backend.security;

import com.example.device_maintenance_backend.dto.response.UserResponseDTO;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.List;

public final class DatabaseUserDetails extends User {
    private final UserResponseDTO profile;

    DatabaseUserDetails(UserResponseDTO profile, String passwordHash) {
        super(profile.userName(), passwordHash, List.of(new SimpleGrantedAuthority("ROLE_" + profile.roleId())));
        this.profile = profile;
    }

    public UserResponseDTO getProfile() {
        return profile;
    }
}
