package com.medibook.medibook_springboot.infirmier.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SigneVitalDTO {
    private String tension;
    private Double temperature;
    private Double poids;
    private Double imc;
    private Integer frequenceCardiaque;
    private Double saturationOxygene;
    private Double glycemie;
    private LocalDateTime dateHeure;
    private Long infirmierId;
}