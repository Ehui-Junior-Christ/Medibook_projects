package com.medibook.medibook_springboot.patient.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "images_medicales")
@Data
@NoArgsConstructor
public class ImageMedicale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nom;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(name = "date_image")
    private LocalDate dateImage;

    @Column(length = 200)
    private String source;

    @Column(length = 20)
    private String format;

    @Column(length = 50)
    private String taille;

    @Lob
    @Column(name = "donnees", columnDefinition = "LONGTEXT")
    private String donnees;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @PrePersist
    public void onCreation() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
