package com.medibook.medibook_springboot.admin.controller;

import com.medibook.medibook_springboot.admin.dto.AdminDto;
import com.medibook.medibook_springboot.admin.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Test rapide → GET /api/admin/ping
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Admin API operationnelle ✅");
    }

    // Statistiques → GET /api/admin/statistiques
    @GetMapping("/statistiques")
    public ResponseEntity<AdminDto.StatistiquesResponse> getStatistiques() {
        return ResponseEntity.ok(adminService.getStatistiques());
    }

    // Tous les utilisateurs → GET /api/admin/utilisateurs
    // Avec filtre → GET /api/admin/utilisateurs?role=PATIENT
    @GetMapping("/utilisateurs")
    public ResponseEntity<List<AdminDto.UtilisateurResponse>> getAllUtilisateurs(
            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(adminService.findAllUtilisateurs(role));
    }

    // Comptes en attente → GET /api/admin/utilisateurs/pending
    @GetMapping("/utilisateurs/pending")
    public ResponseEntity<List<AdminDto.UtilisateurResponse>> getComptesEnAttente() {
        return ResponseEntity.ok(adminService.findComptesEnAttente());
    }

    // Un utilisateur par ID → GET /api/admin/utilisateurs/5
    @GetMapping("/utilisateurs/{id}")
    public ResponseEntity<AdminDto.UtilisateurResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.findById(id));
    }

    // Activer → PUT /api/admin/utilisateurs/5/activer
    @PutMapping("/utilisateurs/{id}/activer")
    public ResponseEntity<AdminDto.MessageResponse> activer(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.activerCompte(id));
    }

    // Désactiver → PUT /api/admin/utilisateurs/5/desactiver
    @PutMapping("/utilisateurs/{id}/desactiver")
    public ResponseEntity<AdminDto.MessageResponse> desactiver(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.desactiverCompte(id));
    }

    // Supprimer → DELETE /api/admin/utilisateurs/5
    @DeleteMapping("/utilisateurs/{id}")
    public ResponseEntity<AdminDto.MessageResponse> supprimer(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.supprimerCompte(id));
    }
}