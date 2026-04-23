package com.medibook.medibook_springboot.medecin.entity;

import com.medibook.medibook_springboot.patient.entity.Patient;
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
@Table(name = "certificats_medicaux")
@Data
@NoArgsConstructor
public class CertificatMedical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "medecin_id", nullable = false)
    private Medecin medecin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultation_id")
    private Consultation consultation;

    @Column(name = "date_certificat", nullable = false)
    private LocalDate dateCertificat;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(length = 150)
    private String destinataire;

    @Column(length = 180)
    private String motif;

    @Column(columnDefinition = "TEXT")
    private String restrictions;

    @Column(name = "debut_arret")
    private LocalDate debutArret;

    @Column(name = "fin_arret")
    private LocalDate finArret;
}
