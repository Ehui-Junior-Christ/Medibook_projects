package com.medibook.medibook_springboot.auth.service;

import com.medibook.medibook_springboot.auth.dto.LoginResponseDto;
import com.medibook.medibook_springboot.auth.dto.RegisterDto;
import com.medibook.medibook_springboot.auth.entity.Role;
import com.medibook.medibook_springboot.auth.entity.Utilisateur;
import com.medibook.medibook_springboot.auth.repository.UtilisateurRepository;
import com.medibook.medibook_springboot.patient.entity.CarnetMedical;
import com.medibook.medibook_springboot.patient.entity.Patient;
import com.medibook.medibook_springboot.patient.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PatientRepository patientRepository;

    public AuthService(UtilisateurRepository utilisateurRepository, PatientRepository patientRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.patientRepository = patientRepository;
    }

    public LoginResponseDto login(String identifiant, String motDePasse) {
        Utilisateur utilisateur = utilisateurRepository
                .findByCmuOrTelephone(identifiant, identifiant)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!motDePasse.equals(utilisateur.getMotDePasse())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        if (utilisateur.getActif() == null || !utilisateur.getActif()) {
            throw new RuntimeException("Compte desactive");
        }

        return new LoginResponseDto(
                utilisateur.getId(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getRole().name()
        );
    }

    public void register(RegisterDto request) {
        if (utilisateurRepository.existsByCmu(request.getCmu())) {
            throw new RuntimeException("CMU deja utilise");
        }

        if (request.getTelephone() != null && utilisateurRepository.existsByTelephone(request.getTelephone())) {
            throw new RuntimeException("Telephone deja utilise");
        }

        Role role = Role.valueOf(request.getRole());

        if (role == Role.PATIENT) {
            Patient patient = new Patient();
            patient.setNom(request.getNom());
            patient.setPrenom(request.getPrenom());
            patient.setCmu(request.getCmu());
            patient.setTelephone(request.getTelephone());
            patient.setEmail(request.getEmail());
            patient.setMotDePasse(request.getMotDePasse());
            patient.setRole(Role.PATIENT);
            patient.setActif(true);
            patient.setPhotoProfil(request.getPhotoProfil());
            patient.setGroupeSanguin(request.getGroupeSanguin());

            if (request.getDateNaissance() != null && !request.getDateNaissance().isBlank()) {
                patient.setDateNaissance(LocalDate.parse(request.getDateNaissance()));
            }

            CarnetMedical carnetMedical = new CarnetMedical();
            carnetMedical.setPatient(patient);
            carnetMedical.setAllergies(request.getAllergie());
            patient.setCarnetMedical(carnetMedical);

            patientRepository.save(patient);
            return;
        }

        Utilisateur user = new Utilisateur();
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setCmu(request.getCmu());
        user.setTelephone(request.getTelephone());
        user.setEmail(request.getEmail());
        user.setMotDePasse(request.getMotDePasse());
        user.setRole(role);
        user.setActif(true);
        user.setPhotoProfil(request.getPhotoProfil());

        utilisateurRepository.save(user);
    }
}
