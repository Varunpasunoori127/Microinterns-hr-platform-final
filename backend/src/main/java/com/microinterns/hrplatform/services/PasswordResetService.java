package com.microinterns.hrplatform.services;

import com.microinterns.hrplatform.models.HRUser;
import com.microinterns.hrplatform.models.PasswordResetToken;
import com.microinterns.hrplatform.repositories.HRUserRepository;
import com.microinterns.hrplatform.repositories.PasswordResetTokenRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final HRUserRepository hrUserRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    public PasswordResetService(
            HRUserRepository hrUserRepository,
            PasswordResetTokenRepository tokenRepository,
            @Autowired(required = false) EmailService emailService
    ) {
        this.hrUserRepository = hrUserRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
    }

    // 🔑 STEP 1: SEND RESET LINK
    public void sendResetLink(String email) {

        HRUser user = hrUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiry(LocalDateTime.now().plusHours(1));

        tokenRepository.save(resetToken);

        // DEV / EMAIL MODE
        if (emailService != null) {
            emailService.sendPasswordResetEmail(email, token);
        } else {
            System.out.println("🔐 RESET LINK:");
            System.out.println("http://localhost:5173/reset-password/" + token);
        }
    }

    // 🔄 STEP 2: RESET PASSWORD
    public void resetPassword(String token, String encodedPassword) {

        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        // ⏰ Expiry check
        if (resetToken.getExpiry().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Token expired");
        }

        HRUser user = resetToken.getUser();

        // ✅ IMPORTANT: password already encoded in controller
        user.setPassword(encodedPassword);

        hrUserRepository.save(user);

        // 🧹 cleanup
        tokenRepository.delete(resetToken);
    }
}