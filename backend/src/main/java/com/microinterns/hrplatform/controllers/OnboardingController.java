package com.microinterns.hrplatform.controllers;

import com.microinterns.hrplatform.models.Student;
import com.microinterns.hrplatform.models.Case;
import com.microinterns.hrplatform.repositories.StudentRepository;
import com.microinterns.hrplatform.repositories.CaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/students/onboarding")
public class OnboardingController {

    private static final Logger logger = LoggerFactory.getLogger(OnboardingController.class);

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CaseRepository caseRepository;

    // PUBLIC ENDPOINT: Get student by onboarding token (no auth required)
    @GetMapping("/{token}")
    public ResponseEntity<?> getStudentByToken(@PathVariable String token) {
        Optional<Student> studentOpt = studentRepository.findAll().stream()
                .filter(s -> token.equals(s.getOnboardingToken()))
                .findFirst();
        
        if (studentOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Invalid onboarding link"));
        }
        
        Student student = studentOpt.get();
        
        // Check if token is still valid
        if (!student.isTokenValid()) {
            return ResponseEntity.status(410).body(Map.of("error", "Onboarding link has expired or been used"));
        }
        
        return ResponseEntity.ok(student);
    }

    // PUBLIC ENDPOINT: Submit onboarding form (no auth required)
    @PostMapping(path = "/{token}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitOnboardingForm(
            @PathVariable String token,
            // Personal details
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String dob,
            @RequestParam(required = false) String emergencyContactName,
            @RequestParam(required = false) String emergencyContactPhone,
            @RequestParam(required = false) String emergencyContactRelation,
            // Education details (JSON string)
            @RequestParam(required = false) String educationDetails,
            // Work experience (JSON string)
            @RequestParam(required = false) String workExperience,
            // Government IDs
            @RequestParam(required = false) String nationalIdNumber,
            @RequestParam(required = false) String passportNumber,
            // Bank details
            @RequestParam(required = false) String bankAccountNumber,
            @RequestParam(required = false) String bankName,
            @RequestParam(required = false) String ifscCode,
            // Files
            @RequestPart(required = false) MultipartFile resume,
            @RequestPart(required = false) MultipartFile[] documents
    ) {
        try {
            Optional<Student> studentOpt = studentRepository.findAll().stream()
                    .filter(s -> token.equals(s.getOnboardingToken()))
                    .findFirst();
            
            if (studentOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Invalid onboarding link"));
            }
            
            Student student = studentOpt.get();
            
            if (!student.isTokenValid()) {
                return ResponseEntity.status(410).body(Map.of("error", "Onboarding link has expired or been used"));
            }
            
            // Update student details
            student.setPhone(phone);
            student.setAddress(address);
            student.setDob(dob);
            student.setEmergencyContactName(emergencyContactName);
            student.setEmergencyContactPhone(emergencyContactPhone);
            student.setEmergencyContactRelation(emergencyContactRelation);
            student.setEducationDetails(educationDetails);
            student.setWorkExperience(workExperience);
            student.setNationalIdNumber(nationalIdNumber);
            student.setPassportNumber(passportNumber);
            student.setBankAccountNumber(bankAccountNumber);
            student.setBankName(bankName);
            student.setIfscCode(ifscCode);
            
            // Handle file uploads
            Path uploads = Path.of("uploads");
            if (!Files.exists(uploads)) Files.createDirectories(uploads);
            
            if (resume != null && !resume.isEmpty()) {
                String filename = String.format("student-%d-resume-%s", 
                    student.getId(), 
                    resume.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_"));
                Path dest = uploads.resolve(filename);
                Files.copy(resume.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
                student.setResumeFilename(filename);
            }
            
            if (documents != null && documents.length > 0) {
                StringBuilder docList = new StringBuilder("[");
                for (int i = 0; i < documents.length; i++) {
                    MultipartFile doc = documents[i];
                    if (!doc.isEmpty()) {
                        String filename = String.format("student-%d-doc-%d-%s", 
                            student.getId(), 
                            i, 
                            doc.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_"));
                        Path dest = uploads.resolve(filename);
                        Files.copy(doc.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
                        if (i > 0) docList.append(",");
                        docList.append("\"").append(filename).append("\"");
                    }
                }
                docList.append("]");
                student.setDocuments(docList.toString());
            }
            
            // Mark onboarding as completed
            student.setOnboardingCompleted(true);
            student.setOnboardingStatus("ONBOARDING_COMPLETE");
            student.setAgreementAccepted(true);
            
            studentRepository.save(student);
            
            // Update case status to PENDING for HR verification
            caseRepository.findAll().stream()
                    .filter(c -> c.getStudent() != null && 
                                c.getStudent().getId() != null && 
                                c.getStudent().getId().equals(student.getId()))
                    .findFirst()
                    .ifPresent(c -> {
                        c.setStatus(Case.CaseStatus.PENDING);
                        caseRepository.save(c);
                        logger.info("Case {} updated to PENDING status for HR verification", c.getId());
                    });
            
            logger.info("Student {} completed onboarding successfully", student.getEmail());
            
            return ResponseEntity.ok(Map.of(
                "message", "Onboarding completed successfully! Your case is now pending HR verification."
            ));
            
        } catch (Exception e) {
            logger.error("Error processing onboarding form", e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to process onboarding: " + e.getMessage()));
        }
    }
}
