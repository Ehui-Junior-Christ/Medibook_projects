package com.medibook.medibook_springboot.medecin.entity;

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

@Entity
@Table(name = "medicaments")
@Data
@NoArgsConstructor
public class Medicament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ordonnance_id", nullable = false)
    private Ordonnance ordonnance;

    @Column(nullable = false, length = 150)
    private String nom;

    @Column(length = 80)
    private String dosage;

    @Column(length = 50)
    private String voie;

    @Column(name = "prises_par_jour")
    private Integer prisesParJour;

    @Column(length = 120)
    private String moments;

    @Column(name = "duree_jours")
    private Integer dureeJours;

    @Column(columnDefinition = "TEXT")
    private String instructions;
}
