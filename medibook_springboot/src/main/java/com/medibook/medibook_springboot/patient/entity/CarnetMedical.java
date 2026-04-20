package com.medibook.medibook_springboot.patient.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carnets_medicaux")
@Data
@NoArgsConstructor
public class CarnetMedical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private Patient patient;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "maladies_chroniques", columnDefinition = "TEXT")
    private String maladiesChroniques;

    @Column(name = "traitements_en_cours", columnDefinition = "TEXT")
    private String traitementsEnCours;

    @OneToMany(mappedBy = "carnetMedical", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AntecedentMedical> antecedents = new ArrayList<>();

    @OneToMany(mappedBy = "carnetMedical", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ConditionMedicale> conditions = new ArrayList<>();

    @OneToMany(mappedBy = "carnetMedical", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rappel> rappels = new ArrayList<>();
}
