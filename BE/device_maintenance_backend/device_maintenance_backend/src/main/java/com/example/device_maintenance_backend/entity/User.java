package com.example.device_maintenance_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "`user`")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name", nullable = false, unique = true, length = 64)
    private String userName;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true, length = 254)
    private String email;

    @Column(length = 32)
    private String phone;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    protected User() {
    }

    public User(String userName, String passwordHash, String email, String phone, String fullName, Role role) {
        this.userName = userName;
        this.password = passwordHash;
        this.email = email;
        this.phone = phone;
        this.fullName = fullName;
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getFullName() {
        return fullName;
    }

    public Role getRole() {
        return role;
    }
}
