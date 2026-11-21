package com.example.device_maintenance_backend.repository;

import com.example.device_maintenance_backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
}
