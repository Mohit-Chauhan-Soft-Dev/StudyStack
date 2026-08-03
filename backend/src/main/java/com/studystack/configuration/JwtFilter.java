package com.studystack.configuration;

import com.studystack.service.serviceimpl.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private JwtUtil jwtUtil;
    private UserDetailsServiceImpl userDetailsService;
    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    public JwtFilter(JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7).trim();
            if (!jwt.isEmpty()) {

                try {
                    username = jwtUtil.extractUsername(jwt);
                } catch (Exception e) {
                    username = null;
                }

            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = null;
            try {
                userDetails = userDetailsService.loadUserByUsername(username);
            } catch (UsernameNotFoundException ex) {
                logger.warn("User not found for username from JWT: {}", username);
            } catch (Exception ex) {
                logger.warn("Failed to load user for JWT username {}: {}", username, ex.getMessage());
            }

            if (userDetails != null && jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                String role = jwtUtil.extractRole(jwt);
                logger.info("Extracted role from JWT: {}", role);

                if (role != null && !role.trim().isEmpty()) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role)));

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    logger.warn("JWT role claim missing or empty for user: {}", username);
                }
            }
        }

        chain.doFilter(request, response);
    }
}
