package com.medibook.medibook_springboot.medecin.dto;

import lombok.Data;

@Data
public class MedecinRequestDto {
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String cmu;
    private String motDePasse;
    private String photoProfil;
    private String matricule;
    private String specialiteMedicale;
    private String biographie;
}
