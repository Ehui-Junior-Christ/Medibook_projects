package com.medibook.medibook_springboot.medecin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ConsultationDto {
    private Long id;

    @NotNull(message = "Le patient est obligatoire.")
    private Long patientId;
    private String patientNom;

    @NotNull(message = "Le medecin est obligatoire.")
    private Long medecinId;
    private String medecinNom;

    @NotNull(message = "La date de consultation est obligatoire.")
    private LocalDate dateConsultation;

    @NotNull(message = "L'heure de consultation est obligatoire.")
    private LocalTime heureConsultation;

    @NotBlank(message = "Le motif principal est obligatoire.")
    private String motifPrincipal;

    @NotBlank(message = "Les symptomes sont obligatoires.")
    private String symptomes;

    @NotBlank(message = "Le diagnostic est obligatoire.")
    private String diagnostic;

    @NotBlank(message = "Le traitement est obligatoire.")
    private String traitement;
    private String observations;

    @NotNull(message = "La tension systolique est obligatoire.")
    @Positive(message = "La tension systolique doit etre positive.")
    private Integer tensionSystolique;

    @NotNull(message = "La tension diastolique est obligatoire.")
    @Positive(message = "La tension diastolique doit etre positive.")
    private Integer tensionDiastolique;

    @NotNull(message = "La temperature est obligatoire.")
    @Positive(message = "La temperature doit etre positive.")
    private Double temperature;

    @NotNull(message = "La frequence cardiaque est obligatoire.")
    @Positive(message = "La frequence cardiaque doit etre positive.")
    private Integer frequenceCardiaque;

    @NotNull(message = "La saturation SpO2 est obligatoire.")
    @Positive(message = "La saturation SpO2 doit etre positive.")
    private Integer spo2;
}
