package com.medibook.medibook_springboot.medecin.dto;

import lombok.Data;

@Data
public class MedicamentDto {
    private Long id;
    private String nom;
    private String dosage;
    private String voie;
    private Integer prisesParJour;
    private String moments;
    private Integer dureeJours;
    private String instructions;
}
