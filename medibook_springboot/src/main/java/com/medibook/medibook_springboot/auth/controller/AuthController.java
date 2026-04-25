package com.medibook.medibook_springboot.auth.controller;

import com.medibook.medibook_springboot.auth.dto.LoginDto;
import com.medibook.medibook_springboot.auth.dto.LoginResponseDto;
import com.medibook.medibook_springboot.auth.dto.RegisterDto;
import com.medibook.medibook_springboot.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto request) {
        try {
            return ResponseEntity.ok(
                    authService.login(request.getIdentifiant(), request.getMotDePasse(), request.getRole())
            );
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getMessage());
        } catch (RuntimeException exception) {
            String message = exception.getMessage();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(message == null || message.isBlank()
                            ? "Identifiants incorrects"
                            : message);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto request) {
        try {
            authService.register(request);
            return ResponseEntity.ok("Utilisateur cree avec succes");
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getMessage());
        } catch (DataIntegrityViolationException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Certaines informations sont invalides ou deja utilisees");
        } catch (RuntimeException exception) {
            String message = exception.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(message == null || message.isBlank()
                            ? "Erreur lors de la creation du compte"
                            : message);
        }
    }
}
