package com.medibook.medibook_springboot.infirmier.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SigneVitalDTO {

    private Long patientId;
    private Long infirmierId;

    private Double taSystolique;
    private Double taDiastolique;
    private Double temperature;
    private Integer frequenceCardiaque;
    private Double poids;
    private Double taille;
    private Integer spo2;
    private Double glycemie;
    private Integer frequenceRespiratoire;
    private String notes;

    private LocalDateTime dateHeure;
}