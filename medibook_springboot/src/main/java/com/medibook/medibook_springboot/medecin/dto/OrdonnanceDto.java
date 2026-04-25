package com.medibook.medibook_springboot.medecin.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class OrdonnanceDto {
    private Long id;
    private Long patientId;
    private String patientNom;
    private Long medecinId;
    private String medecinNom;
    private Long consultationId;
    private LocalDate datePrescription;
    private String statut;
    private String renouvellement;
    private Integer validiteJours;
    private String recommandations;
    private List<MedicamentDto> medicaments = new ArrayList<>();
}
