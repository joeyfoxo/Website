package dev.joeyfoxo.webbackend.dto;

import dev.joeyfoxo.webbackend.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    public UserResponse(User user) {
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.role = user.getRole().name();
    }

    private String email;
    private String username;
    private String role;
}