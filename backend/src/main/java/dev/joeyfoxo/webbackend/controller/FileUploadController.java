package dev.joeyfoxo.webbackend.controller;

import dev.joeyfoxo.webbackend.dto.FileResponse;
import dev.joeyfoxo.webbackend.models.User;
import dev.joeyfoxo.webbackend.models.UserRepository;
import dev.joeyfoxo.webbackend.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    public FileUploadController(FileStorageService fileStorageService, UserRepository userRepository) {
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<FileResponse>> browseFiles(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found."));

        return ResponseEntity.ok(fileStorageService.listFiles(user.getRole()));
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found."));

        Resource fileResource = fileStorageService.loadFile(filename, user.getRole());

        // Strip out the UUID to give the user their original filename on download
        String cleanName = filename.contains("_") ? filename.substring(filename.indexOf("_") + 1) : filename;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + cleanName + "\"")
                .body(fileResource);
    }
}