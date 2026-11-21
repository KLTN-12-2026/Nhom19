package com.example.device_maintenance_backend.config;

import com.example.device_maintenance_backend.dto.request.CreateUserRequestDTO;
import com.example.device_maintenance_backend.mapper.UserMapper;
import com.example.device_maintenance_backend.repository.RoleRepository;
import com.example.device_maintenance_backend.repository.UserRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class AdminAccountInitializer implements ApplicationRunner {
    private static final long ADMIN_ROLE_ID = 2L;

    private final UserRepository users;
    private final RoleRepository roles;
    private final PasswordEncoder passwordEncoder;
    private final Validator validator;
    private final CreateUserRequestDTO admin;

    public AdminAccountInitializer(
            UserRepository users,
            RoleRepository roles,
            PasswordEncoder passwordEncoder,
            Validator validator,
            @Value("${app.bootstrap.admin.username}") String username,
            @Value("${app.bootstrap.admin.email}") String email,
            @Value("${app.bootstrap.admin.password}") String password) {
        this.users = users;
        this.roles = roles;
        this.passwordEncoder = passwordEncoder;
        this.validator = validator;
        this.admin = new CreateUserRequestDTO(username, password, email, "Administrator", null);
    }

    @Override
    public void run(ApplicationArguments args) {
        if (admin.password().isBlank() || adminExists()) {
            return;
        }

        var violations = validator.validate(admin);
        if (!violations.isEmpty()) {
            String messages = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .sorted()
                    .collect(Collectors.joining(", "));
            throw new IllegalStateException("Invalid app.bootstrap.admin configuration: " + messages);
        }

        if (users.existsByUserNameOrEmail(admin.userName(), admin.email())) {
            if (adminExists()) {
                return;
            }
            throw new IllegalStateException("Bootstrap admin username or email is already used by another account");
        }

        var role = roles.findById(ADMIN_ROLE_ID)
                .orElseThrow(() -> new IllegalStateException("Admin role is missing. Check Flyway migration V3."));
        var user = UserMapper.toEntity(admin, passwordEncoder.encode(admin.password()), role);

        try {
            users.saveAndFlush(user);
        } catch (DataIntegrityViolationException exception) {
            // Another instance may have created the configured admin during startup.
            if (!adminExists()) {
                throw exception;
            }
        }
    }

    private boolean adminExists() {
        return users.existsByUserNameAndEmailAndRole_RoleId(admin.userName(), admin.email(), ADMIN_ROLE_ID);
    }
}
