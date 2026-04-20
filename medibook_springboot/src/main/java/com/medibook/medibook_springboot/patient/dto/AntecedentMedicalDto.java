package com.medibook.medibook_springboot.patient.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AntecedentMedicalDto {
    private Long id;
    private String libelle;
    private String details;
    private LocalDate dateDebut;
    private Boolean actif;
}
