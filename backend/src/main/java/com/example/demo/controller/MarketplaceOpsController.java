package com.example.demo.controller;

import com.example.demo.marketplace.entity.PromptVersion;
import com.example.demo.marketplace.entity.TrainingExample;
import com.example.demo.marketplace.repository.TrainingExampleRepository;
import com.example.demo.marketplace.service.PromptTuningService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/marketplace/ops")
public class MarketplaceOpsController {

    private final TrainingExampleRepository trainingExampleRepository;
    private final PromptTuningService promptTuningService;
    private final ObjectMapper objectMapper;

    public MarketplaceOpsController(TrainingExampleRepository trainingExampleRepository,
                                    PromptTuningService promptTuningService,
                                    ObjectMapper objectMapper) {
        this.trainingExampleRepository = trainingExampleRepository;
        this.promptTuningService = promptTuningService;
        this.objectMapper = objectMapper;
    }

    @GetMapping(value = "/dataset", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> exportDataset() {
        List<TrainingExample> examples = trainingExampleRepository.findAllByOrderByCreatedAtAsc();
        String jsonl = examples.stream()
            .map(this::toJsonLine)
            .collect(Collectors.joining("\n"));
        return ResponseEntity.ok(jsonl);
    }

    @PostMapping("/prompts/rollover")
    public ResponseEntity<Map<String, String>> rollPrompt() {
        PromptVersion promptVersion = promptTuningService.rollPromptVersion();
        return ResponseEntity.ok(Map.of(
            "status", "ok",
            "version", promptVersion.getVersionLabel()
        ));
    }

    private String toJsonLine(TrainingExample example) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("message", example.getRawMessage());
        row.put("intent", example.getDetectedIntent());
        row.put("product", example.getExtractedProduct());
        row.put("budget", example.getExtractedBudget());
        row.put("location", example.getExtractedLocation());
        row.put("source", example.getSource());
        row.put("confidence", example.getConfidence());
        row.put("created_at", example.getCreatedAt());
        try {
            return objectMapper.writeValueAsString(row);
        } catch (JsonProcessingException exception) {
            return "{}";
        }
    }
}
