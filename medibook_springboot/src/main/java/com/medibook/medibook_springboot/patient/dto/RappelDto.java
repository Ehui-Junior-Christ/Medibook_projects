package com.medibook.medibook_springboot.patient.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RappelDto {
    private Long id;
    private String type;
    private String titre;
    private String description;
    private LocalDateTime dateHeure;
    private String urgence;
    private Boolean fait;
}
