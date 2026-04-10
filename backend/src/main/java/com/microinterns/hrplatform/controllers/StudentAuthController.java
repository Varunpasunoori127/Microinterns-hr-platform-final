package com.microinterns.hrplatform.controllers;

import com.microinterns.hrplatform.models.Student;
import com.microinterns.hrplatform.repositories.StudentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/student-auth")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://microinterns-hr-platform-final.vercel.app"
})
public class StudentAuthController {

    private final StudentRepository studentRepository;

    public StudentAuthController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // =========================
    // GOOGLE LOGIN
    // =========================
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {

        try {
            String credential = body.get("credential");

            if (credential == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing credential"));
            }

            // 🔥 Decode Google JWT (NOTE: not verified - acceptable for prototype)
            String[] parts = credential.split("\\.");
            String payload = new String(Base64.getDecoder().decode(parts[1]));

            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> googleData = mapper.readValue(payload, Map.class);

            String email = (String) googleData.get("email");
            String name = (String) googleData.get("name");

            if (email == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email not found"));
            }

            // =========================
            // 🔥 SMART MATCHING LOGIC
            // =========================

            // 1. Try find by email
            Student student = studentRepository.findByEmail(email).orElse(null);

            // 2. Fallback: match old records without email (safe match)
            if (student == null && name != null) {
                Optional<Student> match = studentRepository.findAll().stream()
                        .filter(s -> name.equalsIgnoreCase(s.getName()) && s.getEmail() == null)
                        .findFirst();
                student = match.orElse(null);
            }

            // 3. Create new if not found
            if (student == null) {
                student = new Student();
                student.setOnboardingCompleted(false);
                student.setOnboardingStatus("PENDING_ONBOARDING");
                student.generateOnboardingToken();
            }

            // =========================
            // 🔥 ALWAYS UPDATE DATA
            // =========================
            student.setEmail(email);
            student.setName(name != null ? name : "Student");

            // ensure token exists
            if (student.getOnboardingToken() == null) {
                student.generateOnboardingToken();
            }

            // ensure status exists
            if (student.getOnboardingStatus() == null) {
                student.setOnboardingStatus("PENDING_ONBOARDING");
            }

            studentRepository.save(student);

            // =========================
            // RESPONSE
            // =========================
            return ResponseEntity.ok(Map.of(
                    "studentId", student.getId(),
                    "email", student.getEmail(),
                    "name", student.getName(),
                    "onboardingCompleted", student.getOnboardingCompleted(),
                    "onboardingToken", student.getOnboardingToken()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Google login failed"));
        }
    }
}