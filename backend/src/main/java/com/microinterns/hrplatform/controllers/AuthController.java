package com.microinterns.hrplatform.controllers;

import com.microinterns.hrplatform.config.JwtUtil;
import com.microinterns.hrplatform.models.HRUser;
import com.microinterns.hrplatform.repositories.HRUserRepository;
import com.microinterns.hrplatform.services.PasswordResetService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final HRUserRepository repo;
    private final PasswordEncoder encoder;
    private final PasswordResetService resetService;
    private final UserDetailsService userDetailsService; // ✅ ADDED

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          HRUserRepository repo,
                          PasswordEncoder encoder,
                          PasswordResetService resetService,
                          UserDetailsService userDetailsService) { // ✅ ADDED
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.repo = repo;
        this.encoder = encoder;
        this.resetService = resetService;
        this.userDetailsService = userDetailsService; // ✅ ADDED
    }

    // 🔐 LOGIN
    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Map<String,String> body) {

    String email = body.get("email");
    String password = body.get("password");

    // 🔥 DEBUG START
    System.out.println("👉 LOGIN ATTEMPT");
    System.out.println("EMAIL: " + email);
    System.out.println("RAW PASSWORD: [" + password + "]");
    // 🔥 DEBUG END

    try {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
        );

        // ✅ load user
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // ✅ generate token
        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(Map.of(
            "token", token,
            "email", email
        ));

    } catch (Exception e) {

        // 🔥 DEBUG ERROR
        System.out.println("❌ LOGIN FAILED: " + e.getMessage());

        return ResponseEntity.status(401).body(
            Map.of("error", "Invalid credentials")
        );
    }
}

    // 🧾 SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String,String> body) {

        String email = body.get("email");

        if (repo.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error","Email exists"));
        }

        HRUser user = new HRUser();
        user.setName(body.get("name"));
        user.setEmail(email);

        // 🔥 IMPORTANT
        user.setPassword(encoder.encode(body.get("password")));

        user.setRole("HR_ADMIN");

        repo.save(user);

        return ResponseEntity.ok(Map.of("message","User created"));
    }

    // 🔑 FORGOT
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgot(@RequestBody Map<String,String> body) {
        resetService.sendResetLink(body.get("email"));
        return ResponseEntity.ok(Map.of("message","Reset link sent"));
    }

    // 🔄 RESET
    @PostMapping("/reset-password/{token}")
    public ResponseEntity<?> reset(
            @PathVariable String token,
            @RequestBody Map<String,String> body) {

        String newPass = body.get("newPassword");

        resetService.resetPassword(token, encoder.encode(newPass));

        return ResponseEntity.ok(Map.of("message","Password updated"));
    }
}