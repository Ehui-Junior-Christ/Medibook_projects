package com.medibook.medibook_springboot.medecin.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ConsultationDto {
    private Long id;
    private Long patientId;
    private String patientNom;
    private Long medecinId;
    private String medecinNom;
    private LocalDate dateConsultation;
    private LocalTime heureConsultation;
    private String motifPrincipal;
    private String symptomes;
    private String diagnostic;
    private String traitement;
    private String observations;
    private Integer tensionSystolique;
    private Integer tensionDiastolique;
    private Double temperature;
    private Integer frequenceCardiaque;
    private Integer spo2;
}
