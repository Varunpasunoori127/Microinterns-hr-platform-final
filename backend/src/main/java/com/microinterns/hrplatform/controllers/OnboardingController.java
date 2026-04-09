package com.microinterns.hrplatform.controllers;

import com.microinterns.hrplatform.models.Student;
import com.microinterns.hrplatform.repositories.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/students/onboarding")
public class OnboardingController {

    @Autowired
    private StudentRepository studentRepository;

    // =========================
    // GET STUDENT BY TOKEN
    // =========================
    @GetMapping("/{token}")
    public ResponseEntity<?> getByToken(@PathVariable String token) {

        Student student = studentRepository.findByOnboardingToken(token)
                .orElse(null);

        if (student == null) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        return ResponseEntity.ok(student); // ✅ FIXED
    }

    // =========================
    // SUBMIT ONBOARDING FORM
    // =========================
    @PostMapping("/{token}")
    public ResponseEntity<?> submitOnboarding(
            @PathVariable String token,
            @RequestParam Map<String, String> params,
            @RequestParam(required = false) MultipartFile file
    ) {

        Student student = studentRepository.findByOnboardingToken(token)
                .orElse(null);

        if (student == null) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        // =========================
        // BASIC
        // =========================
        student.setName(params.getOrDefault("name", ""));
        student.setPhone(params.getOrDefault("phone", ""));
        student.setDob(params.getOrDefault("dob", ""));

        // =========================
        // PERSONAL
        // =========================
        student.setNationality(params.getOrDefault("nationality", ""));
        student.setGender(params.getOrDefault("gender", ""));

        // =========================
        // ADDRESS
        // =========================
        student.setAddress(params.getOrDefault("address", ""));
        student.setCity(params.getOrDefault("city", ""));
        student.setPostcode(params.getOrDefault("postcode", ""));

        // =========================
        // EDUCATION
        // =========================
        student.setUniversity(params.getOrDefault("university", ""));
        student.setCourse(params.getOrDefault("course", ""));
        student.setYear(params.getOrDefault("year", ""));
        student.setEducationDetails(params.getOrDefault("educationDetails", ""));

        // =========================
        // WORK
        // =========================
        student.setRightToWork(params.getOrDefault("rightToWork", ""));
        student.setWorkExperience(params.getOrDefault("workExperience", ""));

        // =========================
        // EMERGENCY
        // =========================
        student.setEmergencyContactName(params.getOrDefault("emergencyName", ""));
        student.setEmergencyContactPhone(params.getOrDefault("emergencyPhone", ""));
        student.setEmergencyContactRelation(params.getOrDefault("emergencyRelation", ""));

        // =========================
        // BANK
        // =========================
        student.setBankName(params.getOrDefault("bankName", ""));
        student.setBankAccountNumber(params.getOrDefault("accountNumber", ""));
        student.setSortCode(params.getOrDefault("sortCode", ""));
        student.setIfscCode(params.getOrDefault("ifscCode", ""));

        // =========================
        // FILE
        // =========================
        
        // =========================
        // STATUS
        // =========================
        
        student.setOnboardingCompleted(true);
        student.setOnboardingStatus("ONBOARDING_COMPLETE");

        studentRepository.save(student);

        return ResponseEntity.ok(student);
    }
}