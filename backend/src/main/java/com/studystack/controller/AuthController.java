
package com.studystack.controller;

import com.studystack.configuration.JwtUtil;
import com.studystack.dto.AuthResponse;
import com.studystack.dto.LoginRequest;
import com.studystack.dto.ResendOtpRequest;
import com.studystack.dto.SignupRequest;
import com.studystack.dto.VerifyEmailRequest;
import com.studystack.model.User;
import com.studystack.service.AuthService;
import com.studystack.service.EmailVerificationService;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final EmailVerificationService emailVerificationService;

    public AuthController(AuthService authService,
            JwtUtil jwtUtil,
            EmailVerificationService emailVerificationService) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
        this.emailVerificationService = emailVerificationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupRequest request) {

        authService.signup(request);

        logger.info("User has been signed up !!");

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Account created. Please check your email for a verification code.");
    }

    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {

        emailVerificationService.verifyOtp(request.getEmail(), request.getOtp());

        logger.info("Email verified for {}", request.getEmail());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Email verified successfully. You can now log in.");
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@Valid @RequestBody ResendOtpRequest request) {

        emailVerificationService.resendVerificationOtp(request.getEmail());

        logger.info("Verification code resent for {}", request.getEmail());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("If an unverified account exists for this email, a new code has been sent.");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {

        User user = authService.login(request);

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().toString());
        String refreshToken = jwtUtil.generateRefreshToken(
                user.getEmail(),
                user.getRole().toString());

        AuthResponse reponse = new AuthResponse(token, refreshToken, "Tokens generated successfully!!");

        logger.info("User has been signed in successfully !!");

        return ResponseEntity.ok(reponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestHeader("Authorization") String authorizationHeader) {
        String refreshToken = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            refreshToken = authorizationHeader.substring(7).trim();
        }

        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        String username = jwtUtil.extractUsername(refreshToken);
        if (username == null || !jwtUtil.validateRefreshToken(refreshToken, username)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String newAccessToken = jwtUtil.generateToken(username, "BUYER");
        AuthResponse response = new AuthResponse(newAccessToken, refreshToken, "Access token refreshed successfully!!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<String> testAPI() {

        logger.info("Test API is called from auth controller !!");

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Test API is called from auth controller CI/CD !!");

    }

}
