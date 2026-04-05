package com.microinterns.hrplatform.repositories;

import com.microinterns.hrplatform.models.Mentor;
import org.springframework.data.jpa.repository.JpaRepository;
public interface MentorRepository extends JpaRepository<Mentor, Long> {}