package com.microinterns.hrplatform.controllers;

import com.microinterns.hrplatform.models.Student;
import com.microinterns.hrplatform.repositories.StudentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/student-auth")
@CrossOrigin(origins = "*")
public class StudentAuthController {

    private final StudentRepository studentRepository;

    public StudentAuthController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {

        try {
            String credential = body.get("credential");

            if (credential == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing credential"));
            }

            // 🔥 Decode Google JWT
            String[] parts = credential.split("\\.");
            String payload = new String(Base64.getDecoder().decode(parts[1]));

            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> googleData = mapper.readValue(payload, Map.class);

            String email = (String) googleData.get("email");
            String name = (String) googleData.get("name");

            if (email == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email not found"));
            }

            // 🔥 Create or fetch student
            Student student = studentRepository.findByEmail(email).orElseGet(() -> {

                Student newStudent = new Student();
                newStudent.setEmail(email);
                newStudent.setName(name != null ? name : "Student");
                newStudent.setOnboardingCompleted(false);
                newStudent.setOnboardingStatus("PENDING_ONBOARDING");

                newStudent.generateOnboardingToken();

                return studentRepository.save(newStudent);
            });

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