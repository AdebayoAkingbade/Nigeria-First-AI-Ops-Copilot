package com.example.demo.marketplace.service;

import com.example.demo.marketplace.dto.IntentDetectionResult;
import com.example.demo.marketplace.dto.PaymentInitializationResult;
import com.example.demo.marketplace.dto.SellerMatchResult;
import com.example.demo.marketplace.entity.BuyerRequest;
import com.example.demo.marketplace.entity.ConversationSession;
import com.example.demo.marketplace.entity.MarketplaceMessage;
import com.example.demo.marketplace.entity.MarketplaceOrder;
import com.example.demo.marketplace.entity.MarketplaceUser;
import com.example.demo.marketplace.enums.ConversationRole;
import com.example.demo.marketplace.enums.ConversationState;
import com.example.demo.marketplace.enums.OrderStatus;
import com.example.demo.marketplace.enums.RequestStatus;
import com.example.demo.marketplace.repository.BuyerRequestRepository;
import com.example.demo.marketplace.repository.ConversationSessionRepository;
import com.example.demo.marketplace.repository.MarketplaceMessageRepository;
import com.example.demo.marketplace.repository.MarketplaceOrderRepository;
import com.example.demo.marketplace.repository.MarketplaceUserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class MarketplaceChatService {

    private final MarketplacePhoneNumberService phoneNumberService;
    private final MarketplaceIntentService marketplaceIntentService;
    private final SellerMatchingService sellerMatchingService;
    private final MarketplaceUserRepository marketplaceUserRepository;
    private final BuyerRequestRepository buyerRequestRepository;
    private final MarketplaceOrderRepository marketplaceOrderRepository;
    private final ConversationSessionRepository conversationSessionRepository;
    private final MarketplaceMessageRepository marketplaceMessageRepository;
    private final WhatsAppCloudApiService whatsAppCloudApiService;
    private final MarketplacePaymentService marketplacePaymentService;
    private final ObjectMapper objectMapper;

    public MarketplaceChatService(MarketplacePhoneNumberService phoneNumberService,
                                  MarketplaceIntentService marketplaceIntentService,
                                  SellerMatchingService sellerMatchingService,
                                  MarketplaceUserRepository marketplaceUserRepository,
                                  BuyerRequestRepository buyerRequestRepository,
                                  MarketplaceOrderRepository marketplaceOrderRepository,
                                  ConversationSessionRepository conversationSessionRepository,
                                  MarketplaceMessageRepository marketplaceMessageRepository,
                                  WhatsAppCloudApiService whatsAppCloudApiService,
                                  MarketplacePaymentService marketplacePaymentService,
                                  ObjectMapper objectMapper) {
        this.phoneNumberService = phoneNumberService;
        this.marketplaceIntentService = marketplaceIntentService;
        this.sellerMatchingService = sellerMatchingService;
        this.marketplaceUserRepository = marketplaceUserRepository;
        this.buyerRequestRepository = buyerRequestRepository;
        this.marketplaceOrderRepository = marketplaceOrderRepository;
        this.conversationSessionRepository = conversationSessionRepository;
        this.marketplaceMessageRepository = marketplaceMessageRepository;
        this.whatsAppCloudApiService = whatsAppCloudApiService;
        this.marketplacePaymentService = marketplacePaymentService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public void handleIncomingText(String rawPhone, String message, JsonNode rawPayload) {
        String phone = phoneNumberService.normalize(rawPhone);
        Optional<MarketplaceUser> seller = marketplaceUserRepository.findByPhone(phone);
        logMessage(phone, seller.orElse(null), "inbound", seller.isPresent() ? "seller" : "buyer", message, rawPayload);

        ConversationSession session = conversationSessionRepository.findByPhone(phone).orElse(null);
        if (session != null && session.getRole() == ConversationRole.SELLER) {
            handleSellerReply(session, message);
            return;
        }

        if (session != null && session.getRole() == ConversationRole.BUYER
            && session.getState() == ConversationState.AWAITING_BUYER_SELECTION) {
            handleBuyerSelection(session, message);
            return;
        }

        if (session != null && session.getRole() == ConversationRole.BUYER
            && session.getState() == ConversationState.AWAITING_BUYER_PAYMENT) {
            resendPaymentDetails(session);
            return;
        }

        handleNewBuyerRequest(phone, message);
    }

    private void handleNewBuyerRequest(String phone, String message) {
        IntentDetectionResult result = marketplaceIntentService.detect(message);
        if (!"BUY_REQUEST".equalsIgnoreCase(result.getIntent())
            || result.getProduct().isBlank()
            || result.getBudget() <= 0
            || result.getLocation().isBlank()) {
            sendAndLog(phone, null,
                "Send your request like this:\n1. Product\n2. Budget\n3. Location\n\nExample:\nI want to buy timberland brown shoe 35k Lekki");
            return;
        }

        BuyerRequest buyerRequest = new BuyerRequest();
        buyerRequest.setBuyerPhone(phone);
        buyerRequest.setProduct(result.getProduct());
        buyerRequest.setBudget(result.getBudget());
        buyerRequest.setLocation(result.getLocation());
        buyerRequest.setStatus(RequestStatus.OPEN);
        buyerRequestRepository.save(buyerRequest);

        List<SellerMatchResult> matches = sellerMatchingService.findTopMatches(result);
        if (matches.isEmpty()) {
            sendAndLog(phone, null,
                "No seller found yet for " + result.getProduct() + " in " + result.getLocation() +
                    ".\n\nReply with another product or location.");
            return;
        }

        ConversationSession buyerSession = conversationSessionRepository.findByPhone(phone).orElseGet(ConversationSession::new);
        buyerSession.setPhone(phone);
        buyerSession.setRole(ConversationRole.BUYER);
        buyerSession.setState(ConversationState.AWAITING_BUYER_SELECTION);
        buyerSession.setActiveRequest(buyerRequest);
        buyerSession.setOptionPayloadJson(writeAsJson(matches));
        buyerSession.setLastInboundAt(LocalDateTime.now());
        conversationSessionRepository.save(buyerSession);

        sendAndLog(phone, null, formatBuyerOptions(matches));
    }

    private void handleBuyerSelection(ConversationSession session, String message) {
        int selectedIndex = parseNumericChoice(message);
        List<SellerMatchResult> matches = readMatches(session.getOptionPayloadJson());
        if (selectedIndex < 1 || selectedIndex > matches.size()) {
            sendAndLog(session.getPhone(), null, "Reply with 1, 2 or 3 to choose a seller.");
            return;
        }

        SellerMatchResult selected = matches.get(selectedIndex - 1);
        MarketplaceUser seller = marketplaceUserRepository.findById(selected.getSellerId()).orElse(null);
        if (seller == null) {
            sendAndLog(session.getPhone(), null, "That seller is not available now. Reply with another option.");
            return;
        }

        BuyerRequest request = session.getActiveRequest();
        request.setMatchedUser(seller);
        request.setStatus(RequestStatus.MATCHED);
        buyerRequestRepository.save(request);

        MarketplaceOrder order = new MarketplaceOrder();
        order.setUser(seller);
        order.setRequest(request);
        order.setBuyerPhone(session.getPhone());
        order.setProduct(request.getProduct());
        order.setQuantity(1);
        order.setAmount(selected.getPrice());
        order.setStatus(OrderStatus.PENDING_SELLER_ACCEPTANCE);
        marketplaceOrderRepository.save(order);

        session.setActiveOrder(order);
        session.setState(ConversationState.IDLE);
        conversationSessionRepository.save(session);

        ConversationSession sellerSession = conversationSessionRepository.findByPhone(seller.getPhone()).orElseGet(ConversationSession::new);
        sellerSession.setPhone(seller.getPhone());
        sellerSession.setRole(ConversationRole.SELLER);
        sellerSession.setState(ConversationState.AWAITING_SELLER_RESPONSE);
        sellerSession.setActiveRequest(request);
        sellerSession.setActiveOrder(order);
        sellerSession.setLastOutboundAt(LocalDateTime.now());
        conversationSessionRepository.save(sellerSession);

        sendAndLog(session.getPhone(), null,
            seller.getBusinessName() + " has been notified.\n\nWe will message you when the seller replies.");

        String sellerMessage = "New customer request\n\n" +
            "Product: " + request.getProduct() + "\n" +
            "Budget: ₦" + String.format("%,d", request.getBudget()) + "\n" +
            "Location: " + request.getLocation() + "\n\n" +
            "Reply:\n1 -> Accept\n2 -> Decline";
        sendAndLog(seller.getPhone(), seller, sellerMessage);
    }

    private void handleSellerReply(ConversationSession session, String message) {
        MarketplaceOrder order = session.getActiveOrder();
        if (order == null) {
            session.setState(ConversationState.CLOSED);
            conversationSessionRepository.save(session);
            return;
        }

        int choice = parseNumericChoice(message);
        if (session.getState() == ConversationState.AWAITING_SELLER_RESPONSE) {
            if (choice == 1) {
                order.setStatus(OrderStatus.SELLER_ACCEPTED);
                marketplaceOrderRepository.save(order);

                session.setState(ConversationState.AWAITING_SELLER_QUICK_REPLY);
                session.setLastInboundAt(LocalDateTime.now());
                conversationSessionRepository.save(session);

                sendAndLog(session.getPhone(), order.getUser(),
                    "Great.\n\nSend quick reply:\n1 -> Available, pay now\n2 -> Available, delivery tomorrow");
                return;
            }

            if (choice == 2) {
                order.setStatus(OrderStatus.DECLINED);
                marketplaceOrderRepository.save(order);
                session.setState(ConversationState.CLOSED);
                conversationSessionRepository.save(session);

                ConversationSession buyerSession = conversationSessionRepository.findByPhone(order.getBuyerPhone()).orElse(null);
                if (buyerSession != null) {
                    List<SellerMatchResult> remaining = new ArrayList<>(readMatches(buyerSession.getOptionPayloadJson()));
                    remaining.removeIf(match -> match.getSellerId().equals(order.getUser().getId()));
                    if (remaining.isEmpty()) {
                        buyerSession.setState(ConversationState.CLOSED);
                        conversationSessionRepository.save(buyerSession);
                        sendAndLog(order.getBuyerPhone(), null,
                            "That seller declined.\n\nReply with another request and I will search again.");
                    } else {
                        buyerSession.setState(ConversationState.AWAITING_BUYER_SELECTION);
                        buyerSession.setOptionPayloadJson(writeAsJson(remaining));
                        conversationSessionRepository.save(buyerSession);
                        sendAndLog(order.getBuyerPhone(), null,
                            "That seller declined.\n\nChoose another seller:\n\n" + formatBuyerOptions(remaining));
                    }
                }
                return;
            }

            sendAndLog(session.getPhone(), order.getUser(), "Reply 1 to accept or 2 to decline.");
            return;
        }

        if (session.getState() == ConversationState.AWAITING_SELLER_QUICK_REPLY) {
            if (choice != 1 && choice != 2) {
                sendAndLog(session.getPhone(), order.getUser(), "Reply 1 or 2.");
                return;
            }

            String sellerNote = choice == 1 ? "Available, pay now" : "Available, delivery tomorrow";
            order.setSellerNote(sellerNote);
            order.setStatus(OrderStatus.AWAITING_PAYMENT);
            marketplaceOrderRepository.save(order);

            PaymentInitializationResult payment = marketplacePaymentService.initializePayment(order);

            ConversationSession buyerSession = conversationSessionRepository.findByPhone(order.getBuyerPhone()).orElseGet(ConversationSession::new);
            buyerSession.setPhone(order.getBuyerPhone());
            buyerSession.setRole(ConversationRole.BUYER);
            buyerSession.setState(ConversationState.AWAITING_BUYER_PAYMENT);
            buyerSession.setActiveOrder(order);
            buyerSession.setActiveRequest(order.getRequest());
            buyerSession.setOptionPayloadJson(writeAsJson(Map.of(
                "paymentReference", payment.getReference(),
                "paymentLink", payment.getPaymentLink()
            )));
            buyerSession.setLastOutboundAt(LocalDateTime.now());
            conversationSessionRepository.save(buyerSession);

            session.setState(ConversationState.COMPLETED);
            conversationSessionRepository.save(session);

            sendAndLog(order.getBuyerPhone(), null,
                order.getUser().getBusinessName() + " accepted your request.\n\n" +
                    sellerNote + "\n" +
                    "Amount: ₦" + String.format("%,d", order.getAmount()) + "\n" +
                    "Pay here: " + payment.getPaymentLink() + "\n\n" +
                    "If you are idle, I will remind you.");

            sendAndLog(session.getPhone(), order.getUser(),
                "Buyer notified.\n\nReference: " + payment.getReference());
        }
    }

    private void resendPaymentDetails(ConversationSession session) {
        JsonNode payload = readJson(session.getOptionPayloadJson());
        String paymentLink = payload.path("paymentLink").asText("");
        sendAndLog(session.getPhone(), null,
            "Your order is waiting.\n\nPay here: " + paymentLink + "\n\nReply after payment and I will watch for confirmation.");
    }

    public void sendReminderForPendingOrder(MarketplaceOrder order) {
        ConversationSession buyerSession = conversationSessionRepository.findByPhone(order.getBuyerPhone()).orElse(null);
        if (buyerSession == null || buyerSession.getState() != ConversationState.AWAITING_BUYER_PAYMENT) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        if (buyerSession.getReminderSentAt() != null && buyerSession.getReminderSentAt().isAfter(now.minusMinutes(30))) {
            return;
        }

        sendAndLog(order.getBuyerPhone(), null,
            "Reminder: Your order with " + order.getUser().getBusinessName() + " is waiting.\n\nReply to continue.");
        buyerSession.setReminderSentAt(now);
        conversationSessionRepository.save(buyerSession);
    }

    private void sendAndLog(String phone, MarketplaceUser user, String body) {
        whatsAppCloudApiService.sendTextMessage(phone, body);
        logMessage(phone, user, "outbound", user == null ? "ai" : "seller", body, null);
    }

    private void logMessage(String phone, MarketplaceUser user, String direction, String sender, String content, JsonNode metadata) {
        MarketplaceMessage message = new MarketplaceMessage();
        message.setConversationPhone(phone);
        message.setUser(user);
        message.setDirection(direction);
        message.setSender(sender);
        message.setContent(content);
        message.setMetadataJson(metadata == null ? null : metadata.toString());
        marketplaceMessageRepository.save(message);
    }

    private String formatBuyerOptions(List<SellerMatchResult> matches) {
        StringBuilder builder = new StringBuilder("I found these sellers near you\n\n");
        for (int index = 0; index < matches.size(); index++) {
            SellerMatchResult match = matches.get(index);
            builder.append(index + 1)
                .append(". ")
                .append(match.getSellerName())
                .append(" - ₦")
                .append(String.format("%,d", match.getPrice()))
                .append(" (")
                .append(match.getLocation().isBlank() ? "Nearby" : match.getLocation())
                .append(")\n");
        }
        builder.append("\nReply with 1, 2 or 3 to choose a seller");
        return builder.toString();
    }

    private int parseNumericChoice(String message) {
        String cleaned = message == null ? "" : message.trim();
        if (cleaned.matches("\\d+")) {
            return Integer.parseInt(cleaned);
        }
        return -1;
    }

    private List<SellerMatchResult> readMatches(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<SellerMatchResult>>() {
            });
        } catch (Exception exception) {
            return List.of();
        }
    }

    private JsonNode readJson(String json) {
        try {
            return objectMapper.readTree(json);
        } catch (Exception exception) {
            return objectMapper.createObjectNode();
        }
    }

    private String writeAsJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception exception) {
            return "[]";
        }
    }
}
