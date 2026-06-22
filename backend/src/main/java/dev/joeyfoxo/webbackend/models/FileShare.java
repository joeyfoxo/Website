package dev.joeyfoxo.webbackend.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "file_shares")
@Data
public class FileShare {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column()
    private LocalDateTime expiresAt;

    // Getters, Setters, and Constructors
    public FileShare() {}

    public FileShare(String filename, UserRole role, LocalDateTime expiresAt) {
        this.filename = filename;
        this.role = role;
        this.expiresAt = expiresAt;
    }
}