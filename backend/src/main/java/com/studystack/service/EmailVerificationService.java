package com.studystack.service;

public interface EmailVerificationService {

    /**
     * Generates a new OTP for the given email, stores its hash, and sends
     * it via email. Used right after signup.
     */
    void sendVerificationOtp(String email);

    /**
     * Re-issues an OTP, enforcing a resend cooldown to prevent abuse.
     */
    void resendVerificationOtp(String email);

    /**
     * Validates the supplied OTP against the stored hash for the email.
     * On success, marks the user's email as verified and deletes the token.
     * Tracks failed attempts and locks out after too many wrong tries.
     */
    void verifyOtp(String email, String otp);
}
