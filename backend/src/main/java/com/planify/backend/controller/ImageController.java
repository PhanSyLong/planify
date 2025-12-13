package com.planify.backend.controller;

import com.planify.backend.dto.response.ApiResponse;
import com.planify.backend.service.ImageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@RestController
@RequestMapping("/image")
public class ImageController {
    ImageService imageService;

    @PostMapping
    ResponseEntity<ApiResponse<String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Save the file to the directory
            String filePath = imageService.saveImage(file);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.<String>builder()
                            .code(HttpStatus.CREATED.value())
                            .result("Image uploaded successfully: " + filePath)
                            .build());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<String>builder()
                            .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .result("Error uploading image")
                            .build());
        }
    }

    @GetMapping("/{filename}")
    public ResponseEntity<ApiResponse<Resource>> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(imageService.uploadDir).resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.status(HttpStatus.OK)
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(ApiResponse.<Resource>builder()
                                .code(HttpStatus.OK.value())
                                .result(resource)
                                .build());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.<Resource>builder()
                                .code(HttpStatus.NOT_FOUND.value())
                                .build());
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Resource>builder()
                            .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());

        }
    }
}