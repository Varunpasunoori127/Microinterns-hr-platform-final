package com.microinterns.hrplatform.repositories;

import com.microinterns.hrplatform.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    // 🔹 Find student by email (Google login / HR login)
    Optional<Student> findByEmail(String email);

    // 🔹 Find student by onboarding token (onboarding flow)
    Optional<Student> findByOnboardingToken(String onboardingToken);

    // 🔥 NEW — Find student by name (used as fallback for old records without email)
    Optional<Student> findByName(String name);
}