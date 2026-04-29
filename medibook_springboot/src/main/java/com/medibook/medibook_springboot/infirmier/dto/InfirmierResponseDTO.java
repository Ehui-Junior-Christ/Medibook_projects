package com.medibook.medibook_springboot.infirmier.dto;

import lombok.Data;

@Data
public class InfirmierResponseDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String nomComplet;
    private String email;
    private String telephone;
    private String cmu;
    private String photoProfil;
    private Boolean actif;
    private String matricule;
    private String service;
    private String biographie;
}
