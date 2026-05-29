package dev.joeyfoxo.webbackend.service;

import dev.joeyfoxo.webbackend.models.UserRepository;
import dev.joeyfoxo.webbackend.models.UserRole;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("securityService")
public class SecurityService {

    private final UserRepository userRepository;

    public SecurityService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean isJoey(Authentication auth) {
        return checkPermissionRank(auth, UserRole.JOEY);
    }

    public boolean isAdminOrAbove(Authentication auth) {
        return checkPermissionRank(auth, UserRole.ADMIN);
    }

    public boolean isDevOrAbove(Authentication auth) {
        return checkPermissionRank(auth, UserRole.DEV);
    }

    public boolean isBotOrAbove(Authentication auth) {
        return checkPermissionRank(auth, UserRole.BOT);
    }

    public boolean isTrustedOrAbove(Authentication auth) {
        return checkPermissionRank(auth, UserRole.TRUSTED);
    }

    /**
     * Evaluates baseline/non-staff authenticated users.
     * Ensures the user exists in the database and holds at least standard access.
     */
    public boolean isAuthenticatedOrAbove(Authentication auth) {
        return checkPermissionRank(auth, UserRole.AUTHENTICATED);
    }

    /**
     * Private helper to safely extract and evaluate the user's permission rank
     * against a target role threshold.
     */
    private boolean checkPermissionRank(Authentication auth, UserRole targetRole) {
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        return userRepository.findByUsername(auth.getName())
                .map(user -> user.getRole().getPermissionRank() <= targetRole.getPermissionRank())
                .orElse(false);
    }
}