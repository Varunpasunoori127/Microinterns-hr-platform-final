package com.microinterns.hrplatform.controllers;

import com.microinterns.hrplatform.models.Student;
import com.microinterns.hrplatform.models.Case;
import com.microinterns.hrplatform.models.HRUser;
import com.microinterns.hrplatform.repositories.StudentRepository;
import com.microinterns.hrplatform.repositories.CaseRepository;
import com.microinterns.hrplatform.repositories.HRUserRepository;
import com.microinterns.hrplatform.services.EmailService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.*;
import com.microinterns.hrplatform.models.StudentSkill;
import com.microinterns.hrplatform.models.Mentor;
import com.microinterns.hrplatform.models.MentorSkill;
import com.microinterns.hrplatform.repositories.StudentSkillRepository;
import com.microinterns.hrplatform.repositories.MentorRepository;
import com.microinterns.hrplatform.repositories.MentorSkillRepository;

@RestController
@RequestMapping("/students")
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private HRUserRepository hrUserRepository;
    @Autowired
    private StudentSkillRepository studentSkillRepo;

    @Autowired
    private MentorRepository mentorRepo;

    @Autowired
    private MentorSkillRepository mentorSkillRepo;

    // ✅ OPTIONAL EMAIL SERVICE (NO CRASH)
    @Autowired(required = false)
    private EmailService emailService;

    // =========================
    // GET ALL STUDENTS
    // =========================
  @GetMapping
