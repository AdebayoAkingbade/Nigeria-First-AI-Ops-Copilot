package com.example.demo.marketplace.service;

import com.example.demo.marketplace.dto.IntentDetectionResult;
import com.example.demo.marketplace.entity.PromptVersion;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class OpenAiStructuredExtractionService {

    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    @Value("${openai.api.key:}")
    private String openAiApiKey;

    @Value("${openai.model:gpt-4.1-mini}")
    private String openAiModel;

    public OpenAiStructuredExtractionService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder().baseUrl("https://api.openai.com/v1").build();
    }

    public IntentDetectionResult extract(String message, PromptVersion promptVersion) {
        if (openAiApiKey == null || openAiApiKey.isBlank()) {
            return null;
        }

        try {
            Map<String, Object> body = Map.of(
                "model", openAiModel,
                "input", List.of(
                    Map.of(
                        "role", "user",
                        "content", List.of(
                            Map.of(
                                "type", "input_text",
                                "text", "Message: " + message
                            )
                        )
                    )
                ),
                "instructions", promptVersion.getPromptText(),
                "text", Map.of(
                    "format", Map.of(
                        "type", "json_schema",
                        "name", "buy_request_extraction",
                        "strict", true,
                        "schema", Map.of(
                            "type", "object",
                            "additionalProperties", false,
                            "properties", Map.of(
                                "intent", Map.of("type", "string"),
                                "product", Map.of("type", "string"),
                                "budget", Map.of("type", "integer"),
                                "location", Map.of("type", "string")
                            ),
                            "required", List.of("intent", "product", "budget", "location")
                        )
                    )
                )
            );

            String raw = restClient.post()
                .uri("/responses")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + openAiApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(String.class);

            JsonNode root = objectMapper.readTree(raw);
            JsonNode output = root.path("output");
            if (!output.isArray() || output.isEmpty()) {
                return null;
            }

            JsonNode content = output.get(0).path("content");
            if (!content.isArray() || content.isEmpty()) {
                return null;
            }

            String text = content.get(0).path("text").asText();
            JsonNode parsed = objectMapper.readTree(text);
            return new IntentDetectionResult(
                parsed.path("intent").asText("UNKNOWN"),
                parsed.path("product").asText(""),
                parsed.path("budget").asLong(0),
                parsed.path("location").asText(""),
                0.90,
                "OPENAI"
            );
        } catch (Exception exception) {
            return null;
        }
    }
}
