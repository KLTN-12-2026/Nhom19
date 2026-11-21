package com.example.device_maintenance_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "role")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long roleId;

    @Column(nullable = false)
    private String description;

    protected Role() {
    }

    public Long getRoleId() {
        return roleId;
    }

    public String getDescription() {
        return description;
    }
}
