package com.microinterns.hrplatform.controllers;

import com.microinterns.hrplatform.models.Mentor;
import com.microinterns.hrplatform.repositories.MentorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mentors")
@CrossOrigin
public class MentorController {

    private final MentorRepository mentorRepository;

    public MentorController(MentorRepository mentorRepository) {
        this.mentorRepository = mentorRepository;
    }

    @GetMapping
    public List<Mentor> getAllMentors() {
        return mentorRepository.findAll();
    }
}