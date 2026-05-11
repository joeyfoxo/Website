package dev.joeyfoxo.webbackend.controller;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;    // Matches your User @Id
    private String password;
}