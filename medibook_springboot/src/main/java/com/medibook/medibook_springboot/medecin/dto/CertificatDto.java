package com.medibook.medibook_springboot.medecin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CertificatDto {
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

    @NotNull(message = "La date du certificat est obligatoire.")
    private LocalDate dateCertificat;

    @NotBlank(message = "Le type de certificat est obligatoire.")
    private String type;

    @NotBlank(message = "Le destinataire est obligatoire.")
    private String destinataire;

    @NotBlank(message = "Le motif medical est obligatoire.")
    private String motif;

    @NotBlank(message = "Les restrictions sont obligatoires.")
    private String restrictions;
    private LocalDate debutArret;
    private LocalDate finArret;
}
