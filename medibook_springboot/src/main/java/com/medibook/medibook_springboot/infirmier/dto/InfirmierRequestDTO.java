package com.medibook.medibook_springboot.infirmier.dto;

import lombok.Data;

@Data
public class InfirmierRequestDTO {
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String cmu;
    private String motDePasse;
    private String photoProfil;
    private String matricule;
    private String service;
    private String biographie;
}
