package com.studystack.service.serviceimpl;

import com.studystack.model.Role;
import com.studystack.model.User;
import com.studystack.repository.UserRepository;
import com.studystack.service.AuthService;
import com.studystack.service.EmailVerificationService;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.studystack.dto.LoginRequest;
import com.studystack.dto.SignupRequest;
import com.studystack.exception.EmailNotVerifiedException;
import com.studystack.exception.UserAlreadyExistsException;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final EmailVerificationService emailVerificationService;

    public AuthServiceImpl(PasswordEncoder passwordEncoder,
            UserRepository userRepository,
            EmailVerificationService emailVerificationService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.emailVerificationService = emailVerificationService;
    }

    @Override
    public void signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(
                    "User already exists with this email.");
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.BUYER);
        user.setEmailVerified(false);

        userRepository.save(user);

        emailVerificationService.sendVerificationOtp(user.getEmail());
    }

    @Override
    public User login(LoginRequest loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(loginRequest.getPassword(),
                user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException(
                    "Please verify your email address before logging in.");
        }

        return user;
    }

    @Override
    public User findByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElse(null);

    }
}