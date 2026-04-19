package com.medibook.medibook_springboot.auth.controller;

import com.medibook.medibook_springboot.auth.dto.LoginDto;
import com.medibook.medibook_springboot.auth.dto.LoginResponseDto;
import com.medibook.medibook_springboot.auth.service.AuthService;
import com.medibook.medibook_springboot.auth.dto.RegisterDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponseDto login(@RequestBody LoginDto request) {
        return authService.login(request.getIdentifiant(), request.getMotDePasse());
    }
    @PostMapping("/register")
    public String register(@RequestBody RegisterDto request) {
        authService.register(request);
        return "Utilisateur créé avec succès";
    }
}
