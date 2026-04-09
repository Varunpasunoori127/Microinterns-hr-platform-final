package com.microinterns.hrplatform.repositories;

import com.microinterns.hrplatform.models.StudentSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {

    List<StudentSkill> findByStudentId(Long studentId);
}