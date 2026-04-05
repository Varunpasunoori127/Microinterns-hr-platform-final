package com.microinterns.hrplatform.repositories;
import com.microinterns.hrplatform.models.Case;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseRepository extends JpaRepository<Case, Long> {}