package com.microinterns.hrplatform.services;

import com.microinterns.hrplatform.models.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@ConditionalOnProperty(name = "email.enabled", havingValue = "true")
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.email.from:dev@microinterns.com}")
    private String fromEmail;

    @Value("${app.email.onboarding.subject:Welcome to MicroInterns}")
    private String onboardingSubject;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOnboardingEmail(Student student) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(student.getEmail());
            message.setSubject(onboardingSubject);

            String onboardingLink = frontendUrl + "/onboarding/" + student.getOnboardingToken();

            String emailBody = String.format(
                "Dear %s,\n\n" +
                "Welcome to MicroInterns!\n\n" +
                "Complete onboarding here:\n\n%s\n\n" +
                "Best regards,\nMicroInterns HR Team",
                student.getName(),
                onboardingLink
            );

            message.setText(emailBody);
            mailSender.send(message);

            logger.info("Onboarding email sent to: {}", student.getEmail());

        } catch (Exception e) {
            logger.error("Failed to send onboarding email", e);
        }
    }

    public void sendCaseAssignmentEmail(String hrEmail, Student student) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(hrEmail);
            message.setSubject("New Student Case Assigned");

            String emailBody = String.format(
                "Student: %s\nEmail: %s\nOrg: %s",
                student.getName(),
                student.getEmail(),
                student.getOrg()
            );

            message.setText(emailBody);
            mailSender.send(message);

            logger.info("Case assignment email sent to: {}", hrEmail);

        } catch (Exception e) {
            logger.error("Failed to send case assignment email", e);
        }
    }

    public void sendPasswordResetEmail(String email, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Reset Your Password");

            String resetLink = frontendUrl + "/reset-password?token=" + token;

            String body = String.format(
                "Reset your password:\n\n%s",
                resetLink
            );

            message.setText(body);
            mailSender.send(message);

            logger.info("Password reset email sent to: {}", email);

        } catch (Exception e) {
            logger.error("Failed to send password reset email", e);
        }
    }
}