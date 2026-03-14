package com.example.demo.controller;

import com.example.demo.entity.Profile;
import com.example.demo.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileRepository profileRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal String userId) {
        return profileRepository.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal String userId, @RequestBody Profile updatedProfile) {
        return profileRepository.findById(userId).map(profile -> {
            // Update fields that are provided
            if (updatedProfile.getBusiness_name() != null) profile.setBusiness_name(updatedProfile.getBusiness_name());
            if (updatedProfile.getWhatsapp_number() != null) profile.setWhatsapp_number(updatedProfile.getWhatsapp_number());
            if (updatedProfile.getPlan() != null) profile.setPlan(updatedProfile.getPlan());
            if (updatedProfile.getEmail() != null) profile.setEmail(updatedProfile.getEmail());
            // Add other fields as needed based on the form data
            
            profileRepository.save(profile);
            return ResponseEntity.ok(profile);
        }).orElse(ResponseEntity.notFound().build());
    }
}
