package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class UploadStorageService {

    private final Path baseDirectory;

    public UploadStorageService(@Value("${app.upload.storage-path:uploads}") String storagePath) {
        this.baseDirectory = Path.of(storagePath).toAbsolutePath().normalize();
    }

    public String store(String userId, MultipartFile file) throws IOException {
        Files.createDirectories(baseDirectory.resolve(userId));

        String originalName = file.getOriginalFilename() == null ? "upload" : file.getOriginalFilename();
        String extension = "";
        int extensionIndex = originalName.lastIndexOf('.');
        if (extensionIndex >= 0) {
            extension = originalName.substring(extensionIndex);
        }

        String storedFileName = UUID.randomUUID() + extension.toLowerCase();
        Path target = baseDirectory.resolve(userId).resolve(storedFileName);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
        }

        return userId + "/" + storedFileName;
    }

    public Path resolve(String storagePath) {
        return baseDirectory.resolve(storagePath).normalize();
    }
}
