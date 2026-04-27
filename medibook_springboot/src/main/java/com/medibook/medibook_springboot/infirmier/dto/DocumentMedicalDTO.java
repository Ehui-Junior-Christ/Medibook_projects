package com.medibook.medibook_springboot.infirmier.dto;

import lombok.Data;

@Data
public class DocumentMedicalDTO {
    private String type;
    private String cheminFichier;
    private String description;
}