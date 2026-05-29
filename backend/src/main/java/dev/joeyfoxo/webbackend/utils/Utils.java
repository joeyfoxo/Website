package dev.joeyfoxo.webbackend.utils;

public class Utils {

    public static  String capitalizeUsername(String username) {
        if (username == null || username.isBlank()) {
            return username;
        }
        String cleaned = username.trim();
        if (cleaned.length() == 1) {
            return cleaned.toUpperCase();
        }
        return cleaned.substring(0, 1).toUpperCase() + cleaned.substring(1).toLowerCase();
    }
}
