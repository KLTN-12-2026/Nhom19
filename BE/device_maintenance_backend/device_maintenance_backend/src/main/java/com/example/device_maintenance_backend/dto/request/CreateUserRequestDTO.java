package com.example.device_maintenance_backend.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.nio.charset.StandardCharsets;

public record CreateUserRequestDTO(
        @NotBlank(message = "Username is required")
        @Size(max = 64, message = "Username must be at most 64 characters")
        @Pattern(regexp = "^[^@]*$", message = "Username must not contain @")
        String userName,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        @Size(max = 254, message = "Email must be at most 254 characters")
        String email,

        @Size(max = 150, message = "Full name must be at most 150 characters")
        String fullName,

        @Size(max = 32, message = "Phone must be at most 32 characters")
        String phone
) {
    public CreateUserRequestDTO {
        userName = userName == null ? null : userName.strip();
        email = email == null ? null : email.strip();
        fullName = fullName == null || fullName.isBlank() ? userName : fullName.strip();
        phone = phone == null || phone.isBlank() ? null : phone.strip();
    }

    @JsonIgnore
    @AssertTrue(message = "Password must be at most 72 bytes in UTF-8")
    public boolean isPasswordLengthValid() {
        return password == null || password.getBytes(StandardCharsets.UTF_8).length <= 72;
    }

    @Override
    public String toString() {
        return "CreateUserRequestDTO";
    }
}
