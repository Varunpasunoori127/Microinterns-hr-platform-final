package com.microinterns.hrplatform.config;

import com.microinterns.hrplatform.models.HRUser;
import com.microinterns.hrplatform.repositories.HRUserRepository;

import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final HRUserRepository hrUserRepository;

    public CustomUserDetailsService(HRUserRepository hrUserRepository) {
        this.hrUserRepository = hrUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        System.out.println("🔐 LOADING USER FROM DB: " + email); // ✅ DEBUG

        HRUser user = hrUserRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword()) // ✅ encoded password
                .roles(user.getRole()) // "HR_ADMIN"
                .build();
    }
}