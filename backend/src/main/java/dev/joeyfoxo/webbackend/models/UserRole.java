package dev.joeyfoxo.webbackend.models;

import lombok.Getter;

@Getter
public enum UserRole {
    JOEY(0, "Me 🦊"),
    ADMIN(1, "Admin users have full access to all resources and operations"),
    DEV(2, "Other developers who may need access to my stuff"),
    BOT(3, "Commonly assigned for Bots and Webhooks"),
    TRUSTED(4, "A Trusted User"),
    AUTHENTICATED(5, "Authenticated User");

    private final String description;
    private final int permissionRank; // Low = Highest Rank
    UserRole(int permissionRank, String description) {
        this.permissionRank = permissionRank;
        this.description = description;
    }

    public static UserRole getRoleByName(String name) {
        for (UserRole role : UserRole.values()) {
            if (role.name().equalsIgnoreCase(name)) {
                return role;
            }
        }
        throw new IllegalArgumentException("No role found with name: " + name);
    }

}
