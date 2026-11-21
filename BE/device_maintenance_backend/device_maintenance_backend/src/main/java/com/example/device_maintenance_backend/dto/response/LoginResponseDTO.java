package com.example.device_maintenance_backend.dto.response;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

public record LoginResponseDTO(@JsonUnwrapped UserResponseDTO user, String accessToken) {
    @Override
    public String toString() {
        return "LoginResponseDTO";
    }
}
