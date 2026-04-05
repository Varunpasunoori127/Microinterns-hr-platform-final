package com.microinterns.hrplatform.config;

import com.microinterns.hrplatform.models.Case;
import com.microinterns.hrplatform.models.HRUser;
import com.microinterns.hrplatform.models.Student;
import com.microinterns.hrplatform.repositories.CaseRepository;
import com.microinterns.hrplatform.repositories.HRUserRepository;
import com.microinterns.hrplatform.repositories.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DataInitializer implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final CaseRepository caseRepository;
    private final HRUserRepository hrUserRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            StudentRepository studentRepository,
            CaseRepository caseRepository,
            HRUserRepository hrUserRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.studentRepository = studentRepository;
        this.caseRepository = caseRepository;
        this.hrUserRepository = hrUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        // -----------------------------
        // Seed login users if missing
        // -----------------------------
        HRUser hr = hrUserRepository.findByEmail("hr1@example.com").orElseGet(() -> {
            HRUser user = new HRUser();
            user.setName("HR1");
            user.setEmail("hr1@example.com");
            user.setRole("HR_ADMIN");
            user.setPassword(passwordEncoder.encode("hrpassword")); // 10 chars
            return hrUserRepository.save(user);
        });

        hrUserRepository.findByEmail("admin@example.com").orElseGet(() -> {
            HRUser user = new HRUser();
            user.setName("SuperAdmin");
            user.setEmail("admin@example.com");
            user.setRole("SUPER_ADMIN");
            user.setPassword(passwordEncoder.encode("adminpass123")); // 12 chars
            return hrUserRepository.save(user);
        });

        hrUserRepository.findByEmail("varun@example.com").orElseGet(() -> {
            HRUser user = new HRUser();
            user.setName("Varun");
            user.setEmail("varun@example.com");
            user.setRole("SUPER_ADMIN");
            user.setPassword(passwordEncoder.encode("varunpass123")); // 12 chars
            return hrUserRepository.save(user);
        });

        // -----------------------------
        // Seed sample students if missing
        // -----------------------------
        Student alice = studentRepository.findByEmail("alice@example.com").orElseGet(() -> {
            Student s = new Student();
            s.setName("Alice");
            s.setEmail("alice@example.com");
            s.setOrg("Acme");
            s.setPhone("+1-555-0100");
            s.setAddress("123 Acme St, Suite 100");
            s.setDob("1998-07-12");
            s.setAgreementAccepted(true);
            s.setOnboardingStatus("IN_PROGRESS");
            return studentRepository.save(s);
        });

        studentRepository.findByEmail("bob@example.com").orElseGet(() -> {
            Student s = new Student();
            s.setName("Bob");
            s.setEmail("bob@example.com");
            s.setOrg("Acme");
            s.setOnboardingStatus("PENDING");
            return studentRepository.save(s);
        });

        // -----------------------------
        // Seed case for Alice if missing
        // -----------------------------
        if (caseRepository.findAll().stream().noneMatch(c ->
                c.getStudent() != null &&
                c.getStudent().getId() != null &&
                c.getStudent().getId().equals(alice.getId())
        )) {
            Case c = new Case();
            c.setStudent(alice);
            c.setOwner(hr);
            c.setStatus(Case.CaseStatus.ACTIVE);
            caseRepository.save(c);
        }
    }
}