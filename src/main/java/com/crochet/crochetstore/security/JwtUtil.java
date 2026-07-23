package com.crochet.crochetstore.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-expiration}")
    private long accessExpiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // GENERATE TOKEN
    public String generateToken(String username, String role) {
        return generateAccessToken(username, role);
    }

    public String generateAccessToken(String username, String role) {
        return generateToken(username, role, "access", accessExpiration);
    }

    public String generateRefreshToken(String username, String role) {
        return generateToken(username, role, "refresh", refreshExpiration);
    }

    private String generateToken(String username, String role, String tokenType, long expiration) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("tokenType", tokenType)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // VALIDATE TOKEN
    public boolean validateToken(String token) {
        return validateTokenType(token, "access");
    }

    public boolean validateRefreshToken(String token) {
        return validateTokenType(token, "refresh");
    }

    private boolean validateTokenType(String token, String expectedTokenType) {
        try {
            String tokenType = parseClaims(token).getBody().get("tokenType", String.class);
            return expectedTokenType.equals(tokenType);
        } catch (Exception e) {
            return false;
        }
    }

    private Jws<Claims> parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token);
    }

    // EXTRACT USERNAME
    public String extractUsername(String token) {
        return parseClaims(token)
                .getBody()
                .getSubject();
    }

    // EXTRACT ROLE
    public String extractRole(String token) {
        return parseClaims(token)
                .getBody()
                .get("role", String.class);
    }
}
