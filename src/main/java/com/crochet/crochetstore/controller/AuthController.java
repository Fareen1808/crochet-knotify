package com.crochet.crochetstore.controller;

import com.crochet.crochetstore.model.User;
import com.crochet.crochetstore.service.AuthService;
import com.crochet.crochetstore.dto.RegisterRequest;
import com.crochet.crochetstore.dto.TokenResponse;


import com.crochet.crochetstore.dto.RegisterRequest;
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
    public String login(@RequestParam String username,
                        @RequestParam String password) {
        return authService.login(username, password);
    }

    @PostMapping("/login/tokens")
    public TokenResponse loginWithRefreshToken(@RequestParam String username,
                                               @RequestParam String password) {
        return authService.loginWithRefreshToken(username, password);
    }

    @PostMapping("/refresh")
    public TokenResponse refresh(@RequestParam String refreshToken) {
        return authService.refresh(refreshToken);
    }
}
