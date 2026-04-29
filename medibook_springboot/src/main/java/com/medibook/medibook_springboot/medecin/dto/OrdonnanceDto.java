package com.medibook.medibook_springboot.medecin.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class OrdonnanceDto {
    private Long id;

    @NotNull(message = "Le patient est obligatoire.")
    private Long patientId;
    private String patientNom;

    @NotNull(message = "Le medecin est obligatoire.")
    private Long medecinId;
    private String medecinNom;

    @NotNull(message = "La consultation liee est obligatoire.")
    @Positive(message = "La consultation liee est invalide.")
    private Long consultationId;

    @NotNull(message = "La date de prescription est obligatoire.")
    private LocalDate datePrescription;
    private String statut;

    @NotBlank(message = "Le renouvellement est obligatoire.")
    private String renouvellement;

    @NotNull(message = "La validite de l'ordonnance est obligatoire.")
    @Positive(message = "La validite de l'ordonnance doit etre positive.")
    private Integer validiteJours;

    @NotBlank(message = "Les recommandations sont obligatoires.")
    private String recommandations;

    @Valid
    @NotEmpty(message = "Au moins un medicament est obligatoire.")
    private List<MedicamentDto> medicaments = new ArrayList<>();
}
