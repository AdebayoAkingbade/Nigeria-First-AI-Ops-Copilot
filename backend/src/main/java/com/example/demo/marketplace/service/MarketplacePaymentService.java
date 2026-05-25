package com.example.demo.marketplace.service;

import com.example.demo.marketplace.dto.PaymentInitializationResult;
import com.example.demo.marketplace.entity.BuyerRequest;
import com.example.demo.marketplace.entity.MarketplaceCustomer;
import com.example.demo.marketplace.entity.MarketplaceInvoice;
import com.example.demo.marketplace.entity.MarketplaceMessage;
import com.example.demo.marketplace.entity.MarketplaceOrder;
import com.example.demo.marketplace.entity.MarketplaceTransaction;
import com.example.demo.marketplace.enums.InvoiceStatus;
import com.example.demo.marketplace.enums.OrderStatus;
import com.example.demo.marketplace.enums.RequestStatus;
import com.example.demo.marketplace.repository.MarketplaceCustomerRepository;
import com.example.demo.marketplace.repository.MarketplaceInvoiceRepository;
import com.example.demo.marketplace.repository.MarketplaceMessageRepository;
import com.example.demo.marketplace.repository.MarketplaceOrderRepository;
import com.example.demo.marketplace.repository.MarketplaceTransactionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class MarketplacePaymentService {

    private final MarketplaceInvoiceRepository marketplaceInvoiceRepository;
    private final MarketplaceTransactionRepository marketplaceTransactionRepository;
    private final MarketplaceOrderRepository marketplaceOrderRepository;
    private final MarketplaceCustomerRepository marketplaceCustomerRepository;
    private final MarketplaceMessageRepository marketplaceMessageRepository;
    private final WhatsAppCloudApiService whatsAppCloudApiService;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    @Value("${paystack.secret-key:}")
    private String paystackSecretKey;

    @Value("${paystack.base-url:https://api.paystack.co}")
    private String paystackBaseUrl;

    @Value("${paystack.callback-url:}")
    private String paystackCallbackUrl;

    public MarketplacePaymentService(MarketplaceInvoiceRepository marketplaceInvoiceRepository,
                                     MarketplaceTransactionRepository marketplaceTransactionRepository,
                                     MarketplaceOrderRepository marketplaceOrderRepository,
                                     MarketplaceCustomerRepository marketplaceCustomerRepository,
                                     MarketplaceMessageRepository marketplaceMessageRepository,
                                     WhatsAppCloudApiService whatsAppCloudApiService,
                                     ObjectMapper objectMapper) {
        this.marketplaceInvoiceRepository = marketplaceInvoiceRepository;
        this.marketplaceTransactionRepository = marketplaceTransactionRepository;
        this.marketplaceOrderRepository = marketplaceOrderRepository;
        this.marketplaceCustomerRepository = marketplaceCustomerRepository;
        this.marketplaceMessageRepository = marketplaceMessageRepository;
        this.whatsAppCloudApiService = whatsAppCloudApiService;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder().build();
    }

    @Transactional
    public PaymentInitializationResult initializePayment(MarketplaceOrder order) {
        String reference = "KDPL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String fallbackLink = "Paystack link pending setup. Reference: " + reference;

        String paymentLink = fallbackLink;
        boolean live = false;

        if (paystackSecretKey != null && !paystackSecretKey.isBlank()) {
            try {
                Map<String, Object> request = Map.of(
                    "email", buildBuyerEmail(order.getBuyerPhone()),
                    "amount", String.valueOf(order.getAmount() * 100),
                    "reference", reference,
                    "callback_url", paystackCallbackUrl == null ? "" : paystackCallbackUrl,
                    "metadata", Map.of(
                        "order_id", order.getId().toString(),
                        "buyer_phone", order.getBuyerPhone()
                    )
                );

                JsonNode response = restClient.post()
                    .uri(paystackBaseUrl + "/transaction/initialize")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + paystackSecretKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(JsonNode.class);

                paymentLink = response.path("data").path("authorization_url").asText(fallbackLink);
                live = response.path("status").asBoolean(false);
            } catch (Exception exception) {
                System.err.println("Paystack initialization failed: " + exception.getMessage());
            }
        }

        MarketplaceInvoice invoice = new MarketplaceInvoice();
        invoice.setOrder(order);
        invoice.setAmount(order.getAmount());
        invoice.setPaymentReference(reference);
        invoice.setPaymentLink(paymentLink);
        invoice.setStatus(InvoiceStatus.PENDING);
        marketplaceInvoiceRepository.save(invoice);

        return new PaymentInitializationResult(paymentLink, reference, live);
    }

    @Transactional
    public boolean handleWebhook(String rawBody, String signature) {
        if (paystackSecretKey != null && !paystackSecretKey.isBlank() && !isValidSignature(rawBody, signature)) {
            return false;
        }

        try {
            JsonNode payload = objectMapper.readTree(rawBody);
            String event = payload.path("event").asText("");
            if (!"charge.success".equals(event)) {
                return true;
            }

            JsonNode data = payload.path("data");
            String reference = data.path("reference").asText("");
            if (reference.isBlank()) {
                return false;
            }

            Optional<MarketplaceInvoice> invoiceOptional = marketplaceInvoiceRepository.findByPaymentReference(reference);
            if (invoiceOptional.isEmpty()) {
                return false;
            }

            MarketplaceInvoice invoice = invoiceOptional.get();
            invoice.setStatus(InvoiceStatus.PAID);
            marketplaceInvoiceRepository.save(invoice);

            MarketplaceOrder order = invoice.getOrder();
            order.setStatus(OrderStatus.PAID);
            marketplaceOrderRepository.save(order);

            MarketplaceTransaction transaction = new MarketplaceTransaction();
            transaction.setInvoice(invoice);
            transaction.setAmount(invoice.getAmount());
            transaction.setStatus("success");
            transaction.setPaidAt(LocalDateTime.now());
            transaction.setProviderReference(reference);
            marketplaceTransactionRepository.save(transaction);

            updateCustomerRecord(order);
            closeRequest(order.getRequest());
            sendCompletionMessages(order);
            return true;
        } catch (Exception exception) {
            return false;
        }
    }

    private void updateCustomerRecord(MarketplaceOrder order) {
        MarketplaceCustomer customer = marketplaceCustomerRepository
            .findByUserAndPhone(order.getUser(), order.getBuyerPhone())
            .orElseGet(MarketplaceCustomer::new);

        customer.setUser(order.getUser());
        customer.setPhone(order.getBuyerPhone());
        customer.setName("WhatsApp Buyer");
        customer.setTotalSpent(customer.getTotalSpent() + order.getAmount());
        customer.setLastSeen(LocalDateTime.now());
        marketplaceCustomerRepository.save(customer);

        order.setCustomer(customer);
        order.setStatus(OrderStatus.COMPLETED);
        marketplaceOrderRepository.save(order);
    }

    private void closeRequest(BuyerRequest request) {
        if (request != null) {
            request.setStatus(RequestStatus.CLOSED);
        }
    }

    private void sendCompletionMessages(MarketplaceOrder order) {
        String buyerMessage = "Payment confirmed.\n\nSeller: " + order.getUser().getBusinessName() +
            "\nProduct: " + order.getProduct() +
            "\nAmount: ₦" + String.format("%,d", order.getAmount());
        whatsAppCloudApiService.sendTextMessage(order.getBuyerPhone(), buyerMessage);
        logOutbound(order.getBuyerPhone(), null, "ai", buyerMessage);

        String sellerMessage = "Payment confirmed.\n\nBuyer: " + order.getBuyerPhone() +
            "\nProduct: " + order.getProduct() +
            "\nAmount: ₦" + String.format("%,d", order.getAmount());
        whatsAppCloudApiService.sendTextMessage(order.getUser().getPhone(), sellerMessage);
        logOutbound(order.getUser().getPhone(), order.getUser(), "seller", sellerMessage);
    }

    private boolean isValidSignature(String rawBody, String signature) {
        if (signature == null || signature.isBlank()) {
            return false;
        }

        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(paystackSecretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            String computed = HexFormat.of().formatHex(mac.doFinal(rawBody.getBytes(StandardCharsets.UTF_8)));
            return computed.equalsIgnoreCase(signature);
        } catch (Exception exception) {
            return false;
        }
    }

    private String buildBuyerEmail(String phone) {
        return "buyer-" + phone + "@kudipal.local";
    }

    private void logOutbound(String phone, com.example.demo.marketplace.entity.MarketplaceUser user, String sender, String content) {
        MarketplaceMessage message = new MarketplaceMessage();
        message.setConversationPhone(phone);
        message.setUser(user);
        message.setDirection("outbound");
        message.setSender(sender);
        message.setContent(content);
        marketplaceMessageRepository.save(message);
    }
}
