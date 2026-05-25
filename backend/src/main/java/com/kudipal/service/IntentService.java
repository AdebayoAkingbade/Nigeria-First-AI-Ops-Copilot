package com.kudipal.service;

import com.kudipal.dto.IntentResult;
import com.kudipal.enums.IntentType;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class IntentService {

    private final String PROMPT_TEMPLATE = """
        [OMITTED FOR BREVITY - HANDLED AT RUNTIME]
        """;

    public IntentResult detectIntent(String message) {
        if (message == null) return new IntentResult();
        
        String lowerMessage = message.toLowerCase();

        // 1. Rule First, AI Second (COST OPTIMIZATION)
        if (lowerMessage.contains("sold")) {
            IntentResult result = new IntentResult();
            result.setType(IntentType.RECORD_SALE);
            result.setConfidence(1.0);
            
            // Basic naive extraction for rules (e.g. "Sold 2 shoes 30k")
            Matcher amountMatcher = Pattern.compile("(\\d+)k").matcher(lowerMessage);
            if (amountMatcher.find()) {
                result.setAmount(Double.parseDouble(amountMatcher.group(1)) * 1000);
            }
            return result;
        }

        if (lowerMessage.contains("invoice")) {
            IntentResult result = new IntentResult();
            result.setType(IntentType.CREATE_INVOICE);
            result.setConfidence(1.0);
            
            Matcher amountMatcher = Pattern.compile("(\\d+)k").matcher(lowerMessage);
            if (amountMatcher.find()) {
                result.setAmount(Double.parseDouble(amountMatcher.group(1)) * 1000);
            }
            return result;
        }

        // 2. AI Fallback for complex queries like "Can I restock?"
        String prompt = String.format("Analyze this message for SME tools: %s", message);
        
        // TODO: Call LLM API
        
        IntentResult result = new IntentResult();
        result.setType(IntentType.ASK_QUESTION); // default mock 
        result.setConfidence(0.8);
        return result;
    }
}
