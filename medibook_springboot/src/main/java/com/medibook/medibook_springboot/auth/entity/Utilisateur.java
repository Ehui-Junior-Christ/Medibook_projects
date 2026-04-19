package com.medibook.medibook_springboot.auth.entity;
import com.medibook.medibook_springboot.auth.entity.Role;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "utilisateurs")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
public  class Utilisateur {

    // ======================
    // ID
    // ======================
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ======================
    // Informations
    // ======================
    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 100)
    private String prenom;

    @Column(nullable = false, length = 100, unique = true)
    private String cmu;

    @Column(length = 20, unique = true)
    private String telephone;

    @Column(nullable = false, length = 150, unique = true)
    private String email;

    // ======================
    // Authentification
    // ======================
    @Column(name = "mot_de_passe", nullable = false)
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(nullable = false)
    private Boolean actif = true;

    // ======================
    // Autres
    // ======================
    @Column(name = "photo_profil")
    private String photoProfil;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ======================
    // JPA Lifecycle
    // ======================
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ======================
    // Méthodes utiles
    // ======================
    public String getNomComplet() {
        return prenom + " " + nom;
    }

    // ======================
    // Enum Role
    // ======================

}