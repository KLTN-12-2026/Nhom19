package com.example.device_maintenance_backend.service;

import com.example.device_maintenance_backend.dto.request.CreateUserRequestDTO;
import com.example.device_maintenance_backend.dto.response.UserResponseDTO;
import com.example.device_maintenance_backend.mapper.UserMapper;
import com.example.device_maintenance_backend.repository.RoleRepository;
import com.example.device_maintenance_backend.repository.UserRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private static final long DEFAULT_USER_ROLE_ID = 1L;
    private static final int MYSQL_DUPLICATE_ENTRY = 1062;

    private final UserRepository users;
    private final RoleRepository roles;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository users, RoleRepository roles, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.roles = roles;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponseDTO createUser(CreateUserRequestDTO request) {
        var role = roles.findById(DEFAULT_USER_ROLE_ID)
                .orElseThrow(() -> new IllegalStateException("Default user role is missing"));
        var user = UserMapper.toEntity(request, passwordEncoder.encode(request.password()), role);

        try {
            return UserMapper.toResponseDTO(users.saveAndFlush(user));
        } catch (DataIntegrityViolationException exception) {
            if (exception.getCause() instanceof ConstraintViolationException violation
                    && violation.getErrorCode() == MYSQL_DUPLICATE_ENTRY) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Username or email already exists");
            }
            throw exception;
        }
    }
}
