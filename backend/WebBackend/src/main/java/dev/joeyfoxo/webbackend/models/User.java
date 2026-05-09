package dev.joeyfoxo.webbackend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password; // This will store the HASH, never plain text

    @Enumerated(EnumType.STRING)
    private UserRole role; // Joey, Bot, Admin, Dev

    // Inside User.java
    private String email;
}
