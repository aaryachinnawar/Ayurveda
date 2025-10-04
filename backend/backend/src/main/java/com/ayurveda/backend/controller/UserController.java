package com.ayurveda.backend.controller;

import com.ayurveda.backend.service.UserService;
import com.ayurveda.backend.entity.User;
import com.ayurveda.backend.security.JwtUtil;
import com.ayurveda.backend.dto.UserRequestDTO;
import com.ayurveda.backend.dto.UserResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(toResponseDTO(user));
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserRequestDTO userRequestDTO) {
        logger.info("Registration attempt: username={}, email={}", userRequestDTO.getUsername(), userRequestDTO.getEmail());
        String error = validateUserRequest(userRequestDTO, false);
        if (error != null) {
            logger.warn("Registration failed validation: {}", error);
            return ResponseEntity.badRequest().body(error);
        }
        if (userService.getUserByUsername(userRequestDTO.getUsername()) != null) {
            logger.warn("Registration failed: username '{}' already exists", userRequestDTO.getUsername());
            return ResponseEntity.badRequest().body("Username already exists");
        }
        try {
            User user = userService.createUser(userRequestDTO);
            logger.info("Registration successful: username={}", user.getUsername());
            return ResponseEntity.ok(toResponseDTO(user));
        } catch (Exception ex) {
            logger.error("Registration failed due to server error: {}", ex.getMessage(), ex);
            return ResponseEntity.status(500).body("Registration failed due to a server error. Please try again or contact support.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserRequestDTO userRequestDTO) {
        String error = validateUserRequest(userRequestDTO, true);
        if (error != null) {
            return ResponseEntity.badRequest().body(error);
        }
        User user = userService.updateUser(id, userRequestDTO);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(toResponseDTO(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-username/{username}")
    public ResponseEntity<UserResponseDTO> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(toResponseDTO(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequestDTO loginRequest) {
        logger.info("Login attempt: username={}", loginRequest.getUsername());
        User user = userService.getUserByUsername(loginRequest.getUsername());
        if (user == null) {
            logger.warn("Login failed: user '{}' not found", loginRequest.getUsername());
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }
        if (!userService.getPasswordEncoder().matches(loginRequest.getPassword(), user.getPassword())) {
            logger.warn("Login failed: incorrect password for user '{}'", loginRequest.getUsername());
            return ResponseEntity.status(401).body(Map.of("error", "Incorrect password"));
        }
        logger.info("Login successful: username={}", user.getUsername());
        return ResponseEntity.ok(Map.of(
            "message", "Login successful",
            "username", user.getUsername(),
            "role", user.getRole() != null ? user.getRole().getName() : null,
            "id", user.getId(),
            "token", jwtUtil.generateToken(user.getUsername(), user.getRole() != null ? user.getRole().getName() : null)
        ));
    }

    // Manual validation method
    private String validateUserRequest(UserRequestDTO dto, boolean isUpdate) {
        if (dto.getUsername() == null || dto.getUsername().trim().isEmpty()) return "Username is required";
        if (!isUpdate || (dto.getPassword() != null && !dto.getPassword().isEmpty())) {
            if (!isStrongPassword(dto.getPassword())) return "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol (e.g. Ashok@1234).";
        }
        if (dto.getEmail() == null || !dto.getEmail().contains("@")) return "Valid email is required";
        if (dto.getPhone() == null || dto.getPhone().trim().isEmpty()) return "Phone is required";
        return null;
    }

    // Helper for strong password validation
    private boolean isStrongPassword(String password) {
        if (password == null || password.length() < 8) return false;
        boolean hasUpper = false, hasLower = false, hasDigit = false, hasSymbol = false;
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else hasSymbol = true;
        }
        return hasUpper && hasLower && hasDigit && hasSymbol;
    }

    // Helper method to map User to UserResponseDTO
    private UserResponseDTO toResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setDepartment(user.getDepartment());
        dto.setEmployeeId(user.getEmployeeId());
        dto.setReportingManager(user.getReportingManager());
        dto.setStatus(user.getStatus() != null ? user.getStatus().name() : null);
        dto.setRoleName(user.getRole() != null ? user.getRole().getName() : null);
        return dto;
    }
} 