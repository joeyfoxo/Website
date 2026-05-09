package dev.joeyfoxo.webbackend.controller;

import dev.joeyfoxo.webbackend.models.User;
import dev.joeyfoxo.webbackend.models.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class Auth {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Auth(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/login")
    public ResponseEntity<?> login(Authentication authentication) {
        // If the code reaches here, Spring Security has already
        // verified the username and password against the database.
        return ResponseEntity.ok(authentication.getPrincipal());
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        // Validation: Only allow @joeyfox.dev
        if (user.getEmail() == null || !user.getEmail().endsWith("@joeyfox.dev")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Sorry you cannot register.");
        }

        // Check if username already exists to prevent JPA errors
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }
}