package com.microinterns.hrplatform.repositories;

import com.microinterns.hrplatform.models.HRUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HRUserRepository extends JpaRepository<HRUser, Long> {
    Optional<HRUser> findByEmail(String email);
    boolean existsByEmail(String email);
}