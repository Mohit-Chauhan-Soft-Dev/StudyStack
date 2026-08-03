package com.studystack.exception;

public class OtpResendTooSoonException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public OtpResendTooSoonException(String message) {
        super(message);
    }
}
