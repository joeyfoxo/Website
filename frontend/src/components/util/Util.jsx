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

// ==========================================
// 🛠️ MODERN & COMPACT LINK MASKING UTILITIES
// ==========================================

/**
 * Compacts file details into a positional array, encodes via modern UTF-8,
 * and strips out URL-unsafe characters and padding to minimize string length.
 */
export const generateFileId = (file, role, pathString) => {
    // Drop the object keys to instantly save ~50 bytes of overhead
    const compactPayload = [
        file.fullName,
        file.displayName,
        role,
        pathString
    ];

    // Safely encode UTF-8 text using standard modern APIs instead of unescape()
    const jsonString = JSON.stringify(compactPayload);
    const utf8Bytes = new TextEncoder().encode(jsonString);
    const binaryString = String.fromCodePoint(...utf8Bytes);

    // Convert to Base64 and squeeze out unnecessary URL weight
    return btoa(binaryString)
        .replace(/\+/g, '-')   // Make URL safe
        .replace(/\//g, '_')   // Make URL safe
        .replace(/=+$/, '');   // Strip trailing padding '=' for maximum compression
};

/**
 * Decodes the stripped URL-safe Base64 string back into the required file object.
 */
export const parseFileId = (fileId) => {
    try {
        if (!fileId) return null;

        // Restore standard Base64 characters and padding lengths
        let base64 = fileId.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
            base64 += '=';
        }

        // Decode binary back into a UTF-8 string array
        const binaryString = atob(base64);
        const utf8Bytes = Uint8Array.from(binaryString, (char) => char.codePointAt(0));
        const jsonString = new TextDecoder().decode(utf8Bytes);

        // Unpack positional array back into the original object structure
        const [filename, displayName, role, path] = JSON.parse(jsonString);

        return { filename, displayName, role, path };
    } catch (error) {
        console.error("Failed to parse compact fileId:", error);
        return null;
    }
};