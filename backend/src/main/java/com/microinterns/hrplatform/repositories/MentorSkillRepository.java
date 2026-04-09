package com.microinterns.hrplatform.repositories;

import com.microinterns.hrplatform.models.MentorSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MentorSkillRepository extends JpaRepository<MentorSkill, Long> {

    List<MentorSkill> findByMentorId(Long mentorId);
}