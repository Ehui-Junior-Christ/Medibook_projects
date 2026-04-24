package com.medibook.medibook_springboot.medecin.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CertificatDto {
    private Long id;
    private Long patientId;
    private String patientNom;
    private Long medecinId;
    private String medecinNom;
    private Long consultationId;
    private LocalDate dateCertificat;
    private String type;
    private String destinataire;
    private String motif;
    private String restrictions;
    private LocalDate debutArret;
    private LocalDate finArret;
}
