package com.crochet.crochetstore.controller;

import com.crochet.crochetstore.service.AuthService;
import com.crochet.crochetstore.dto.LoginRequest;
import com.crochet.crochetstore.dto.RegisterRequest;
import com.crochet.crochetstore.dto.TokenResponse;
import com.crochet.crochetstore.dto.RefreshTokenRequest;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
public ResponseEntity<?> register(
        @Valid @RequestBody RegisterRequest request) {

    authService.register(request);

    return ResponseEntity.ok("User registered successfully");
}

    @PostMapping("/login")
public String login(@Valid @RequestBody LoginRequest request) {

    return authService.login(
            request.getUsername(),
            request.getPassword()
    );
}

    @PostMapping("/login/tokens")
public TokenResponse loginWithRefreshToken(
        @Valid @RequestBody LoginRequest request) {

    return authService.loginWithRefreshToken(
            request.getUsername(),
            request.getPassword()
    );
}

    @PostMapping("/refresh")
public TokenResponse refresh(
        @Valid @RequestBody RefreshTokenRequest request) {

    return authService.refresh(
            request.getRefreshToken()
    );
}
}
