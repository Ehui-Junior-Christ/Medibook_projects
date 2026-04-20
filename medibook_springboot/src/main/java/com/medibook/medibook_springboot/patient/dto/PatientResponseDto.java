package com.medibook.medibook_springboot.patient.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientResponseDto {
    private Long id;
    private String nom;
    private String prenom;
    private String nomComplet;
    private String email;
    private String telephone;
    private String numeroAssure;
    private String photoProfil;
    private Boolean actif;
    private LocalDate dateNaissance;
    private String sexe;
    private String adresse;
    private String profession;
    private String situationFamiliale;
    private String numeroUrgence;
    private String personneUrgence;
    private String lienUrgence;
    private String assurance;
    private Double poids;
    private Double taille;
    private String groupeSanguin;
    private String handicap;
    private String notesPatient;
    private String medecinTraitant;
    private String specialiteMedecin;
    private String telephoneMedecin;
    private String allergies;
    private String antecedents;
    private String maladiesChroniques;
    private String traitements;
    private CarnetMedicalDto carnetMedical;
}
