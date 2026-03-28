package com.example.demo.controller;

import com.example.demo.entity.Receipt;
import com.example.demo.repository.ReceiptRepository;
import com.example.demo.service.UploadQueueService;
import com.example.demo.service.UploadStorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private final ReceiptRepository receiptRepository;
    private final UploadStorageService uploadStorageService;
    private final UploadQueueService uploadQueueService;

    public UploadController(
        ReceiptRepository receiptRepository,
        UploadStorageService uploadStorageService,
        UploadQueueService uploadQueueService
    ) {
        this.receiptRepository = receiptRepository;
        this.uploadStorageService = uploadStorageService;
        this.uploadQueueService = uploadQueueService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(
        @AuthenticationPrincipal(expression = "subject") String userId,
        @RequestPart("file") MultipartFile file
    ) throws Exception {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please choose a file to upload."));
        }

        String storagePath = uploadStorageService.store(userId, file);

        Receipt receipt = new Receipt();
        receipt.setUser_id(userId);
        receipt.setStorage_path(storagePath);
        receipt.setFile_name(file.getOriginalFilename());
        receipt.setContent_type(file.getContentType());
        receipt.setStatus("queued");
        receipt.setCreated_at(LocalDateTime.now());

        Receipt savedReceipt = receiptRepository.save(receipt);
        uploadQueueService.enqueue(savedReceipt.getId());

        return ResponseEntity.accepted().body(Map.of(
            "message", "Your file has been received and queued for processing.",
            "receipt", savedReceipt
        ));
    }
}
