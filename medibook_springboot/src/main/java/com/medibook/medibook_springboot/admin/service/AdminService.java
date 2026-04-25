package com.medibook.medibook_springboot.admin.service;

import com.medibook.medibook_springboot.admin.dto.AdminDto;
import com.medibook.medibook_springboot.admin.repository.AdminRepository;
import com.medibook.medibook_springboot.auth.entity.Role;
import com.medibook.medibook_springboot.auth.entity.Utilisateur;
import com.medibook.medibook_springboot.auth.repository.UtilisateurRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final UtilisateurRepository utilisateurRepository;

    public AdminService(AdminRepository adminRepository,
                        UtilisateurRepository utilisateurRepository) {
        this.adminRepository = adminRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    // Tous les utilisateurs, avec filtre optionnel par rôle
    public List<AdminDto.UtilisateurResponse> findAllUtilisateurs(String role) {
        List<Utilisateur> utilisateurs;

        if (role != null && !role.isBlank()) {
            Role roleEnum = Role.valueOf(role.toUpperCase());
            utilisateurs = utilisateurRepository.findAll()
                    .stream()
                    .filter(u -> u.getRole() == roleEnum)
                    .collect(Collectors.toList());
        } else {
            utilisateurs = utilisateurRepository.findAll();
        }

        return utilisateurs.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Comptes inactifs (en attente de validation)
    public List<AdminDto.UtilisateurResponse> findComptesEnAttente() {
        return utilisateurRepository.findAll()
                .stream()
                .filter(u -> u.getActif() != null && !u.getActif())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Trouver un utilisateur par ID
    public AdminDto.UtilisateurResponse findById(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Utilisateur introuvable : " + id));
        return mapToResponse(utilisateur);
    }

    // Activer un compte
    public AdminDto.MessageResponse activerCompte(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
        utilisateur.setActif(true);
        utilisateurRepository.save(utilisateur);
        return new AdminDto.MessageResponse(
                "Compte de " + utilisateur.getNomComplet() + " activé.", true);
    }

    // Désactiver un compte
    public AdminDto.MessageResponse desactiverCompte(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
        utilisateur.setActif(false);
        utilisateurRepository.save(utilisateur);
        return new AdminDto.MessageResponse(
                "Compte de " + utilisateur.getNomComplet() + " désactivé.", true);
    }

    // Supprimer un compte
    public AdminDto.MessageResponse supprimerCompte(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
        String nom = utilisateur.getNomComplet();
        utilisateurRepository.deleteById(id);
        return new AdminDto.MessageResponse("Compte de " + nom + " supprimé.", true);
    }

    // Statistiques globales
    public AdminDto.StatistiquesResponse getStatistiques() {
        List<Utilisateur> tous = utilisateurRepository.findAll();

        long patients   = tous.stream().filter(u -> u.getRole() == Role.PATIENT).count();
        long medecins   = tous.stream().filter(u -> u.getRole() == Role.MEDECIN).count();
        long infirmiers = tous.stream().filter(u -> u.getRole() == Role.INFIRMIER).count();
        long admins     = tous.stream().filter(u -> u.getRole() == Role.ADMINISTRATEUR).count();
        long actifs     = tous.stream().filter(u -> u.getActif() != null && u.getActif()).count();
        long inactifs   = tous.stream().filter(u -> u.getActif() == null || !u.getActif()).count();

        return new AdminDto.StatistiquesResponse(
                patients, medecins, infirmiers, admins,
                actifs, inactifs, tous.size());
    }

    // Convertir Utilisateur → DTO
    private AdminDto.UtilisateurResponse mapToResponse(Utilisateur u) {
        AdminDto.UtilisateurResponse dto = new AdminDto.UtilisateurResponse();
        dto.setId(u.getId());
        dto.setNom(u.getNom());
        dto.setPrenom(u.getPrenom());
        dto.setNomComplet(u.getNomComplet());
        dto.setEmail(u.getEmail());
        dto.setTelephone(u.getTelephone());
        dto.setCmu(u.getCmu());
        dto.setRole(u.getRole() != null ? u.getRole().name() : null);
        dto.setActif(u.getActif());
        dto.setPhotoProfil(u.getPhotoProfil());
        dto.setCreatedAt(u.getCreatedAt());
        return dto;
    }
}
