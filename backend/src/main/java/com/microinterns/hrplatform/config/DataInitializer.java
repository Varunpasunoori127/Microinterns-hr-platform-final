package com.microinterns.hrplatform.config;

import com.microinterns.hrplatform.models.Mentor;
import com.microinterns.hrplatform.models.MentorSkill;
import com.microinterns.hrplatform.repositories.MentorRepository;
import com.microinterns.hrplatform.repositories.MentorSkillRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(MentorRepository mentorRepo, MentorSkillRepository skillRepo) {
        return args -> {

            // ✅ Prevent duplicate data
            if (mentorRepo.count() > 0) return;

            // =========================
            // CREATE MENTORS
            // =========================
            Mentor m1 = new Mentor();
            m1.setName("John Developer");
            mentorRepo.save(m1);

            Mentor m2 = new Mentor();
            m2.setName("Sarah Engineer");
            mentorRepo.save(m2);

            Mentor m3 = new Mentor();
            m3.setName("David Analyst");
            mentorRepo.save(m3);

            // =========================
            // ADD SKILLS
            // =========================

            MentorSkill s1 = new MentorSkill();
            s1.setMentorId(m1.getId());
            s1.setSkill("java");
            skillRepo.save(s1);

            MentorSkill s2 = new MentorSkill();
            s2.setMentorId(m1.getId());
            s2.setSkill("spring");
            skillRepo.save(s2);

            MentorSkill s3 = new MentorSkill();
            s3.setMentorId(m2.getId());
            s3.setSkill("react");
            skillRepo.save(s3);

            MentorSkill s4 = new MentorSkill();
            s4.setMentorId(m2.getId());
            s4.setSkill("javascript");
            skillRepo.save(s4);

            MentorSkill s5 = new MentorSkill();
            s5.setMentorId(m3.getId());
            s5.setSkill("python");
            skillRepo.save(s5);

            MentorSkill s6 = new MentorSkill();
            s6.setMentorId(m3.getId());
            s6.setSkill("data analysis");
            skillRepo.save(s6);
        };
    }
}