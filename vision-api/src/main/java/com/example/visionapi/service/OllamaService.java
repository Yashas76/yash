package com.example.visionapi.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class OllamaService {

    @Value("${ollama.base-url:http://ollama:11434}")
    private String ollamaBaseUrl;

    @Value("${ollama.model:llava}")
    private String model;

    private RestClient restClient;

    @PostConstruct
    public void init() {
        this.restClient = RestClient.builder()
                .baseUrl(ollamaBaseUrl)
                .build();
    }

    public String analyzeImage(byte[] imageBytes, String prompt) {
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        var requestBody = Map.of(
                "model", model,
                "prompt", prompt,
                "images", List.of(base64Image),
                "stream", false
        );

        try {
            OllamaResponse response = restClient.post()
                    .uri("/api/generate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(OllamaResponse.class);

            return response != null ? response.response() : "No response from model.";
        } catch (Exception e) {
            throw new RuntimeException("Ollama service error: " + e.getMessage(), e);
        }
    }

    private record OllamaResponse(String response, boolean done) {}
}
