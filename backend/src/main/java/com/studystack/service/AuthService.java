package com.studystack.service;

import com.studystack.dto.LoginRequest;
import com.studystack.dto.SignupRequest;
import com.studystack.model.User;

public interface AuthService {

    void signup(SignupRequest request);

    User login(LoginRequest loginRequest);

    User findByEmail(String email);
}