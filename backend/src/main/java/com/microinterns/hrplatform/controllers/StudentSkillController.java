package com.microinterns.hrplatform.controllers;

import com.microinterns.hrplatform.models.StudentSkill;
import com.microinterns.hrplatform.repositories.StudentSkillRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills")
@CrossOrigin
public class StudentSkillController {

    private final StudentSkillRepository repository;

    public StudentSkillController(StudentSkillRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/{studentId}")
    public List<StudentSkill> getSkills(@PathVariable Long studentId) {
        return repository.findByStudentId(studentId);
    }

    @PostMapping
    public StudentSkill addSkill(@RequestBody StudentSkill skill) {
        return repository.save(skill);
    }
}