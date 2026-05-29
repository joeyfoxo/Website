package dev.joeyfoxo.webbackend.controller;

import dev.joeyfoxo.webbackend.models.User;
import dev.joeyfoxo.webbackend.models.UserRepository;
import dev.joeyfoxo.webbackend.dto.UserResponse; // Make sure to import your DTO
import dev.joeyfoxo.webbackend.models.UserRole;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'JOEY')")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .map(UserResponse::new)
                .toList());
    }

    @PutMapping("/users/{email}/role")
    @PreAuthorize("hasAnyRole('ADMIN', 'JOEY')")
    public ResponseEntity<Void> updateUserRole(@PathVariable String email, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Ensure the Enum matches your model exactly
        user.setRole(UserRole.valueOf(body.get("role")));
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }
}