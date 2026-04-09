package com.microinterns.hrplatform.repositories;

import com.microinterns.hrplatform.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    // Find student by email (used for login / Google auth)
    Optional<Student> findByEmail(String email);

    // Find student by onboarding token (used for onboarding flow)
    Optional<Student> findByOnboardingToken(String onboardingToken);

}