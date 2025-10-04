package com.ayurveda.backend.service;

import com.ayurveda.backend.entity.User;
import com.ayurveda.backend.repository.UserRepository;
import com.ayurveda.backend.dto.UserRequestDTO;
import com.ayurveda.backend.entity.Role;
import com.ayurveda.backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private RoleRepository roleRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User createUser(UserRequestDTO dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setDepartment(dto.getDepartment());
        user.setEmployeeId(dto.getEmployeeId());
        user.setReportingManager(dto.getReportingManager());
        user.setStatus(User.Status.valueOf(dto.getStatus() != null ? dto.getStatus() : "ACTIVE"));
        Role role = roleRepository.findById(dto.getRoleId()).orElseThrow(() -> new IllegalArgumentException("Invalid role ID"));
        user.setRole(role);
        return userRepository.save(user);
    }

    public User updateUser(Long id, UserRequestDTO dto) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return null;
        user.setUsername(dto.getUsername());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setDepartment(dto.getDepartment());
        user.setEmployeeId(dto.getEmployeeId());
        user.setReportingManager(dto.getReportingManager());
        user.setStatus(User.Status.valueOf(dto.getStatus() != null ? dto.getStatus() : "ACTIVE"));
        Role role = roleRepository.findById(dto.getRoleId()).orElseThrow(() -> new IllegalArgumentException("Invalid role ID"));
        user.setRole(role);
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public PasswordEncoder getPasswordEncoder() {
        return passwordEncoder;
    }
} 