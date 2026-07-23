package com.crochet.crochetstore.controller;

import com.crochet.crochetstore.model.User;
import com.crochet.crochetstore.service.AuthService;
import com.crochet.crochetstore.dto.TokenResponse;

import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody User user) {
        return authService.register(user);
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
