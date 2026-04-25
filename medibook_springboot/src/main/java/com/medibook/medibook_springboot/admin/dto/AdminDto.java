package com.medibook.medibook_springboot.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

public class AdminDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UtilisateurResponse {
        private Long id;
        private String nom;
        private String prenom;
        private String nomComplet;
        private String email;
        private String telephone;
        private String cmu;
        private String role;
        private Boolean actif;
        private String photoProfil;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatistiquesResponse {
        private long totalPatients;
        private long totalMedecins;
        private long totalInfirmiers;
        private long totalAdmins;
        private long comptesActifs;
        private long comptesInactifs;
        private long totalUtilisateurs;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessageResponse {
        private String message;
        private boolean succes;
    }
}