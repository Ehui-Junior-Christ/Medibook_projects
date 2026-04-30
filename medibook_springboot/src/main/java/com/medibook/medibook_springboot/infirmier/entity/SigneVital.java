package com.medibook.medibook_springboot.infirmier.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.medibook.medibook_springboot.patient.entity.Patient;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SigneVital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    @ManyToOne
    @JoinColumn(name = "infirmier_id")
    private Infirmier infirmier;

    // ✅ AJOUT IMPORTANT
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
}