package com.microinterns.hrplatform.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(optional = false)
    private HRUser user;

    @Column(nullable = false)
    private LocalDateTime expiry;

    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public HRUser getUser() {
        return user;
    }

    public void setUser(HRUser user) {
        this.user = user;
    }

    public LocalDateTime getExpiry() {
        return expiry;
    }

    public void setExpiry(LocalDateTime expiry) {
        this.expiry = expiry;
    }

    public boolean isExpired() {
        return expiry.isBefore(LocalDateTime.now());
    }
}