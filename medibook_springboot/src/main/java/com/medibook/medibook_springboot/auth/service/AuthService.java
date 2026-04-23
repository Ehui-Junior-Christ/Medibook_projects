package com.medibook.medibook_springboot.auth.service;

import com.medibook.medibook_springboot.auth.dto.LoginResponseDto;
import com.medibook.medibook_springboot.auth.dto.RegisterDto;
import com.medibook.medibook_springboot.auth.entity.Role;
import com.medibook.medibook_springboot.auth.entity.Utilisateur;
import com.medibook.medibook_springboot.auth.repository.UtilisateurRepository;
import com.medibook.medibook_springboot.medecin.entity.Medecin;
import com.medibook.medibook_springboot.medecin.repository.MedecinRepository;
import com.medibook.medibook_springboot.patient.entity.CarnetMedical;
import com.medibook.medibook_springboot.patient.entity.Patient;
import com.medibook.medibook_springboot.patient.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PatientRepository patientRepository;
    private final MedecinRepository medecinRepository;

    public AuthService(
            UtilisateurRepository utilisateurRepository,
            PatientRepository patientRepository,
            MedecinRepository medecinRepository
    ) {
        this.utilisateurRepository = utilisateurRepository;
        this.patientRepository = patientRepository;
        this.medecinRepository = medecinRepository;
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
        validateRegisterRequest(request);

        Role role;
        try {
            role = Role.valueOf(request.getRole().trim().toUpperCase());
        } catch (Exception exception) {
            throw new IllegalArgumentException("Role invalide");
        }

        if (role == Role.PATIENT) {
            registerPatient(request);
            return;
        }

        if (role == Role.MEDECIN) {
            registerMedecin(request);
            return;
        }

        Utilisateur user = new Utilisateur();
        user.setNom(request.getNom().trim());
        user.setPrenom(request.getPrenom().trim());
        user.setCmu(request.getCmu().trim());
        user.setTelephone(normalize(request.getTelephone()));
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setMotDePasse(request.getMotDePasse());
        user.setRole(role);
        user.setActif(true);
        user.setPhotoProfil(defaultPhoto(request.getPhotoProfil()));

        utilisateurRepository.save(user);
    }

    private void registerPatient(RegisterDto request) {
        Patient patient = new Patient();
        patient.setNom(request.getNom().trim());
        patient.setPrenom(request.getPrenom().trim());
        patient.setCmu(request.getCmu().trim());
        patient.setTelephone(normalize(request.getTelephone()));
        patient.setEmail(request.getEmail().trim().toLowerCase());
        patient.setMotDePasse(request.getMotDePasse());
        patient.setRole(Role.PATIENT);
        patient.setActif(true);
        patient.setPhotoProfil(defaultPhoto(request.getPhotoProfil()));
        patient.setGroupeSanguin(normalize(request.getGroupeSanguin()));
        patient.setSexe(normalize(request.getSexe()));

        if (request.getDateNaissance() != null && !request.getDateNaissance().isBlank()) {
            patient.setDateNaissance(LocalDate.parse(request.getDateNaissance()));
        }

        CarnetMedical carnetMedical = new CarnetMedical();
        carnetMedical.setPatient(patient);
        carnetMedical.setAllergies(normalize(request.getAllergie()));
        patient.setCarnetMedical(carnetMedical);

        patientRepository.save(patient);
    }

    private void registerMedecin(RegisterDto request) {
        if (isBlank(request.getMatricule())) {
            throw new IllegalArgumentException("Le matricule medecin est obligatoire");
        }
        if (medecinRepository.existsByMatricule(request.getMatricule().trim())) {
            throw new IllegalArgumentException("Matricule medecin deja utilise");
        }

        Medecin medecin = new Medecin();
        medecin.setNom(request.getNom().trim());
        medecin.setPrenom(request.getPrenom().trim());
        medecin.setCmu(request.getCmu().trim());
        medecin.setTelephone(normalize(request.getTelephone()));
        medecin.setEmail(request.getEmail().trim().toLowerCase());
        medecin.setMotDePasse(request.getMotDePasse());
        medecin.setRole(Role.MEDECIN);
        medecin.setActif(true);
        medecin.setPhotoProfil(defaultPhoto(request.getPhotoProfil()));
        medecin.setMatricule(request.getMatricule().trim());
        medecin.setSpecialiteMedicale(normalize(request.getSpecialiteMedicale()));
        medecin.setBiographie(normalize(request.getService()));

        medecinRepository.save(medecin);
    }

    private void validateRegisterRequest(RegisterDto request) {
        if (request == null) {
            throw new IllegalArgumentException("Requete invalide");
        }
        if (isBlank(request.getNom()) || isBlank(request.getPrenom()) || isBlank(request.getCmu())
                || isBlank(request.getTelephone()) || isBlank(request.getEmail())
                || isBlank(request.getMotDePasse()) || isBlank(request.getRole())) {
            throw new IllegalArgumentException("Veuillez renseigner tous les champs obligatoires");
        }
        if (utilisateurRepository.existsByCmu(request.getCmu().trim())) {
            throw new IllegalArgumentException("CMU deja utilise");
        }
        if (utilisateurRepository.existsByTelephone(request.getTelephone().trim())) {
            throw new IllegalArgumentException("Telephone deja utilise");
        }
        if (utilisateurRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new IllegalArgumentException("Email deja utilise");
        }
        if (request.getMotDePasse().length() < 8) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins 8 caracteres");
        }
    }

    private String normalize(String value) {
        return isBlank(value) ? null : value.trim();
    }

    private String defaultPhoto(String value) {
        return isBlank(value) ? "default.jpg" : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