public List<StudentResponse> getAllStudents() {

    List<Student> students = studentRepository.findAll();

    return students.stream().map(s -> {

        StudentResponse resp = new StudentResponse();

        resp.id = s.getId();
        resp.name = s.getName();
        resp.org = s.getOrg();

        // 🔥 IMPORTANT FIX — STATUS FROM STUDENT
        resp.status = s.getOnboardingStatus();

        // 🔥 IMPORTANT FIX — MENTOR FROM STUDENT
        if (s.getMentor() != null) {
            Owner o = new Owner();
            o.name = s.getMentor().getName();
            resp.caseOwner = o;
        }

        return resp;

    }).toList();
}
    // =========================
    // GET STUDENT BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudent(@PathVariable Long id) {

        Optional<Student> maybe = studentRepository.findById(id);

        if (maybe.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Student s = maybe.get();

        List<Case> cases = caseRepository.findAll()
                .stream()
                .filter(c -> c.getStudent() != null && c.getStudent().getId().equals(id))
                .toList();

        return ResponseEntity.ok(Map.of(
                "student", s,
                "internships", cases
        ));
    }

    // =========================
    // ADD STUDENT (NO SECURITY)
    // =========================
    @PostMapping
    public ResponseEntity<?> addStudent(@Valid @RequestBody Student student) {

        try {

            logger.info("Adding student {}", student.getEmail());

            // Generate onboarding token
            student.generateOnboardingToken();
            student.setOnboardingStatus("PENDING_ONBOARDING");
            student.setOnboardingCompleted(false);

            Student savedStudent = studentRepository.save(student);

            String onboardingLink = "http://localhost:5173/onboarding/" + savedStudent.getOnboardingToken();

            // Optional HR assignment (skip if not logged in)
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String loggedInEmail = authentication.getName();

                Optional<HRUser> hrUserOpt = hrUserRepository.findByEmail(loggedInEmail);

                if (hrUserOpt.isPresent()) {

                    HRUser owner = hrUserOpt.get();

                    Case newCase = new Case();
                    newCase.setStudent(savedStudent);
                    newCase.setOwner(owner);
                    newCase.setStatus(Case.CaseStatus.PENDING);
                    newCase.setRole(student.getOrg() + " Intern");

                    caseRepository.save(newCase);

                    // ✅ SAFE EMAIL
                    if (emailService != null) {
                        emailService.sendOnboardingEmail(savedStudent);
                        emailService.sendCaseAssignmentEmail(owner.getEmail(), savedStudent);
                    } else {
                        logger.info("DEV MODE: Emails skipped");
                    }
                }

            } catch (Exception ignored) {
                logger.info("DEV MODE: No logged-in HR user");
            }

            return ResponseEntity.ok(Map.of(
                    "id", savedStudent.getId(),
                    "message", "Student added successfully",
                    "onboardingToken", savedStudent.getOnboardingToken(),
                    "onboardingLink", onboardingLink
            ));

        } catch (Exception e) {

            logger.error("Error adding student", e);

            return ResponseEntity.status(500).body(
                    Map.of("error", "Failed to add student: " + e.getMessage())
            );
        }
    }
    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveStudent(@PathVariable Long id) {

             Student student = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found"));

             student.setOnboardingStatus("ACTIVE");
             studentRepository.save(student);

        return ResponseEntity.ok(Map.of(
            "message", "Student approved successfully"
    ));
    }

    // =========================
    // ONBOARD STUDENT
    // =========================
    @PostMapping(path = "/onboard", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> onboardStudent(

            @RequestParam String name,
            @RequestParam String email,
            @RequestParam(required = false) String org,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String dob,
            @RequestParam(required = false, defaultValue = "false") boolean agreementAccepted,
            @RequestPart(required = false) MultipartFile resume
    ) {

        try {

            Student s = new Student();

            s.setName(name);
            s.setEmail(email);
            s.setOrg(org);
            s.setPhone(phone);
            s.setAddress(address);
            s.setDob(dob);
            s.setAgreementAccepted(agreementAccepted);
            s.setOnboardingStatus("ONBOARDED");

            s = studentRepository.save(s);

            if (resume != null && !resume.isEmpty()) {

                Path uploads = Path.of("uploads");

                if (!Files.exists(uploads)) {
                    Files.createDirectories(uploads);
                }

                String filename = "student-" + s.getId() + "-resume-" + resume.getOriginalFilename();

                Path dest = uploads.resolve(filename);

                Files.copy(resume.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

                s.setResumeFilename(filename);
                studentRepository.save(s);
            }

            return ResponseEntity.ok(Map.of("id", s.getId()));

        } catch (Exception ex) {

            ex.printStackTrace();
            return ResponseEntity.status(500).body("failed to onboard");
        }
    }
    @PostMapping("/skills/{token}")
    public ResponseEntity<?> saveSkills(
        @PathVariable String token,
        @RequestBody List<Map<String, String>> skills
) {

    Student student = studentRepository.findAll()
            .stream()
            .filter(s -> token.equals(s.getOnboardingToken()))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Student not found"));

    // Save skills
    for (Map<String, String> s : skills) {
        StudentSkill ss = new StudentSkill();
        ss.setStudent(student);
        ss.setSkill(s.get("skill"));
        ss.setLevel(s.get("level"));
        studentSkillRepo.save(ss);
    }

    // 🔥 AUTO MATCH LOGIC
    List<StudentSkill> studentSkills = studentSkillRepo.findByStudentId(student.getId());
    List<Mentor> mentors = mentorRepo.findAll();

    int bestScore = -1;
    Mentor bestMentor = null;

    for (Mentor mentor : mentors) {

        List<MentorSkill> mentorSkills = mentorSkillRepo.findByMentorId(mentor.getId());

        int score = 0;

        for (StudentSkill ss : studentSkills) {
            for (MentorSkill ms : mentorSkills) {
                if (ss.getSkill().equalsIgnoreCase(ms.getSkill())) {

                    switch (ss.getLevel().toLowerCase()) {
                        case "advanced" -> score += 30;
                        case "intermediate" -> score += 20;
                        default -> score += 10;
                    }
                }
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestMentor = mentor;
        }
    }

    // Assign mentor automatically
    if (bestMentor != null) {
        student.setMentor(bestMentor);
        student.setOnboardingStatus("MATCHED");
        studentRepository.save(student);
    }

    return ResponseEntity.ok(Map.of(
            "message", "Skills saved and mentor assigned",
            "mentor", bestMentor != null ? bestMentor.getName() : "No match"
    ));
}

    // =========================
    // DELETE STUDENT
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {

        if (!studentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        caseRepository.findAll()
                .stream()
                .filter(c -> c.getStudent() != null && c.getStudent().getId().equals(id))
                .forEach(caseRepository::delete);

        studentRepository.deleteById(id);

        return ResponseEntity.ok().build();
    }

    // =========================
    // DTO CLASSES
    // =========================
    public static class StudentResponse {
        public Long id;
        public String name;
        public String org;
        public String status;
        public Owner caseOwner;
    }

    public static class Owner {
        public String name;
    }
}