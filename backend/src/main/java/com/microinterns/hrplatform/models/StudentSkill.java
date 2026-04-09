package com.microinterns.hrplatform.models;

import jakarta.persistence.*;

@Entity
@Table(name = "student_skills")
public class StudentSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔥 IMPORTANT: match Supabase column exactly
    @Column(name = "student_id")
    private Long studentId;

    private String skill;
    private String level;

    // GETTERS
    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getSkill() {
        return skill;
    }

    public String getLevel() {
        return level;
    }

    // SETTERS
    public void setId(Long id) {
        this.id = id;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}