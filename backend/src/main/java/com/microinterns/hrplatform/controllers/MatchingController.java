package com.microinterns.hrplatform.controllers;

import com.microinterns.hrplatform.models.*;
import com.microinterns.hrplatform.repositories.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/match")
@CrossOrigin
public class MatchingController {

    private final StudentSkillRepository studentSkillRepo;
    private final MentorRepository mentorRepo;
    private final MentorSkillRepository mentorSkillRepo;
    private final StudentRepository studentRepo;
    private final CaseRepository caseRepo;
    private final HRUserRepository hrUserRepository;

    public MatchingController(
            StudentSkillRepository studentSkillRepo,
            MentorRepository mentorRepo,
            MentorSkillRepository mentorSkillRepo,
            StudentRepository studentRepo,
            CaseRepository caseRepo,
            HRUserRepository hrUserRepository
    ) {
        this.studentSkillRepo = studentSkillRepo;
        this.mentorRepo = mentorRepo;
        this.mentorSkillRepo = mentorSkillRepo;
        this.studentRepo = studentRepo;
        this.caseRepo = caseRepo;
        this.hrUserRepository = hrUserRepository;
    }

    // ---------------------------------------------------------
    // 🔥 MATCHING
    // ---------------------------------------------------------
    @GetMapping("/{studentId}")
    public List<Map<String, Object>> matchMentors(@PathVariable Long studentId) {

        List<StudentSkill> studentSkills = studentSkillRepo.findByStudentId(studentId);
        List<Mentor> mentors = mentorRepo.findAll();

        List<Map<String, Object>> results = new ArrayList<>();

        for (Mentor mentor : mentors) {

            List<MentorSkill> mentorSkills = mentorSkillRepo.findByMentorId(mentor.getId());

            int score = 0;

            for (StudentSkill ss : studentSkills) {
                for (MentorSkill ms : mentorSkills) {

                    String studentSkill = ss.getSkill() == null ? "" : ss.getSkill().trim().toLowerCase();
                    String mentorSkill = ms.getSkill() == null ? "" : ms.getSkill().trim().toLowerCase();

                    if (studentSkill.equals(mentorSkill)) {

                        switch (ss.getLevel().toLowerCase()) {
                            case "advanced" -> score += 30;
                            case "intermediate" -> score += 20;
                            default -> score += 10;
                        }
                    }
                }
            }

            int maxScore = studentSkills.size() * 30;
            int percentage = maxScore == 0 ? 0 : (score * 100) / maxScore;

            Map<String, Object> res = new HashMap<>();
            res.put("id", mentor.getId());
            res.put("name", mentor.getName());
            res.put("expertise", mentor.getExpertise());
            res.put("score", percentage);

            results.add(res);
        }

        // 🔥 sort highest score first
        results.sort((a, b) -> (int) b.get("score") - (int) a.get("score"));

        return results;
    }

    // ---------------------------------------------------------
    // 🔥 ASSIGN MENTOR
    // ---------------------------------------------------------
    @PostMapping("/assign")
    public Map<String, String> assignMentor(@RequestBody Map<String, Object> body) {

        Long studentId = Long.valueOf(body.get("studentId").toString());
        Long mentorId = Long.valueOf(body.get("mentorId").toString());

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Mentor mentor = mentorRepo.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        // ✅ assign mentor to student
        student.setMentor(mentor);
        student.setOnboardingStatus("MATCHED");
        studentRepo.save(student);

        // ✅ get case properly (optimized)
        Case studentCase = caseRepo.findByStudentId(studentId).orElse(null);

        if (studentCase != null) {

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            HRUser hr = hrUserRepository.findByEmail(email).orElse(null);

            if (hr != null) {
                studentCase.setOwner(hr);
            }

            studentCase.setStatus(Case.CaseStatus.ACTIVE);
            caseRepo.save(studentCase);
        }

        return Map.of("message", "Mentor assigned successfully");
    }
}