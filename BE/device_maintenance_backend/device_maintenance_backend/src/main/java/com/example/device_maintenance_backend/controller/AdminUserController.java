package com.example.device_maintenance_backend.controller;

import com.example.device_maintenance_backend.api.ApiPaths;
import com.example.device_maintenance_backend.dto.request.CreateUserRequestDTO;
import com.example.device_maintenance_backend.dto.response.UserResponseDTO;
import com.example.device_maintenance_backend.response.SuccessResponse;
import com.example.device_maintenance_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.ADMIN_USERS)
public class AdminUserController {
    private final UserService users;

    public AdminUserController(UserService users) {
        this.users = users;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SuccessResponse<UserResponseDTO> createUser(@Valid @RequestBody CreateUserRequestDTO request) {
        return SuccessResponse.of(HttpStatus.CREATED, "User created", users.createUser(request));
    }
}
