package com.medibook.medibook_springboot.patient.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ConditionMedicaleDto {
    private Long id;
    private String libelle;
    private String details;
    private LocalDate dateDiagnostic;
    private Boolean chronique;
    private String traitement;
}
