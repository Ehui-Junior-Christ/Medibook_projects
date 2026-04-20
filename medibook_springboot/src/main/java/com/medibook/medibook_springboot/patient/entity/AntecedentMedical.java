package com.medibook.medibook_springboot.patient.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "antecedents_medicaux")
@Data
@NoArgsConstructor
public class AntecedentMedical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String libelle;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(nullable = false)
    private Boolean actif = true;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carnet_medical_id", nullable = false)
    private CarnetMedical carnetMedical;
}
