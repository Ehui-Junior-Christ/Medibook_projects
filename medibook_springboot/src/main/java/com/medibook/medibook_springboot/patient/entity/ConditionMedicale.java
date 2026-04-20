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
@Table(name = "conditions_medicales")
@Data
@NoArgsConstructor
public class ConditionMedicale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String libelle;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "date_diagnostic")
    private LocalDate dateDiagnostic;

    @Column(nullable = false)
    private Boolean chronique = false;

    @Column(columnDefinition = "TEXT")
    private String traitement;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carnet_medical_id", nullable = false)
    private CarnetMedical carnetMedical;
}
