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
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://microinterns-hr-platform-final.vercel.app"
})
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final HRUserRepository repo;
    private final PasswordEncoder encoder;
    private final PasswordResetService resetService;
    private final UserDetailsService userDetailsService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          HRUserRepository repo,
                          PasswordEncoder encoder,
                          PasswordResetService resetService,
                          UserDetailsService userDetailsService) {

        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.repo = repo;
        this.encoder = encoder;
        this.resetService = resetService;
        this.userDetailsService = userDetailsService;
    }

    // =========================
    // 🔐 LOGIN (FIXED 415 ERROR)
    // =========================
    @PostMapping(value = "/login", consumes = "application/json")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String password = body.get("password");

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            String token = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "email", email
            ));

        } catch (Exception e) {
            return ResponseEntity.status(401).body(
                    Map.of("error", "Invalid credentials")
            );
        }
    }

    // =========================
    // 🧾 SIGNUP
    // =========================
    @PostMapping(value = "/signup", consumes = "application/json")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {

        String email = body.get("email");

        if (repo.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email exists"));
        }

        HRUser user = new HRUser();
        user.setName(body.get("name"));
        user.setEmail(email);
        user.setPassword(encoder.encode(body.get("password")));
        user.setRole("HR_ADMIN");

        repo.save(user);

        return ResponseEntity.ok(Map.of("message", "User created"));
    }

    // =========================
    // 🔑 FORGOT PASSWORD
    // =========================
    @PostMapping(value = "/forgot-password", consumes = "application/json")
    public ResponseEntity<?> forgot(@RequestBody Map<String, String> body) {

        resetService.sendResetLink(body.get("email"));

        return ResponseEntity.ok(Map.of("message", "Reset link sent"));
    }

    // =========================
    // 🔄 RESET PASSWORD
    // =========================
    @PostMapping(value = "/reset-password/{token}", consumes = "application/json")
    public ResponseEntity<?> reset(
            @PathVariable String token,
            @RequestBody Map<String, String> body) {

        String newPass = body.get("newPassword");

        resetService.resetPassword(token, encoder.encode(newPass));

        return ResponseEntity.ok(Map.of("message", "Password updated"));
    }
}