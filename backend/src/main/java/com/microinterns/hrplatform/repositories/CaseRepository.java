package com.microinterns.hrplatform.repositories;
import com.microinterns.hrplatform.models.Case;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CaseRepository extends JpaRepository<Case, Long> {
    Optional<Case> findByStudentId(Long studentId);
}