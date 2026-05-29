package dev.joeyfoxo.webbackend.dto;

import dev.joeyfoxo.webbackend.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    private String email;
    private String username;
    // New field to hold the nested role metadata
    private RoleInfoResponse role;

    public UserResponse(User user) {
        this.email = user.getEmail();
        this.username = user.getUsername();

        // Populate the new field using your Enum's data
        // To Access: user.role.role , user.role.description , user.role.rank
        this.role = new RoleInfoResponse(
                user.getRole().name(),
                user.getRole().getDescription(),
                user.getRole().getPermissionRank()
        );
    }
}