package com.medibook.medibook_springboot.patient.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.medibook.medibook_springboot.auth.entity.Role;
import com.medibook.medibook_springboot.auth.entity.Utilisateur;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "patients")
@PrimaryKeyJoinColumn(name = "id")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Patient extends Utilisateur {

    @Column(name = "date_naissance")
    private LocalDate dateNaissance;

    @Column(length = 20)
    private String sexe;

    @Column(length = 255)
    private String adresse;

    @Column(length = 120)
    private String profession;

    @Column(name = "situation_familiale", length = 100)
    private String situationFamiliale;

    @Column(name = "numero_urgence", length = 30)
    private String numeroUrgence;

    @Column(name = "personne_urgence", length = 150)
    private String personneUrgence;

    @Column(name = "lien_urgence", length = 80)
    private String lienUrgence;

    @Column(length = 120)
    private String assurance;

    @Column(name = "poids_kg")
    private Double poids;

    @Column(name = "taille_cm")
    private Double taille;

    @Column(name = "groupe_sanguin", length = 10)
    private String groupeSanguin;

    @Column(length = 150)
    private String handicap;

    @Column(name = "notes_patient", columnDefinition = "TEXT")
    private String notesPatient;

    @Column(name = "medecin_traitant", length = 150)
    private String medecinTraitant;

    @Column(name = "specialite_medecin", length = 120)
    private String specialiteMedecin;

    @Column(name = "telephone_medecin", length = 30)
    private String telephoneMedecin;

    @JsonIgnore
    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private CarnetMedical carnetMedical;

    @PrePersist
    public void initialiserRolePatient() {
        if (getRole() == null) {
            setRole(Role.PATIENT);
        }
    }
}
