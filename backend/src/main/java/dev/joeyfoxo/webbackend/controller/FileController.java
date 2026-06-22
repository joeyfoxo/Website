package dev.joeyfoxo.webbackend.controller;

import dev.joeyfoxo.webbackend.dto.FileResponse;
import dev.joeyfoxo.webbackend.models.*;
import dev.joeyfoxo.webbackend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    public FileController(FileStorageService fileStorageService, UserRepository userRepository, FileShareRepository fileShareRepository) {
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
        this.fileShareRepository = fileShareRepository;
    }

    @GetMapping
    public ResponseEntity<List<FileResponse>> browseFiles(
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false, defaultValue = "") String path, // Added path support
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found."));

        UserRole targetRole = determineTargetRole(role, user);
        return ResponseEntity.ok(fileStorageService.listFiles(targetRole, path));
    }

    @PostMapping("/folder")
    @PreAuthorize("@securityService.isBotOrAbove(authentication)")
    public ResponseEntity<?> createFolder(@RequestBody Map<String, String> request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found."));

        String folderName = request.get("folderName");
        String roleStr = request.get("role");
        String subPath = request.getOrDefault("path", "");

        if (folderName == null || folderName.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Folder name cannot be empty."));
        }

        try {
            UserRole requestedRole = roleStr != null ? UserRole.valueOf(roleStr) : user.getRole();
            UserRole targetRole = determineTargetRole(requestedRole, user);

            // Access control guard matching your strict security pattern
            if (targetRole != user.getRole() && !(user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.JOEY)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied."));
            }

            fileStorageService.createFolder(folderName, targetRole, subPath);
            return ResponseEntity.ok(Map.of("message", "Folder allocated successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid role configuration context."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Folder allocation failed: " + e.getMessage()));
        }
    }

    @PostMapping("/upload")
    @PreAuthorize("@securityService.isTrustedOrAbove(authentication)")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) UserRole role, // Enabled role switching on upload
            @RequestParam(required = false, defaultValue = "") String path, // Added path support
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot upload an empty file."));
        }

        UserRole targetRole = determineTargetRole(role, user);

        try {
            String savedFilename = fileStorageService.saveFile(file, targetRole, path);
            return ResponseEntity.ok(Map.of(
                    "message", "File uploaded successfully!",
                    "filename", savedFilename
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "File upload failed: " + e.getMessage()));
        }
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String filename,
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false, defaultValue = "") String path, // Added path support
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found."));

        UserRole targetRole = determineTargetRole(role, user);
        Resource fileResource = fileStorageService.loadFile(filename, targetRole, path);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(fileResource);
    }

    @DeleteMapping("/delete/{filename}")
    @PreAuthorize("@securityService.isAdminOrAbove(authentication)")
    public ResponseEntity<?> deleteFile(
            @PathVariable String filename,
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false, defaultValue = "") String path, // Added path support
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found."));

        UserRole targetRole = determineTargetRole(role, user);

        if (targetRole != user.getRole() && !(user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.JOEY)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied."));
        }

        try {
            boolean deleted = fileStorageService.deleteFile(filename, targetRole, path);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "File or folder deleted successfully."));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Target object not found or could not be deleted."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Could not delete object: " + e.getMessage()));
        }
    }

    @PutMapping("/rename")
    @PreAuthorize("@securityService.isDevOrAbove(authentication)")
    public ResponseEntity<?> renameFile(@RequestBody Map<String, String> request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found."));

        String oldFullName = request.get("filename");
        String newDisplayName = request.get("newDisplayName");
        String roleStr = request.get("role");
        String path = request.getOrDefault("path", ""); // Extract nested subpath position

        if (oldFullName == null || newDisplayName == null || roleStr == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing required payload values."));
        }

        try {
            UserRole requestedRole = UserRole.valueOf(roleStr);
            UserRole targetRole = determineTargetRole(requestedRole, user);

            if (targetRole != user.getRole() && !(user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.JOEY)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied."));
            }

            String updatedName = fileStorageService.renameFile(oldFullName, newDisplayName, targetRole, path);
            return ResponseEntity.ok(Map.of("message", "File renamed successfully", "filename", updatedName));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid role specified."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Rename failed: " + e.getMessage()));
        }
    }

    private final FileShareRepository fileShareRepository;

    /**
     * Protected Route: Generates a DB record and returns the UUID string.
     * Secure this endpoint using your existing Spring Security setup.
     */
    @PostMapping("/share")
    @PreAuthorize("@securityService.isAdminOrAbove(authentication)")
    public ResponseEntity<?> generateShareToken(@RequestBody Map<String, String> request) {
        String filename = request.get("fullName");
        UserRole role = UserRole.getRoleByName(request.get("role"));
        // Validation guard
        if (filename == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing required fields for file sharing."));
        }

        try {
            LocalDateTime expiresAt = LocalDateTime.now().plusHours(24);
            FileShare fileShare = new FileShare(filename,role, expiresAt);
            FileShare savedShare = fileShareRepository.save(fileShare);
            return ResponseEntity.ok(Map.of("shareToken", savedShare.getId().toString()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Unprotected Route: PUBLIC download via tracking UUID token.
     * Ensure your Spring Security config permits all requests to this pattern.
     */

    //TODO: ADD ROLE TO REDUCE NEEDING TO SEARCH
    @GetMapping("/public/download/{token}")
    public ResponseEntity<Resource> downloadPublicFile(@PathVariable String token) throws FileNotFoundException {
        // 1. Find the share record via your current database setup
        FileShare share = fileShareRepository.findById(UUID.fromString(token))
                .orElseThrow(() -> new FileNotFoundException("Invalid or expired link."));

        UserRole role = share.getRole();

        System.out.println("Attempting to serve public download for file: " + share.getFilename() + " with role: " + role);

        // 2. Check expiration
        if (share.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.GONE).build();

        }

        // 3. Scan /app/storage dynamically using the service mapping
        Resource resource = fileStorageService.loadFile(share.getFilename(), share.getRole());

        // 4. Serve the file payload back to the browser
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    /**
     * Security verification logic filtering contextual parameters
     */
    private UserRole determineTargetRole(UserRole requestedRole, User currentUser) {
        if (requestedRole == null) {
            return currentUser.getRole();
        }
        if (currentUser.getRole() == UserRole.ADMIN || currentUser.getRole() == UserRole.JOEY) {
            return requestedRole;
        }
        return currentUser.getRole();
    }
}