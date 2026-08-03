package com.studystack.configuration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "SECRET_KEY", "test-secret-key-1234567890-1234567890");
        ReflectionTestUtils.setField(jwtUtil, "expirationMs", 3600000L);
        ReflectionTestUtils.setField(jwtUtil, "refreshExpirationMs", 604800000L);
    }

    @Test
    void shouldGenerateAndValidateRefreshToken() {
        String refreshToken = jwtUtil.generateRefreshToken("user@example.com", "BUYER");

        assertNotNull(refreshToken);
        assertTrue(jwtUtil.validateRefreshToken(refreshToken, "user@example.com"));
        assertFalse(jwtUtil.validateToken(refreshToken, "user@example.com"));
    }
}
