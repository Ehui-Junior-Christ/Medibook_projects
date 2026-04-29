package com.medibook.medibook_springboot.medecin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class MedicamentDto {
    private Long id;

    @NotBlank(message = "Le nom du medicament est obligatoire.")
    private String nom;

    @NotBlank(message = "Le dosage du medicament est obligatoire.")
    private String dosage;

    @NotBlank(message = "La voie d'administration est obligatoire.")
    private String voie;

    @NotNull(message = "Le nombre de prises par jour est obligatoire.")
    @Positive(message = "Le nombre de prises par jour doit etre positif.")
    private Integer prisesParJour;

    @NotBlank(message = "Les moments de prise sont obligatoires.")
    private String moments;

    @NotNull(message = "La duree du traitement est obligatoire.")
    @Positive(message = "La duree du traitement doit etre positive.")
    private Integer dureeJours;

    @NotBlank(message = "Les instructions du medicament sont obligatoires.")
    private String instructions;
}
