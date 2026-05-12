package dev.joeyfoxo.webbackend.service;

import dev.joeyfoxo.webbackend.models.User;
import dev.joeyfoxo.webbackend.models.UserRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserQueryDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public UserQueryDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
        // Now searching the 'username' column for "Joey"
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername()) // Principal is now the username
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }

}
