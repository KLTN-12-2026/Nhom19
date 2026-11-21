package com.example.device_maintenance_backend.mapper;

import com.example.device_maintenance_backend.dto.request.CreateUserRequestDTO;
import com.example.device_maintenance_backend.dto.request.UserRequestDTO;
import com.example.device_maintenance_backend.dto.response.UserResponseDTO;
import com.example.device_maintenance_backend.entity.Role;
import com.example.device_maintenance_backend.entity.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

public final class UserMapper {
    private UserMapper() {
    }

    public static UsernamePasswordAuthenticationToken toAuthenticationToken(UserRequestDTO request) {
        return UsernamePasswordAuthenticationToken.unauthenticated(request.identifier(), request.password());
    }

    public static UserResponseDTO toResponseDTO(User user) {
        return new UserResponseDTO(user.getUserId(), user.getUserName(), user.getEmail(),
                user.getPhone(), user.getFullName(), user.getRole().getRoleId());
    }

    public static User toEntity(CreateUserRequestDTO request, String passwordHash, Role role) {
        return new User(request.userName(), passwordHash, request.email(), request.phone(), request.fullName(), role);
    }
}
