package com.studystack.configuration;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.key}")
    private String SECRET_KEY;

    @Value("${jwt.expiration-ms:3600000}")
    private long expirationMs;

    @Value("${jwt.refresh-expiration-ms:604800000}")
    private long refreshExpirationMs;

    private SecretKey getSigningKey() {
        if (SECRET_KEY == null || SECRET_KEY.trim().isEmpty()) {
            throw new IllegalStateException("JWT signing key is not configured");
        }

        byte[] keyBytes;
        String normalized = SECRET_KEY.trim();
        try {
            keyBytes = Decoders.BASE64.decode(normalized);
        } catch (RuntimeException e) {
            try {
                keyBytes = Base64.getDecoder().decode(normalized);
            } catch (RuntimeException ignored) {
                keyBytes = normalized.getBytes(StandardCharsets.UTF_8);
            }
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username, String role) {
        return generateToken(username, role, expirationMs);
    }

    public String generateRefreshToken(String username, String role) {
        return generateToken(username, role, refreshExpirationMs);
    }

    private String generateToken(String username, String role, long ttlMs) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("type", ttlMs == refreshExpirationMs ? "refresh" : "access")
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + ttlMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        try {
            if (token == null || token.trim().isEmpty())
                return null;
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    public String extractRole(String token) {
        try {
            if (token == null || token.trim().isEmpty())
                return null;
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .get("role", String.class);
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    public boolean validateToken(String token, String username) {
        return username != null && username.equals(extractUsername(token)) && !isTokenExpired(token)
                && isTokenType(token, "access");
    }

    public boolean validateRefreshToken(String token, String username) {
        return username != null && username.equals(extractUsername(token)) && !isTokenExpired(token)
                && isTokenType(token, "refresh");
    }

    private boolean isTokenType(String token, String expectedType) {
        try {
            if (token == null || token.trim().isEmpty()) {
                return false;
            }
            String type = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .get("type", String.class);
            return expectedType.equals(type);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        try {
            if (token == null || token.trim().isEmpty())
                return true;
            Date expiration = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
            return expiration.before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return true;
        }
    }
}