package com.studystack.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * Standard error envelope returned by every failure response so API
 * consumers get a consistent, machine-parseable shape instead of a
 * bare string.
 */
public class ApiError {

    private Instant timestamp;
    private int status;
    private String error;      // short machine-readable code, e.g. "USER_ALREADY_EXISTS"
    private String message;    // human-readable message
    private String path;
    private List<FieldValidationError> fieldErrors;

    public ApiError() {
        this.timestamp = Instant.now();
    }

    public ApiError(int status, String error, String message, String path) {
        this.timestamp = Instant.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    public static ApiError of(int status, String error, String message, String path) {
        return new ApiError(status, error, message, path);
    }

    public ApiError withFieldErrors(List<FieldValidationError> fieldErrors) {
        this.fieldErrors = fieldErrors;
        return this;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public List<FieldValidationError> getFieldErrors() {
        return fieldErrors;
    }

    public void setFieldErrors(List<FieldValidationError> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }

    public record FieldValidationError(String field, String message) {
    }

    public static Map<String, Object> toMap(ApiError e) {
        return Map.of(
                "timestamp", e.timestamp,
                "status", e.status,
                "error", e.error,
                "message", e.message == null ? "" : e.message,
                "path", e.path == null ? "" : e.path
        );
    }
}
