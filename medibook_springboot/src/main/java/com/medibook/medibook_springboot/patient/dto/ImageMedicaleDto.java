package com.medibook.medibook_springboot.patient.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ImageMedicaleDto {
    private Long id;
    private String nom;
    private String type;
    private LocalDate dateImage;
    private String source;
    private String format;
    private String taille;
    private String donnees;
    private LocalDateTime createdAt;
}
