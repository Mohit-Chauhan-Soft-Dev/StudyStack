package com.studystack.service.serviceimpl;

import com.studystack.exception.InvalidOtpException;
import com.studystack.exception.OtpResendTooSoonException;
import com.studystack.model.EmailVerificationToken;
import com.studystack.model.User;
import com.studystack.repository.EmailVerificationTokenRepository;
import com.studystack.repository.UserRepository;
import com.studystack.service.EmailVerificationService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@Transactional
public class EmailVerificationServiceImpl implements EmailVerificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailVerificationServiceImpl.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    @Value("${otp.resend-cooldown-seconds:60}")
    private int resendCooldownSeconds;

    @Value("${otp.max-attempts:5}")
    private int maxAttempts;

    @Value("${mail.from:no-reply@studystack.com}")
    private String mailFrom;

    public EmailVerificationServiceImpl(EmailVerificationTokenRepository tokenRepository,
                                         UserRepository userRepository,
                                         PasswordEncoder passwordEncoder,
                                         JavaMailSender mailSender) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    @Override
    public void sendVerificationOtp(String email) {
        issueAndSendOtp(email, false);
    }

    @Override
    public void resendVerificationOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidOtpException("No account found for this email."));

        if (user.isEmailVerified()) {
            // Nothing to do — avoid leaking whether resend was "needed" to a caller,
            // just report success either way to prevent user enumeration.
            return;
        }

        issueAndSendOtp(email, true);
    }

    @Override
    public void verifyOtp(String email, String otp) {
        EmailVerificationToken token = tokenRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidOtpException("No pending verification for this email. Please request a new code."));

        if (token.isExpired()) {
            tokenRepository.delete(token);
            throw new InvalidOtpException("This code has expired. Please request a new one.");
        }

        if (token.getAttemptCount() >= maxAttempts) {
            tokenRepository.delete(token);
            throw new InvalidOtpException("Too many incorrect attempts. Please request a new code.");
        }

        if (!passwordEncoder.matches(otp, token.getOtpHash())) {
            token.setAttemptCount(token.getAttemptCount() + 1);
            tokenRepository.save(token);
            throw new InvalidOtpException("Incorrect code. Please try again.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidOtpException("No account found for this email."));

        user.setEmailVerified(true);
        userRepository.save(user);
        tokenRepository.delete(token);

        logger.info("Email verified successfully for {}", email);
    }

    private void issueAndSendOtp(String email, boolean enforceCooldown) {
        Optional<EmailVerificationToken> existing = tokenRepository.findByEmail(email);

        if (enforceCooldown && existing.isPresent()) {
            LocalDateTime cooldownEnds = existing.get().getLastSentAt().plusSeconds(resendCooldownSeconds);
            if (LocalDateTime.now().isBefore(cooldownEnds)) {
                long secondsLeft = ChronoUnit.SECONDS.between(LocalDateTime.now(), cooldownEnds);
                throw new OtpResendTooSoonException(
                        "Please wait " + secondsLeft + " seconds before requesting another code.");
            }
        }

        String otp = generateOtp();
        LocalDateTime now = LocalDateTime.now();

        EmailVerificationToken token = existing.orElseGet(() ->
            EmailVerificationToken.builder().email(email).build());

        token.setOtpHash(passwordEncoder.encode(otp));
        token.setExpiresAt(now.plusMinutes(otpExpiryMinutes));
        token.setLastSentAt(now);
        token.setAttemptCount(0);

        // Link token to user entity when available (optional)
        token.setUser(userRepository.findByEmail(email).orElse(null));

        tokenRepository.save(token);

        sendOtpEmail(email, otp);
    }

    private void sendOtpEmail(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(email);
        message.setSubject("Verify your StudyStack email address");
        message.setText(
                "Your StudyStack verification code is: " + otp + "\n\n" +
                "This code expires in " + otpExpiryMinutes + " minutes. " +
                "If you didn't request this, you can safely ignore this email.");

        try {
            mailSender.send(message);
        } catch (MailException e) {
            // Don't fail the calling operation (signup/resend) just because the
            // mail transport is unavailable — the user can still hit /resend-otp.
            // In production this should also push to a retry queue / alerting.
            logger.error("Failed to send verification email to {}: {}", email, e.getMessage());
        }
    }

    private String generateOtp() {
        int code = RANDOM.nextInt(1_000_000); // 0 - 999999
        return String.format("%06d", code);
    }
}
