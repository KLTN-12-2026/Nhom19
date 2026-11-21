package com.example.device_maintenance_backend.repository;

import com.example.device_maintenance_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserName(String userName);

    Optional<User> findByEmail(String email);

    boolean existsByUserNameAndEmailAndRole_RoleId(String userName, String email, Long roleId);

    boolean existsByUserNameOrEmail(String userName, String email);
}
