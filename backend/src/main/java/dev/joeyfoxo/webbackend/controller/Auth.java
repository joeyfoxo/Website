package dev.joeyfoxo.webbackend.controller;

import dev.joeyfoxo.webbackend.dto.UserResponse;
import dev.joeyfoxo.webbackend.models.User;
import dev.joeyfoxo.webbackend.models.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

import static dev.joeyfoxo.webbackend.utils.Utils.capitalizeUsername;

@RestController
@RequestMapping("/api/auth")
public class Auth {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    public Auth(UserRepository userRepository,
                PasswordEncoder passwordEncoder,
                AuthenticationManager authenticationManager,
                SecurityContextRepository securityContextRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        if (user.getEmail() == null || !user.getEmail().endsWith("@joeyfox.dev")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sorry, you cannot register.");
        }

        // Check ID (Email)
        if (userRepository.existsById(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already taken.");
        }

        // 1. Format the username right away (e.g., "joey" becomes "Joey")
        String formattedUsername = capitalizeUsername(user.getUsername());
        user.setUsername(formattedUsername);

        // 2. Run the duplicate check against the formatted username
        if (userRepository.findByUsername(formattedUsername).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already taken.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest,
                                   HttpServletRequest request,
                                   HttpServletResponse response) {
        try {
            // 1. Format the login username input before authenticating
            String formattedUsername = capitalizeUsername(loginRequest.getUsername());

            // 2. Pass the standardized username to Spring Security
            Authentication authRequest = UsernamePasswordAuthenticationToken.unauthenticated(
                    formattedUsername, loginRequest.getPassword());

            // Authenticate user
            Authentication authResult = authenticationManager.authenticate(authRequest);

            // Create context and save to repository (handles JSESSIONID)
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authResult);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, request, response);

            org.springframework.security.core.userdetails.User userDetails =
                    (org.springframework.security.core.userdetails.User) authResult.getPrincipal();

            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserResponse userResponse = new UserResponse(user);
            return ResponseEntity.ok(userResponse);

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        SecurityContextHolder.clearContext();
        securityContextRepository.saveContext(SecurityContextHolder.createEmptyContext(), request, response);
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponse userResponse = new UserResponse(user);

        return ResponseEntity.ok(userResponse);
    }
}