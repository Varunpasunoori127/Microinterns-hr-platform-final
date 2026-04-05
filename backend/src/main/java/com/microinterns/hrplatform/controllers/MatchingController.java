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
    // 1️⃣ MATCHING ENDPOINT
    // ---------------------------------------------------------
    @GetMapping("/{studentId}")
    public List<Map<String, Object>> matchMentors(@PathVariable Long studentId) {

        List<StudentSkill> studentSkills = studentSkillRepo.findByStudentId(studentId);
        List<Mentor> mentors = mentorRepo.findAll();

        List<Map<String, Object>> results = new ArrayList<>();

        for (Mentor mentor : mentors) {

            List<MentorSkill> mentorSkills = mentorSkillRepo.findByMentorId(mentor.getId());

            int score = 0;
            List<String> matchedSkills = new ArrayList<>();
            List<String> missingSkills = new ArrayList<>();

            for (StudentSkill ss : studentSkills) {

                boolean matched = false;

                for (MentorSkill ms : mentorSkills) {

                    if (ss.getSkill().equalsIgnoreCase(ms.getSkill())) {

                        matched = true;
                        matchedSkills.add(ss.getSkill());

                        // Weighted scoring
                        switch (ss.getLevel().toLowerCase()) {
                            case "advanced" -> score += 30;
                            case "intermediate" -> score += 20;
                            default -> score += 10;
                        }

                        break;
                    }
                }

                if (!matched) {
                    missingSkills.add(ss.getSkill());
                }
            }

            int maxScore = studentSkills.size() * 30;
            int percentage = maxScore == 0 ? 0 : (score * 100) / maxScore;

            Map<String, Object> res = new HashMap<>();
            res.put("mentorId", mentor.getId());
            res.put("mentor", mentor.getName());
            res.put("expertise", mentor.getExpertise());
            res.put("score", percentage);
            res.put("matchedSkills", matchedSkills);
            res.put("missingSkills", missingSkills);

            results.add(res);
        }

        return results.stream()
                .sorted((a, b) -> (int) b.get("score") - (int) a.get("score"))
                .toList();
    }

    // ---------------------------------------------------------
    // 2️⃣ ASSIGN MENTOR (HR becomes case owner)
    // ---------------------------------------------------------
    @PostMapping("/assign")
    public Map<String, String> assignMentor(
            @RequestParam Long studentId,
            @RequestParam Long mentorId
    ) {

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Mentor mentor = mentorRepo.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        // Assign mentor to student
        student.setMentor(mentor);
        studentRepo.save(student);

        // Fetch case
        Case studentCase = caseRepo.findAll().stream()
                .filter(c -> c.getStudent() != null && c.getStudent().getId().equals(studentId))
                .findFirst()
                .orElse(null);

        if (studentCase != null) {

            // ⭐ NEW: Set logged-in HR as owner
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            HRUser hr = hrUserRepository.findByEmail(email)
                    .orElse(null);

            if (hr != null) {
                studentCase.setOwner(hr);
            }

            // Update status
            studentCase.setStatus(Case.CaseStatus.ACTIVE);
            caseRepo.save(studentCase);
        }

        return Map.of("message", "Mentor assigned successfully");
    }
}