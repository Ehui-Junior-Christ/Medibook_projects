package com.medibook.medibook_springboot.medecin.dto;

import lombok.Data;

@Data
public class MedecinResponseDto {
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
    private String specialiteMedicale;
    private String biographie;
}
