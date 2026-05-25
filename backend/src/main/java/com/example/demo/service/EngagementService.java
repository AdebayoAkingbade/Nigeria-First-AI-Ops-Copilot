package com.example.demo.service;

import com.example.demo.entity.Profile;
import com.example.demo.entity.Transaction;
import com.example.demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class EngagementService {

    @Autowired
    private WhatsAppService whatsappService;

    @Autowired
    private TransactionRepository transactionRepository;

    public void sendOnboardingMessage(Profile profile) {
        String businessName = profile.getBusiness_name() != null ? profile.getBusiness_name() : "there";
        String message = String.format(
            "👋 Hi %s!\n\n" +
            "I’ll help you understand your business money.\n\n" +
            "Here’s what I can do:\n" +
            "✅ Show your weekly summary\n" +
            "✅ Warn you about risks\n" +
            "✅ Answer business questions\n\n" +
            "Type:\n" +
            "1 → See this week’s summary\n" +
            "2 → Ask a question\n\n" +
            "Your data is secure. We don't share your data.",
            businessName
        );
        
        String phone = profile.getWhatsapp_number() != null ? profile.getWhatsapp_number() : profile.getPhone_number();
        if (phone != null) {
            whatsappService.sendMessage(phone, message);
        }
    }

    public void sendWeeklySummary(Profile profile) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusWeeks(1);
        
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateRange(profile.getId(), start, end);
        
        BigDecimal moneyIn = BigDecimal.ZERO;
        BigDecimal moneyOut = BigDecimal.ZERO;
        
        for (Transaction t : transactions) {
            if ("in".equals(t.getDirection())) {
                moneyIn = moneyIn.add(t.getAmount());
            } else {
                moneyOut = moneyOut.add(t.getAmount());
            }
        }
        
        String message = String.format(
            "📊 Weekly Summary for %s\n\n" +
            "💰 Money you made: ₦%,.2f\n" +
            "💸 Money you spent: ₦%,.2f\n\n",
            profile.getBusiness_name(), moneyIn, moneyOut
        );

        if (moneyOut.compareTo(moneyIn) > 0) {
            message += "⚠️ Warning: You spent more than you made this week. Would you like to see why?\n\n";
        } else {
            message += "✅ Great job! You made a profit this week.\n\n";
        }

        message += "Type 2 to ask me anything about these numbers!";
        
        String phone = profile.getWhatsapp_number() != null ? profile.getWhatsapp_number() : profile.getPhone_number();
        if (phone != null) {
            whatsappService.sendMessage(phone, message);
        }
    }
}
