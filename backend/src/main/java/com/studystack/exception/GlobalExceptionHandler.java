package com.studystack.exception;

import com.studystack.dto.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleUserAlreadyExists(
            UserAlreadyExistsException ex, HttpServletRequest request) {

        return build(HttpStatus.CONFLICT, "USER_ALREADY_EXISTS", ex.getMessage(), request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(
            BadCredentialsException ex, HttpServletRequest request) {

        return build(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", ex.getMessage(), request);
    }

    @ExceptionHandler(EmailNotVerifiedException.class)
    public ResponseEntity<ApiError> handleEmailNotVerified(
            EmailNotVerifiedException ex, HttpServletRequest request) {

        return build(HttpStatus.FORBIDDEN, "EMAIL_NOT_VERIFIED", ex.getMessage(), request);
    }

    @ExceptionHandler(InvalidOtpException.class)
    public ResponseEntity<ApiError> handleInvalidOtp(
            InvalidOtpException ex, HttpServletRequest request) {

        return build(HttpStatus.BAD_REQUEST, "INVALID_OTP", ex.getMessage(), request);
    }

    @ExceptionHandler(OtpResendTooSoonException.class)
    public ResponseEntity<ApiError> handleOtpResendTooSoon(
            OtpResendTooSoonException ex, HttpServletRequest request) {

        return build(HttpStatus.TOO_MANY_REQUESTS, "OTP_RESEND_TOO_SOON", ex.getMessage(), request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(
            AccessDeniedException ex, HttpServletRequest request) {

        return build(HttpStatus.FORBIDDEN, "ACCESS_DENIED", "You do not have permission to perform this action.", request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        List<ApiError.FieldValidationError> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> new ApiError.FieldValidationError(fe.getField(), fe.getDefaultMessage()))
                .toList();

        ApiError error = ApiError.of(
                HttpStatus.BAD_REQUEST.value(),
                "VALIDATION_FAILED",
                "One or more fields are invalid.",
                request.getRequestURI()
        ).withFieldErrors(fieldErrors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleException(
            Exception ex, HttpServletRequest request) {

        // Log full detail server-side; never leak internals to the client.
        logger.error("Unhandled exception on {} {}", request.getMethod(), request.getRequestURI(), ex);

        return build(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "Something went wrong.", request);
    }

    private ResponseEntity<ApiError> build(HttpStatus status, String code, String message, HttpServletRequest request) {
        ApiError error = ApiError.of(status.value(), code, message, request.getRequestURI());
        return ResponseEntity.status(status).body(error);
    }
}
