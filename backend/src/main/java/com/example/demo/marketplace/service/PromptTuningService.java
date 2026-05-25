package com.example.demo.marketplace.service;

import com.example.demo.marketplace.entity.PromptVersion;
import com.example.demo.marketplace.entity.TrainingExample;
import com.example.demo.marketplace.repository.PromptVersionRepository;
import com.example.demo.marketplace.repository.TrainingExampleRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PromptTuningService {

    private final PromptVersionRepository promptVersionRepository;
    private final TrainingExampleRepository trainingExampleRepository;

    @Value("${marketplace.prompt.rollover-cron:0 0 8 * * MON}")
    private String rolloutCron;

    public PromptTuningService(PromptVersionRepository promptVersionRepository,
                               TrainingExampleRepository trainingExampleRepository) {
        this.promptVersionRepository = promptVersionRepository;
        this.trainingExampleRepository = trainingExampleRepository;
    }

    @Transactional
    public PromptVersion getActivePrompt() {
        return promptVersionRepository.findFirstByActiveTrueOrderByCreatedAtDesc()
            .orElseGet(this::createInitialPrompt);
    }

    @Transactional
    public PromptVersion createInitialPrompt() {
        PromptVersion version = new PromptVersion();
        version.setVersionLabel("v1");
        version.setPromptText(basePrompt());
        version.setNotes("Initial buyer-intent prompt with Nigerian slang rules.");
        version.setActive(true);
        return promptVersionRepository.save(version);
    }

    @Transactional
    public PromptVersion rollPromptVersion() {
        PromptVersion current = getActivePrompt();
        current.setActive(false);
        promptVersionRepository.save(current);

        long nextVersionNumber = promptVersionRepository.count() + 1;
        List<TrainingExample> examples = trainingExampleRepository
            .findTop20ByConfidenceGreaterThanEqualOrderByCreatedAtDesc(BigDecimal.valueOf(0.850));

        StringBuilder prompt = new StringBuilder(basePrompt());
        if (!examples.isEmpty()) {
            prompt.append("\n\nRecent good examples:\n");
            for (TrainingExample example : examples) {
                prompt.append("- Input: ").append(example.getRawMessage()).append('\n');
                prompt.append("  Output: {\"intent\":\"").append(example.getDetectedIntent())
                    .append("\",\"product\":\"").append(nullToEmpty(example.getExtractedProduct()))
                    .append("\",\"budget\":").append(example.getExtractedBudget())
                    .append(",\"location\":\"").append(nullToEmpty(example.getExtractedLocation()))
                    .append("\"}\n");
            }
        }

        PromptVersion next = new PromptVersion();
        next.setVersionLabel("v" + nextVersionNumber);
        next.setPromptText(prompt.toString());
        next.setNotes("Auto-rolled weekly prompt using recent high-confidence examples.");
        next.setActive(true);
        return promptVersionRepository.save(next);
    }

    @Scheduled(cron = "${marketplace.prompt.rollover-cron:0 0 8 * * MON}")
    public void weeklyRollPrompt() {
        rollPromptVersion();
    }

    private String basePrompt() {
        return """
            You are KudiPal's intent extractor for WhatsApp commerce in Nigeria.
            Return JSON only with keys: intent, product, budget, location.
            Detect BUY_REQUEST from English, Pidgin, and broken English.
            Understand phrases like "wan buy", "abeg I need", "help me get".
            Convert amounts like 35k to 35000.
            Keep product short and clean.
            Keep location as the best location phrase from the message.
            If the message is not a buy request, return UNKNOWN with empty values.
            """;
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }
}
