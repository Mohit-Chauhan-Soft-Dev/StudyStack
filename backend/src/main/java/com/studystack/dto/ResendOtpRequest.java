package com.studystack.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ResendOtpRequest {

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;

    public ResendOtpRequest() {
    }

    public ResendOtpRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
