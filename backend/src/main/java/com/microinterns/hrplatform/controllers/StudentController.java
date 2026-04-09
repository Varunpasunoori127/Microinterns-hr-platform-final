package com.microinterns.hrplatform.controllers;

import com.microinterns.hrplatform.models.Student;
import com.microinterns.hrplatform.models.Case;
import com.microinterns.hrplatform.models.StudentSkill;
import com.microinterns.hrplatform.models.Mentor;
import com.microinterns.hrplatform.models.MentorSkill;

import com.microinterns.hrplatform.repositories.*;
import com.microinterns.hrplatform.services.EmailService;
import com.microinterns.hrplatform.services.CaseService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

@RestController
@RequestMapping("/students")
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    @Autowired private StudentRepository studentRepository;
    @Autowired private CaseRepository caseRepository;
    @Autowired private HRUserRepository hrUserRepository;
    @Autowired private StudentSkillRepository studentSkillRepo;
    @Autowired private MentorRepository mentorRepo;
    @Autowired private MentorSkillRepository mentorSkillRepo;

    @Autowired(required = false)
    private EmailService emailService;

    @Autowired
    private CaseService caseService;

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
            resp.university = s.getUniversity(); // ✅ ADD
            resp.course = s.getCourse();    
            resp.status = s.getOnboardingStatus();

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
        if (maybe.isEmpty()) return ResponseEntity.notFound().build();

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
    // ADD STUDENT
    // =========================
    @PostMapping
    public ResponseEntity<?> addStudent(@Valid @RequestBody Student student) {

        student.generateOnboardingToken();
        student.setOnboardingCompleted(false);
        student.setOnboardingStatus("PENDING_ONBOARDING");

        Student saved = studentRepository.save(student);

        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "onboardingToken", saved.getOnboardingToken()
        ));
    }

    // =========================
    // APPROVE STUDENT
    // =========================
    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveStudent(@PathVariable Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setOnboardingStatus("ACTIVE");
        studentRepository.save(student);

        return ResponseEntity.ok(Map.of("message", "Approved"));
    }

    // =========================
    // SAVE SKILLS + MATCH
    // =========================
    @PostMapping("/skills/{token}")
    public ResponseEntity<?> saveSkills(
        @PathVariable String token,
        @RequestBody Map<String, List<String>> body
    ) {

    Student student = studentRepository.findByOnboardingToken(token)
            .orElseThrow(() -> new RuntimeException("Student not found"));

    List<String> skills = body.get("skills");

    studentSkillRepo.deleteAll(
            studentSkillRepo.findByStudentId(student.getId())
    );

    for (String skill : skills) {
        StudentSkill ss = new StudentSkill();
        ss.setStudentId(student.getId());
        ss.setSkill(skill);
        ss.setLevel("Intermediate");
        studentSkillRepo.save(ss);
    }

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
                    score += 20;
                }
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestMentor = mentor;
        }
    }

    if (bestMentor != null) {
        student.setMentor(bestMentor);
        student.setOnboardingStatus("MATCHED");
        studentRepository.save(student);
    }

    return ResponseEntity.ok(Map.of(
            "message", "Skills saved",
            "mentor", bestMentor != null ? bestMentor.getName() : "No match"
    ));
}
    // =========================
    // DELETE STUDENT
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setMentor(null);
        studentRepository.save(student);

        studentSkillRepo.deleteAll(
                studentSkillRepo.findByStudentId(id)
        );

        caseRepository.deleteAll(
                caseRepository.findAll()
                        .stream()
                        .filter(c -> c.getStudent() != null && c.getStudent().getId().equals(id))
                        .toList()
        );

        studentRepository.deleteById(id);

        return ResponseEntity.ok(Map.of("message", "Student deleted"));
    }

    // =========================
    // DTO
    // =========================
    public static class StudentResponse {
        public Long id;
        public String name;
        public String university; // ✅ NEW
        public String course;     // ✅ NEW
        public String status;
        public Owner caseOwner;
    }

    public static class Owner {
        public String name;
    }
}