package com.microinterns.hrplatform.controllers;

import com.microinterns.hrplatform.models.Student;
import com.microinterns.hrplatform.repositories.StudentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.Date;

import com.fasterxml.jackson.databind.ObjectMapper;

// 🔥 JWT IMPORTS
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RestController
@RequestMapping("/student-auth")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://microinterns-hr-platform-final.vercel.app"
})
public class StudentAuthController {

    private final StudentRepository studentRepository;

    // 🔥 SECRET KEY (same as application.properties)
    private final String SECRET = "microinterns-hr-secret-key-change-in-production-minimum-256-bits-required";

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

            // 🔥 Decode Google JWT (prototype-safe)
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
            // 🔥 FIND OR CREATE STUDENT
            // =========================

            Student student = studentRepository.findByEmail(email).orElse(null);

            if (student == null && name != null) {
                Optional<Student> match = studentRepository.findAll().stream()
                        .filter(s -> name.equalsIgnoreCase(s.getName()) && s.getEmail() == null)
                        .findFirst();
                student = match.orElse(null);
            }

            if (student == null) {
                student = new Student();
                student.setOnboardingCompleted(false);
                student.setOnboardingStatus("PENDING_ONBOARDING");
                student.generateOnboardingToken();
            }

            // =========================
            // 🔥 UPDATE DATA
            // =========================

            student.setEmail(email);
            student.setName(name != null ? name : "Student");

            if (student.getOnboardingToken() == null) {
                student.generateOnboardingToken();
            }

            if (student.getOnboardingStatus() == null) {
                student.setOnboardingStatus("PENDING_ONBOARDING");
            }

            studentRepository.save(student);

            // =========================
            // 🔥 GENERATE JWT TOKEN
            // =========================

            String jwt = Jwts.builder()
                    .setSubject(student.getEmail())
                    .claim("role", "STUDENT")
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                    .signWith(SignatureAlgorithm.HS256, SECRET)
                    .compact();

            // =========================
            // 🔥 RESPONSE
            // =========================

            return ResponseEntity.ok(Map.of(
                    "token", jwt, // 🔥 CRITICAL FIX
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