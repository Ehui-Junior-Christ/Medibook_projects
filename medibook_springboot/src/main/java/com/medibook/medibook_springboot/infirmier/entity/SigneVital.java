package com.medibook.medibook_springboot.infirmier.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SigneVital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tension;
    private Double temperature;
    private Double poids;
    private Double imc;
    private Integer frequenceCardiaque;
    private Double saturationOxygene;
    private Double glycemie;

    private LocalDateTime dateHeure;

    @ManyToOne
    @JoinColumn(name = "infirmier_id")
    private Infirmier infirmier;
}