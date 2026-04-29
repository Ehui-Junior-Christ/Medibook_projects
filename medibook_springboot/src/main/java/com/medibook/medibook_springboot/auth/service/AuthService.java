package com.medibook.medibook_springboot.auth.service;

import com.medibook.medibook_springboot.auth.dto.LoginResponseDto;
import com.medibook.medibook_springboot.auth.dto.RegisterDto;
import com.medibook.medibook_springboot.auth.entity.Role;
import com.medibook.medibook_springboot.auth.entity.Utilisateur;
import com.medibook.medibook_springboot.auth.repository.UtilisateurRepository;
import com.medibook.medibook_springboot.infirmier.entity.Infirmier;
import com.medibook.medibook_springboot.infirmier.repository.InfirmierRepository;
import com.medibook.medibook_springboot.medecin.entity.Medecin;
import com.medibook.medibook_springboot.medecin.repository.MedecinRepository;
import com.medibook.medibook_springboot.patient.entity.CarnetMedical;
import com.medibook.medibook_springboot.patient.entity.Patient;
import com.medibook.medibook_springboot.patient.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PatientRepository patientRepository;
    private final MedecinRepository medecinRepository;
    private final InfirmierRepository infirmierRepository;

    public AuthService(
            UtilisateurRepository utilisateurRepository,
            PatientRepository patientRepository,
            MedecinRepository medecinRepository,
            InfirmierRepository infirmierRepository
    ) {
        this.utilisateurRepository = utilisateurRepository;
        this.patientRepository = patientRepository;
        this.medecinRepository = medecinRepository;
        this.infirmierRepository = infirmierRepository;
    }

    public LoginResponseDto login(String identifiant, String motDePasse, String requestedRole) {
        String normalizedIdentifiant = normalize(identifiant);
        String normalizedRequestedRole = normalize(requestedRole);

        if (normalizedIdentifiant == null || isBlank(motDePasse)) {
            throw new IllegalArgumentException("Identifiant et mot de passe obligatoires");
        }

        List<Utilisateur> utilisateurs = findLoginCandidates(normalizedIdentifiant);
        if (utilisateurs.isEmpty()) {
            throw new RuntimeException("Utilisateur introuvable");
        }

        if (normalizedRequestedRole != null) {
            Role role = parseRole(normalizedRequestedRole);
            utilisateurs = utilisateurs.stream()
                    .filter(utilisateur -> utilisateur.getRole() == role)
                    .collect(Collectors.toList());
            if (utilisateurs.isEmpty()) {
                throw new RuntimeException("Aucun compte ne correspond au role selectionne");
            }
        }

        List<Utilisateur> utilisateursAvecBonMotDePasse = utilisateurs.stream()
                .filter(utilisateur -> motDePasse.equals(utilisateur.getMotDePasse()))
                .collect(Collectors.toList());

        if (utilisateursAvecBonMotDePasse.isEmpty()) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        Utilisateur utilisateur = resolveLoginUser(utilisateursAvecBonMotDePasse, normalizedRequestedRole);

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

    private List<Utilisateur> findLoginCandidates(String identifiant) {
        Map<Long, Utilisateur> candidats = new LinkedHashMap<>();

        utilisateurRepository.findAllByCmu(identifiant).forEach(utilisateur -> candidats.put(utilisateur.getId(), utilisateur));
        utilisateurRepository.findAllByTelephone(identifiant).forEach(utilisateur -> candidats.put(utilisateur.getId(), utilisateur));
        medecinRepository.findByMatricule(identifiant).ifPresent(medecin -> candidats.put(medecin.getId(), medecin));
        infirmierRepository.findByMatricule(identifiant).ifPresent(infirmier -> candidats.put(infirmier.getId(), infirmier));

        return candidats.values().stream().filter(Objects::nonNull).collect(Collectors.toList());
    }

    private Utilisateur resolveLoginUser(List<Utilisateur> utilisateurs, String requestedRole) {
        if (utilisateurs.size() == 1) {
            return utilisateurs.get(0);
        }

        if (requestedRole != null) {
            throw new RuntimeException("Plusieurs comptes correspondent a cet identifiant pour ce role");
        }

        List<Utilisateur> comptesMedicaux = utilisateurs.stream()
                .filter(this::isMedicalRole)
                .collect(Collectors.toList());
        if (comptesMedicaux.size() == 1) {
            return comptesMedicaux.get(0);
        }

        throw new RuntimeException("Plusieurs comptes correspondent a cet identifiant. Precisez le role pour vous connecter");
    }

    private Role parseRole(String role) {
        try {
            return Role.valueOf(role.trim().toUpperCase());
        } catch (Exception exception) {
            throw new IllegalArgumentException("Role invalide");
        }
    }

    public void register(RegisterDto request) {
        Role role;
        try {
            role = Role.valueOf(request.getRole().trim().toUpperCase());
        } catch (Exception exception) {
            throw new IllegalArgumentException("Role invalide");
        }

        validateRegisterRequest(request, role);

        if (role == Role.PATIENT) {
            registerPatient(request);
            return;
        }

        if (role == Role.MEDECIN) {
            registerMedecin(request);
            return;
        }

        if (role == Role.INFIRMIER) {
            registerInfirmier(request);
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
            try {
                patient.setDateNaissance(LocalDate.parse(request.getDateNaissance()));
            } catch (Exception exception) {
                throw new IllegalArgumentException("Date de naissance invalide");
            }
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

    private void registerInfirmier(RegisterDto request) {
        if (isBlank(request.getMatricule())) {
            throw new IllegalArgumentException("Le matricule infirmier est obligatoire");
        }
        if (infirmierRepository.existsByMatricule(request.getMatricule().trim())) {
            throw new IllegalArgumentException("Matricule infirmier deja utilise");
        }

        Infirmier infirmier = new Infirmier();
        infirmier.setNom(request.getNom().trim());
        infirmier.setPrenom(request.getPrenom().trim());
        infirmier.setCmu(request.getCmu().trim());
        infirmier.setTelephone(normalize(request.getTelephone()));
        infirmier.setEmail(request.getEmail().trim().toLowerCase());
        infirmier.setMotDePasse(request.getMotDePasse());
        infirmier.setRole(Role.INFIRMIER);
        infirmier.setActif(true);
        infirmier.setPhotoProfil(defaultPhoto(request.getPhotoProfil()));
        infirmier.setMatricule(request.getMatricule().trim());
        infirmier.setService(normalize(request.getService()));

        infirmierRepository.save(infirmier);
    }

    private void validateRegisterRequest(RegisterDto request, Role role) {
        if (request == null) {
            throw new IllegalArgumentException("Requete invalide");
        }
        if (isBlank(request.getNom()) || isBlank(request.getPrenom()) || isBlank(request.getCmu())
                || isBlank(request.getTelephone()) || isBlank(request.getEmail())
                || isBlank(request.getMotDePasse()) || isBlank(request.getRole())) {
            throw new IllegalArgumentException("Veuillez renseigner tous les champs obligatoires");
        }

        if (role == Role.PATIENT || isMedicalRole(role)) {
            validatePatientMedicalSharedIdentifiers(request, role);
        } else if (utilisateurRepository.existsByCmu(request.getCmu().trim())) {
            throw new IllegalArgumentException("CMU deja utilise");
        } else if (utilisateurRepository.existsByTelephone(request.getTelephone().trim())) {
            throw new IllegalArgumentException("Telephone deja utilise");
        } else if (utilisateurRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new IllegalArgumentException("Email deja utilise");
        }

        if ((role == Role.MEDECIN || role == Role.INFIRMIER) && isBlank(request.getMatricule())) {
            throw new IllegalArgumentException("Le matricule est obligatoire pour ce role");
        }
        if (request.getMotDePasse().length() < 8) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins 8 caracteres");
        }
    }

    private void validatePatientMedicalSharedIdentifiers(RegisterDto request, Role targetRole) {
        Utilisateur cmuOwner = validateSharedFieldReuse(
                utilisateurRepository.findAllByCmu(request.getCmu().trim()),
                targetRole,
                "CMU deja utilise"
        );
        Utilisateur phoneOwner = validateSharedFieldReuse(
                utilisateurRepository.findAllByTelephone(request.getTelephone().trim()),
                targetRole,
                "Telephone deja utilise"
        );
        Utilisateur emailOwner = validateSharedFieldReuse(
                utilisateurRepository.findAllByEmail(request.getEmail().trim().toLowerCase()),
                targetRole,
                "Email deja utilise"
        );

        Utilisateur owner = firstNonNull(cmuOwner, phoneOwner, emailOwner);
        if (owner == null) {
            return;
        }

        if ((cmuOwner != null && !cmuOwner.getId().equals(owner.getId()))
                || (phoneOwner != null && !phoneOwner.getId().equals(owner.getId()))
                || (emailOwner != null && !emailOwner.getId().equals(owner.getId()))) {
            throw new IllegalArgumentException("CMU, telephone et email doivent appartenir au meme compte associe");
        }

        if (!sameIdentity(owner, request)) {
            throw new IllegalArgumentException("Nom et prenom doivent correspondre au proprietaire du compte associe");
        }

        if (targetRole == Role.PATIENT) {
            if (isBlank(request.getMatricule())) {
                throw new IllegalArgumentException("Le matricule du medecin/infirmier est obligatoire pour creer son compte patient");
            }

            if (!isOwnerMatricule(owner, request.getMatricule().trim())) {
                throw new IllegalArgumentException("Creation du compte patient autorisee uniquement pour le medecin/infirmier proprietaire de ces informations");
            }
        }
    }

    private Utilisateur validateSharedFieldReuse(List<Utilisateur> utilisateurs, Role targetRole, String message) {
        if (utilisateurs == null || utilisateurs.isEmpty()) {
            return null;
        }

        if (utilisateurs.size() > 1) {
            throw new IllegalArgumentException(message);
        }

        Utilisateur owner = utilisateurs.get(0);
        Role ownerRole = owner.getRole();

        if (targetRole == Role.PATIENT) {
            if (!isMedicalRole(ownerRole)) {
                throw new IllegalArgumentException(message);
            }
            return owner;
        }

        if (isMedicalRole(targetRole)) {
            if (ownerRole != Role.PATIENT) {
                throw new IllegalArgumentException(message);
            }
            return owner;
        }

        throw new IllegalArgumentException(message);
    }

    private Utilisateur firstNonNull(Utilisateur... utilisateurs) {
        for (Utilisateur utilisateur : utilisateurs) {
            if (utilisateur != null) {
                return utilisateur;
            }
        }
        return null;
    }

    private boolean isOwnerMatricule(Utilisateur owner, String matricule) {
        if (owner == null || isBlank(matricule)) {
            return false;
        }

        if (owner.getRole() == Role.MEDECIN) {
            return medecinRepository.findById(owner.getId())
                    .map(Medecin::getMatricule)
                    .map(value -> value != null && value.equalsIgnoreCase(matricule))
                    .orElse(false);
        }
        if (owner.getRole() == Role.INFIRMIER) {
            return infirmierRepository.findById(owner.getId())
                    .map(Infirmier::getMatricule)
                    .map(value -> value != null && value.equalsIgnoreCase(matricule))
                    .orElse(false);
        }
        return false;
    }

    private boolean sameIdentity(Utilisateur owner, RegisterDto request) {
        if (owner == null || request == null) {
            return false;
        }
        String requestNom = request.getNom() == null ? "" : request.getNom().trim();
        String requestPrenom = request.getPrenom() == null ? "" : request.getPrenom().trim();
        String ownerNom = owner.getNom() == null ? "" : owner.getNom().trim();
        String ownerPrenom = owner.getPrenom() == null ? "" : owner.getPrenom().trim();
        return ownerNom.equalsIgnoreCase(requestNom) && ownerPrenom.equalsIgnoreCase(requestPrenom);
    }

    private boolean isMedicalRole(Utilisateur utilisateur) {
        return utilisateur != null
                && (utilisateur.getRole() == Role.MEDECIN || utilisateur.getRole() == Role.INFIRMIER);
    }

    private boolean isMedicalRole(Role role) {
        return role == Role.MEDECIN || role == Role.INFIRMIER;
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
