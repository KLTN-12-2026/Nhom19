package com.example.device_maintenance_backend.dto.response;

public record UserResponseDTO(Long userId, String userName, String email, String phone, String fullName, Long roleId) {
}
