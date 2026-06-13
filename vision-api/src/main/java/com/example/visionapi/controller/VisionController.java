package com.example.visionapi.controller;

import com.example.visionapi.service.OllamaService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/vision")
public class VisionController {

    private final OllamaService ollamaService;

    public VisionController(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok", "service", "vision-api"));
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> analyze(
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "prompt", defaultValue = "Describe this image in detail.") String prompt)
            throws IOException {

        String result = ollamaService.analyzeImage(image.getBytes(), prompt);
        return ResponseEntity.ok(Map.of("result", result));
    }
}
