package com.crochet.crochetstore;

import com.crochet.crochetstore.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtUtilTests {

    private final JwtUtil jwtUtil = configuredJwtUtil();

    @Test
    void accessTokenIsValidOnlyForAccessAuthentication() {
        String accessToken = jwtUtil.generateAccessToken("alice", "USER");

        assertThat(jwtUtil.validateToken(accessToken)).isTrue();
        assertThat(jwtUtil.validateRefreshToken(accessToken)).isFalse();
        assertThat(jwtUtil.extractUsername(accessToken)).isEqualTo("alice");
        assertThat(jwtUtil.extractRole(accessToken)).isEqualTo("USER");
    }

    @Test
    void refreshTokenCannotAuthenticateProtectedEndpoints() {
        String refreshToken = jwtUtil.generateRefreshToken("alice", "USER");

        assertThat(jwtUtil.validateRefreshToken(refreshToken)).isTrue();
        assertThat(jwtUtil.validateToken(refreshToken)).isFalse();
    }

    private JwtUtil configuredJwtUtil() {
        JwtUtil util = new JwtUtil();
        ReflectionTestUtils.setField(util, "secret", "test-secret-that-is-long-enough-for-hs256-signing");
        ReflectionTestUtils.setField(util, "accessExpiration", 900_000L);
        ReflectionTestUtils.setField(util, "refreshExpiration", 604_800_000L);
        return util;
    }
}
