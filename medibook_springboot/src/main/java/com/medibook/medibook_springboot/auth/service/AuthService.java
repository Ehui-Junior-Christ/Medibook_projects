package com.medibook.medibook_springboot.auth.service;

import com.medibook.medibook_springboot.auth.dto.LoginResponseDto;
import com.medibook.medibook_springboot.auth.dto.RegisterDto;
import com.medibook.medibook_springboot.auth.entity.Utilisateur;
import com.medibook.medibook_springboot.auth.entity.Role;
import com.medibook.medibook_springboot.auth.repository.UtilisateurRepository;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;

    // ✅ constructeur simple
    public AuthService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    // ==========================
    // LOGIN
    // ==========================
    public LoginResponseDto login(String identifiant, String motDePasse) {

        Utilisateur utilisateur = utilisateurRepository
                .findByCmuOrTelephone(identifiant, identifiant)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!motDePasse.equals(utilisateur.getMotDePasse())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        if (utilisateur.getActif() == null || !utilisateur.getActif()) {
            throw new RuntimeException("Compte désactivé");
        }

        return new LoginResponseDto(
                utilisateur.getId(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getRole().name()
        );
    }

    // ==========================
    // REGISTER
    // ==========================
    public void register(RegisterDto request) {

        if (utilisateurRepository.existsByCmu(request.getCmu())) {
            throw new RuntimeException("CMU déjà utilisé");
        }

        if (utilisateurRepository.existsByTelephone(request.getTelephone())) {
            throw new RuntimeException("Téléphone déjà utilisé");
        }

        // 👉 création utilisateur
        Utilisateur user = new Utilisateur();
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setCmu(request.getCmu());
        user.setTelephone(request.getTelephone());
        user.setEmail(request.getEmail());
        user.setMotDePasse(request.getMotDePasse());
        user.setRole(Role.valueOf(request.getRole()));
        user.setActif(true);
        user.setPhotoProfil(request.getPhotoProfil());

        // 👉 sauvegarde utilisateur
        utilisateurRepository.save(user);

        // 👉 PARTIE PATIENT (désactivée pour l'instant)
        /*
        if (request.getDateNaissance() != null && !request.getDateNaissance().isEmpty()) {

            Patient patient = new Patient();
            patient.setIdUtilisateur(savedUser.getId());
            patient.setDateNaissance(java.sql.Date.valueOf(request.getDateNaissance()));

            patientRepository.save(patient);
        }
        */
    }
}