package dev.joeyfoxo.webbackend.models;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.UUID;

public interface FileShareRepository extends JpaRepository<FileShare, UUID> {

    @Transactional
    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}
