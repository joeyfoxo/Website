package dev.joeyfoxo.webbackend.service;

import dev.joeyfoxo.webbackend.dto.FileResponse;
import dev.joeyfoxo.webbackend.models.UserRole;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FileStorageService {

    private static final String BASE_STORAGE_PATH = "/app/storage";

    // Cryptographically secure random generator for compact tracking IDs
    private final SecureRandom secureRandom = new SecureRandom();

    private final Map<UserRole, Path> roleFolderMapping = Map.of(
            UserRole.JOEY, Paths.get(BASE_STORAGE_PATH, "JOEY"),
            UserRole.ADMIN, Paths.get(BASE_STORAGE_PATH, "ADMIN"),
            UserRole.DEV, Paths.get(BASE_STORAGE_PATH, "DEV"),
            UserRole.BOT, Paths.get(BASE_STORAGE_PATH, "BOT"),
            UserRole.TRUSTED, Paths.get(BASE_STORAGE_PATH, "TRUSTED"),
            UserRole.AUTHENTICATED, Paths.get(BASE_STORAGE_PATH, "AUTHED")
    );

    public List<FileResponse> listFiles(UserRole role, String subPath) {
        Path targetDirectory = resolveSafePath(role, subPath);
        if (!Files.exists(targetDirectory)) {
            return Collections.emptyList();
        }

        try (Stream<Path> stream = Files.list(targetDirectory)) {
            return stream
                    .map(path -> {
                        String fileName = path.getFileName().toString();
                        boolean isDir = Files.isDirectory(path);

                        // No longer need to strip prefixes; the name is the display name
                        long size = 0;
                        if (!isDir) {
                            try { size = Files.size(path); } catch (IOException ignored) {}
                        }

                        return new FileResponse(fileName, fileName, size, isDir);
                    })
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("Could not read stored directory contents", e);
        }
    }

    public void createFolder(String folderName, UserRole role, String subPath) {
        Path currentDirectory = resolveSafePath(role, subPath);
        Path newFolderPath = currentDirectory.resolve(StringUtils.cleanPath(folderName)).normalize();

        validateBoundary(newFolderPath, role);

        try {
            Files.createDirectories(newFolderPath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to establish new directory sub-node folder layout", e);
        }
    }

    public String saveFile(MultipartFile file, UserRole role, String subPath) {
        Path targetDirectory = resolveSafePath(role, subPath);

        try {
            if (!Files.exists(targetDirectory)) {
                Files.createDirectories(targetDirectory);
            }

            String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
            if (originalFileName.contains("..") || originalFileName.isEmpty()) {
                throw new IllegalArgumentException("Invalid file name layout: " + originalFileName);
            }

            Path targetLocation = targetDirectory.resolve(originalFileName);

            // Prevent accidental overwriting of existing files
            if (Files.exists(targetLocation)) {
                throw new FileAlreadyExistsException("File already exists: " + originalFileName);
            }

            Files.copy(file.getInputStream(), targetLocation);
            return originalFileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to safely store file payload: " + e.getMessage(), e);
        }
    }

    public Resource loadFile(String filename, UserRole role, String subPath) {
        Path filePath = resolveSafePath(role, subPath).resolve(filename).normalize();
        validateBoundary(filePath, role);

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

    public boolean deleteFile(String filename, UserRole role, String subPath) {
        Path targetPath = resolveSafePath(role, subPath).resolve(filename).normalize();
        validateBoundary(targetPath, role);

        try {
            if (Files.isDirectory(targetPath)) {
                try (Stream<Path> walk = Files.walk(targetPath)) {
                    List<Path> paths = walk.sorted(Comparator.reverseOrder()).toList();
                    for (Path p : paths) {
                        Files.delete(p);
                    }
                }
                return true;
            } else {
                return Files.deleteIfExists(targetPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not execute object purging context: " + filename, e);
        }
    }

    public String renameFile(String oldFullName, String newDisplayName, UserRole role, String subPath) throws FileAlreadyExistsException {
        Path targetDir = resolveSafePath(role, subPath);
        Path oldFilePath = targetDir.resolve(oldFullName).normalize();
        validateBoundary(oldFilePath, role);

        // Sanitize and define the new destination
        String newFullName = StringUtils.cleanPath(newDisplayName).replace("..", "");
        Path targetNewLocation = oldFilePath.getParent().resolve(newFullName).normalize();

        // Safety check: Don't overwrite existing files during a rename
        if (Files.exists(targetNewLocation)) {
            throw new FileAlreadyExistsException("A file or folder with the name '" + newFullName + "' already exists.");
        }

        try {
            Files.move(oldFilePath, targetNewLocation);
            return newFullName;
        } catch (IOException e) {
            throw new RuntimeException("Could not execute structural rename operation: " + e.getMessage(), e);
        }
    }

    // --- PRIVATE HELPER METHODS ---

    private Path getTargetDirectory(UserRole role) {
        Path targetBaseDirectory = roleFolderMapping.get(role);
        if (targetBaseDirectory == null) {
            throw new IllegalArgumentException("Invalid role permissions.");
        }
        return targetBaseDirectory;
    }

    private Path resolveSafePath(UserRole role, String subPath) {
        Path baseDir = getTargetDirectory(role);
        Path resolvedPath = baseDir;

        if (subPath != null && !subPath.isBlank()) {
            resolvedPath = baseDir.resolve(subPath).normalize();
        }

        validateBoundary(resolvedPath, role);
        return resolvedPath;
    }

    private void validateBoundary(Path target, UserRole role) {
        Path rootPartition = getTargetDirectory(role);
        if (!target.startsWith(rootPartition)) {
            throw new IllegalArgumentException("Access Denied: Sandbox root directory traversal block triggered.");
        }
    }
}