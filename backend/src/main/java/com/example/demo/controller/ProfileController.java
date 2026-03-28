package com.example.demo.controller;

import com.example.demo.entity.Profile;
import com.example.demo.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileRepository profileRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt != null ? jwt.getSubject() : null;
        if (userId == null) {
            return ResponseEntity.status(401).body("{\"error\":\"unauthorized\",\"message\":\"Missing subject in token\"}");
        }

        try {
            UUID id = UUID.fromString(userId);
            return profileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("{\"error\":\"bad_request\",\"message\":\"Invalid user ID format\"}");
        } catch (Exception e) {
            e.printStackTrace();
            String rootCause = e.getCause() != null ? e.getCause().getMessage() : e.getMessage();
            return ResponseEntity.status(500).body("{\"error\":\"internal_server_error\",\"message\":\"" + rootCause + "\"}");
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal Jwt jwt, @RequestBody Profile updatedProfile) {
        String userId = jwt != null ? jwt.getSubject() : null;
        if (userId == null) {
            return ResponseEntity.status(401).body("{\"error\":\"unauthorized\",\"message\":\"Missing subject in token\"}");
        }

        try {
            UUID id = UUID.fromString(userId);
            return profileRepository.findById(id).map(profile -> {
                // Basic Info
                if (updatedProfile.getFull_name() != null) profile.setFull_name(updatedProfile.getFull_name());
                if (updatedProfile.getEmail() != null) profile.setEmail(updatedProfile.getEmail());
                
                // Business Info
                if (updatedProfile.getBusiness_name() != null) profile.setBusiness_name(updatedProfile.getBusiness_name());
                if (updatedProfile.getBusiness_type() != null) profile.setBusiness_type(updatedProfile.getBusiness_type());
                if (updatedProfile.getIndustry() != null) profile.setIndustry(updatedProfile.getIndustry());
                if (updatedProfile.getCac_registration_number() != null) profile.setCac_registration_number(updatedProfile.getCac_registration_number());
                if (updatedProfile.getIncorporation_date() != null) profile.setIncorporation_date(updatedProfile.getIncorporation_date());
                if (updatedProfile.getBusiness_size() != null) profile.setBusiness_size(updatedProfile.getBusiness_size());
                if (updatedProfile.getMonthly_revenue_range() != null) profile.setMonthly_revenue_range(updatedProfile.getMonthly_revenue_range());
                if (updatedProfile.getBusiness_goals() != null) profile.setBusiness_goals(updatedProfile.getBusiness_goals());
                
                // App state
                if (updatedProfile.getWhatsapp_number() != null) profile.setWhatsapp_number(updatedProfile.getWhatsapp_number());
                if (updatedProfile.getPhone_number() != null) profile.setPhone_number(updatedProfile.getPhone_number());
                if (updatedProfile.getPlan() != null) profile.setPlan(updatedProfile.getPlan());
                
                profile.setUpdated_at(java.time.LocalDateTime.now());
                
                profileRepository.save(profile);
                return ResponseEntity.ok(profile);
            }).orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("{\"error\":\"bad_request\",\"message\":\"Invalid user ID format\"}");
        } catch (Exception e) {
            e.printStackTrace();
            String rootCause = e.getCause() != null ? e.getCause().getMessage() : e.getMessage();
            return ResponseEntity.status(500).body("{\"error\":\"internal_server_error\",\"message\":\"" + rootCause + "\"}");
        }
    }
}
