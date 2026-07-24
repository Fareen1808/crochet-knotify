package com.crochet.crochetstore.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
    private String username;

    @NotBlank(message = "Password is required")

@Size(min = 8, message = "Password must be at least 8 characters")

@Pattern(
        regexp = ".*[A-Z].*",
        message = "Password must contain at least one uppercase letter"
)

@Pattern(
        regexp = ".*[a-z].*",
        message = "Password must contain at least one lowercase letter"
)

@Pattern(
        regexp = ".*\\d.*",
        message = "Password must contain at least one number"
)

@Pattern(
        regexp = ".*[^A-Za-z0-9].*",
        message = "Password must contain at least one special character"
)

private String password;

    private String role; // USER or ADMIN

    // getters & setters

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
