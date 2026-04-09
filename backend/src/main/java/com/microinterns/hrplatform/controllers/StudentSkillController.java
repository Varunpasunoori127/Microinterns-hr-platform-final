package com.microinterns.hrplatform.controllers;

import com.microinterns.hrplatform.models.StudentSkill;
import com.microinterns.hrplatform.repositories.StudentSkillRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student-skills")
@CrossOrigin // optional (safe for dev)
public class StudentSkillController {

    @Autowired
    private StudentSkillRepository studentSkillRepository;

    // ✅ ADD SKILL
    @PostMapping
    public StudentSkill addSkill(@RequestBody StudentSkill skill) {
        return studentSkillRepository.save(skill);
    }

    // ✅ GET SKILLS BY STUDENT ID
    @GetMapping("/student/{studentId}")
    public List<StudentSkill> getSkills(@PathVariable Long studentId) {
        return studentSkillRepository.findByStudentId(studentId);
    }
}