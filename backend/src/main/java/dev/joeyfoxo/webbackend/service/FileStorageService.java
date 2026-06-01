package dev.joeyfoxo.webbackend.service;

import dev.joeyfoxo.webbackend.dto.FileResponse;
import dev.joeyfoxo.webbackend.models.UserRole;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FileStorageService {

    private static final String BASE_STORAGE_PATH = "/app/storage";

    // Static role-to-folder mapping using your exact subfolder names
    private final Map<UserRole, Path> roleFolderMapping = Map.of(
            UserRole.JOEY, Paths.get(BASE_STORAGE_PATH, "JOEY"),
            UserRole.ADMIN, Paths.get(BASE_STORAGE_PATH, "ADMIN"),
            UserRole.DEV, Paths.get(BASE_STORAGE_PATH, "DEV"),
            UserRole.BOT, Paths.get(BASE_STORAGE_PATH, "BOT"),
            UserRole.TRUSTED, Paths.get(BASE_STORAGE_PATH, "TRUSTED"),
            UserRole.AUTHENTICATED, Paths.get(BASE_STORAGE_PATH, "AUTHED")
    );

    public List<FileResponse> listFiles(UserRole role) {
        Path targetBaseDirectory = roleFolderMapping.get(role);
        if (targetBaseDirectory == null || !Files.exists(targetBaseDirectory)) {
            return Collections.emptyList();
        }

        try {
            return Files.list(targetBaseDirectory)
                    .filter(Files::isRegularFile)
                    .map(path -> {
                        String fullName = path.getFileName().toString();
                        // Strip the UUID prefix for a cleaner UI display name
                        String displayName = fullName.contains("_") ? fullName.substring(fullName.indexOf("_") + 1) : fullName;
                        long size = 0;
                        try { size = Files.size(path); } catch (IOException ignored) {}
                        return new FileResponse(fullName, displayName, size);
                    })
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("Could not read stored files", e);
        }
    }

    public Resource loadFile(String filename, UserRole role) {
        Path targetBaseDirectory = roleFolderMapping.get(role);
        if (targetBaseDirectory == null) {
            throw new IllegalArgumentException("Invalid role permissions.");
        }

        // Secure resolve: guards against path traversal attempts within filenames
        Path filePath = targetBaseDirectory.resolve(filename).normalize();
        if (!filePath.startsWith(targetBaseDirectory)) {
            throw new IllegalArgumentException("Access Denied: Path traversal attempt blocked.");
        }

        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found or unreadable: " + filename);
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not load file: " + filename, e);
        }
    }
}