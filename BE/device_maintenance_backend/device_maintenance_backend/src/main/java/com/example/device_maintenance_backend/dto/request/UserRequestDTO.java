package com.example.device_maintenance_backend.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.nio.charset.StandardCharsets;

public record UserRequestDTO(
        @NotBlank(message = "Identifier is required")
        @Size(max = 254, message = "Identifier must be at most 254 characters")
        String identifier,

        @NotEmpty(message = "Password is required")
        String password
) {
    public UserRequestDTO {
        if (identifier != null) {
            identifier = identifier.strip();
        }
    }

    @JsonIgnore
    @AssertTrue(message = "Password must be at most 72 bytes in UTF-8")
    public boolean isPasswordLengthValid() {
        return password == null || password.getBytes(StandardCharsets.UTF_8).length <= 72;
    }

    @Override
    public String toString() {
        return "UserRequestDTO";
    }
}
