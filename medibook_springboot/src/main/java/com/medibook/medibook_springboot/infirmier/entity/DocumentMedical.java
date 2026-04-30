package com.medibook.medibook_springboot.infirmier.entity;

import jakarta.persistence.*;
import lombok.*;
import com.medibook.medibook_springboot.patient.entity.Patient;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentMedical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String cheminFichier;
    private String description;

    // 🔥 AJOUT IMPORTANT
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
}