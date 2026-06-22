package dev.joeyfoxo.webbackend.service;

import dev.joeyfoxo.webbackend.models.FileShareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DBCleanup {

    @Autowired
    private FileShareRepository fileShareRepository;

    // Runs every hour (3600000 milliseconds)
    @Scheduled(fixedRate = 3600000)
    public void cleanExpiredShares() {
        fileShareRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        System.out.println("Expired file shares cleared from database.");
    }
}