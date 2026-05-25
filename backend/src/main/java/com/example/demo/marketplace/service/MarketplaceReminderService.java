package com.example.demo.marketplace.service;

import com.example.demo.marketplace.enums.OrderStatus;
import com.example.demo.marketplace.repository.MarketplaceOrderRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MarketplaceReminderService {

    private final MarketplaceOrderRepository marketplaceOrderRepository;
    private final MarketplaceChatService marketplaceChatService;

    @Value("${marketplace.reminder.minutes:30}")
    private long reminderMinutes;

    public MarketplaceReminderService(MarketplaceOrderRepository marketplaceOrderRepository,
                                      MarketplaceChatService marketplaceChatService) {
        this.marketplaceOrderRepository = marketplaceOrderRepository;
        this.marketplaceChatService = marketplaceChatService;
    }

    @Scheduled(fixedDelay = 300000)
    public void sendIdleBuyerReminders() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(reminderMinutes);
        marketplaceOrderRepository.findByStatusInAndUpdatedAtBefore(List.of(OrderStatus.AWAITING_PAYMENT), cutoff)
            .forEach(marketplaceChatService::sendReminderForPendingOrder);
    }
}
