package com.microinterns.hrplatform.models;

import jakarta.persistence.*;

@Entity
@Table(name = "mentor_skills")
public class MentorSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long mentorId;
    private String skill;

    // ✅ GETTERS
    public Long getId() {
        return id;
    }

    public Long getMentorId() {
        return mentorId;
    }

    public String getSkill() {
        return skill;
    }

    // ✅ SETTERS
    public void setId(Long id) {
        this.id = id;
    }

    public void setMentorId(Long mentorId) {
        this.mentorId = mentorId;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }
}