package com.medibook.medibook_springboot.auth.controller;

import com.medibook.medibook_springboot.auth.dto.LoginDto;
import com.medibook.medibook_springboot.auth.entity.Utilisateur;
import com.medibook.medibook_springboot.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public Utilisateur login(@RequestBody LoginDto request) {
        return authService.login(
                request.getIdentifiant(),
                request.getMotDePasse()
        );
    }
}