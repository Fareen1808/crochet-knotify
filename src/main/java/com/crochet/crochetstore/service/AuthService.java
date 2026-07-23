package com.crochet.crochetstore.service;

import com.crochet.crochetstore.model.User;
import com.crochet.crochetstore.repository.UserRepository;
import com.crochet.crochetstore.security.JwtUtil;
import com.crochet.crochetstore.dto.TokenResponse;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;

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

    // REGISTER
    public String register(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRole() == null) {
            user.setRole("USER");
        }

        userRepository.save(user);

        return "User registered successfully";
    }

    // LOGIN
    public String login(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateAccessToken(user.getUsername(), user.getRole());
    }

    public TokenResponse loginWithRefreshToken(String username, String password) {
        User user = authenticate(username, password);
        return createTokenResponse(user);
    }

    public TokenResponse refresh(String refreshToken) {
        if (!jwtUtil.validateRefreshToken(refreshToken)) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }

        User user = userRepository.findByUsername(jwtUtil.extractUsername(refreshToken))
                .orElseThrow(() -> new BadCredentialsException("User not found"));
        return createTokenResponse(user);
    }

    private User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        return user;
    }

    private TokenResponse createTokenResponse(User user) {
        return new TokenResponse(
                jwtUtil.generateAccessToken(user.getUsername(), user.getRole()),
                jwtUtil.generateRefreshToken(user.getUsername(), user.getRole()),
                "Bearer",
                accessExpiration / 1000
        );
    }
}
