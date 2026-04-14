package com.medibook.medibook_springboot.auth.service;

import com.medibook.medibook_springboot.auth.entity.Utilisateur;
import com.medibook.medibook_springboot.auth.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // ==============================
    // LOGIN
    // ==============================
    public Utilisateur login(String identifiant, String motDePasse) {

        // 1. chercher utilisateur (CMU ou téléphone)
        Utilisateur utilisateur = utilisateurRepository
                .findByCmuOrTelephone(identifiant, identifiant)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // 2. vérifier mot de passe
        if (!passwordEncoder.matches(motDePasse, utilisateur.getMotDePasse())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        // 3. vérifier si actif
        if (!utilisateur.getActif()) {
            throw new RuntimeException("Compte désactivé");
        }

        // 4. retourner utilisateur
        return utilisateur;
    }
}