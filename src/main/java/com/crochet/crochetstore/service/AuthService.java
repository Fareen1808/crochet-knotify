package com.crochet.crochetstore.service;

import com.crochet.crochetstore.dto.RegisterRequest;
import com.crochet.crochetstore.dto.TokenResponse;
import com.crochet.crochetstore.model.User;
import com.crochet.crochetstore.repository.UserRepository;
import com.crochet.crochetstore.security.JwtUtil;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.access-expiration}")
    private long accessExpiration;

    public AuthService(UserRepository userRepository,
                       JwtUtil jwtUtil,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // REGISTER
    // =========================
    public String register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();

        user.setUsername(request.getUsername());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // Always assign USER role on the server
        user.setRole("USER");

        userRepository.save(user);

        return "User registered successfully";
    }

    // =========================
    // LOGIN
    // =========================
    public String login(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateAccessToken(
                user.getUsername(),
                user.getRole()
        );
    }

    public TokenResponse loginWithRefreshToken(String username, String password) {

        User user = authenticate(username, password);

        return createTokenResponse(user);
    }

    // =========================
    // REFRESH TOKEN
    // =========================
    public TokenResponse refresh(String refreshToken) {

        if (!jwtUtil.validateRefreshToken(refreshToken)) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }

        User user = userRepository.findByUsername(
                jwtUtil.extractUsername(refreshToken)
        ).orElseThrow(() ->
                new BadCredentialsException("User not found")
        );

        return createTokenResponse(user);
    }

    // =========================
    // AUTHENTICATE
    // =========================
    private User authenticate(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    // =========================
    // TOKEN RESPONSE
    // =========================
    private TokenResponse createTokenResponse(User user) {

        return new TokenResponse(
                jwtUtil.generateAccessToken(
                        user.getUsername(),
                        user.getRole()
                ),
                jwtUtil.generateRefreshToken(
                        user.getUsername(),
                        user.getRole()
                ),
                "Bearer",
                accessExpiration / 1000
        );
    }
}