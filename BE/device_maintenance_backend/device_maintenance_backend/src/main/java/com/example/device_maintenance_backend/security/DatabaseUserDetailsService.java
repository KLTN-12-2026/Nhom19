package com.example.device_maintenance_backend.security;

import com.example.device_maintenance_backend.entity.User;
import com.example.device_maintenance_backend.mapper.UserMapper;
import com.example.device_maintenance_backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {
    private final UserRepository users;

    public DatabaseUserDetailsService(UserRepository users) {
        this.users = users;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String identifier) {
        var match = identifier.contains("@")
                ? users.findByEmail(identifier)
                : users.findByUserName(identifier);
        User user = match.orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new DatabaseUserDetails(UserMapper.toResponseDTO(user), user.getPassword());
    }
}
