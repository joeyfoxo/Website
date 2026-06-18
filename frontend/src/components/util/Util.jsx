import {Navigate} from "react-router-dom";
import React from "react";

/**
 * Determines the unique Material-UI theme color for each user rank.
 * * @param {string} role - The name of the role (e.g., 'ADMIN', 'JOEY')
 * @returns {string} Unique MUI color token ('error', 'secondary', 'warning', 'success', 'primary', 'info', 'default')
 * * @example
 * import { getRoleColor } from '../utils/roleHelpers';
 * <Chip label={user.role.role} color={getRoleColor(user.role.role)} />
 */
export const getRoleColor = (role) => {
    const normalizedRole = role?.toUpperCase();

    const roleColors = {
        JOEY: 'error',            // Red
        ADMIN: 'secondary',       // Purple
        DEV: 'warning',           // Orange
        TRUSTED: 'success',       // Green
        AUTHENTICATED: 'primary', // Blue
        BOT: 'info',              // Light Blue
    };

    // Fallback to 'default' (Grey) if an unexpected string comes through
    return roleColors[normalizedRole] || 'default';
};

export const isUserEqualAbove = (user, requiredRank) => {
    // 1. If there is no user, they definitely don't meet the rank requirement
    if (!user) {
        return false;
    }

    // 2. Numerical rank comparison (Lower numbers = higher privileges)
    return user?.role?.rank <= requiredRank;
}