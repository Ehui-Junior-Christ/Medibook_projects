package com.medibook.medibook_springboot.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {

    private Long id;
    private String nom;
    private String prenom;
    private String role;
    
    private String cmu;
    private String telephone;
    private String email;
    private String photoProfil;
    
    private String matricule;
    private String specialiteMedicale;
    private String service;
    
    private String sexe;
    private String dateNaissance;
}