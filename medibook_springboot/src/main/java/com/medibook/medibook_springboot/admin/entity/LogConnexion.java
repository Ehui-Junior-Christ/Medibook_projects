package com.medibook.medibook_springboot.admin.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "logs_connexion")
@Data
@NoArgsConstructor
public class LogConnexion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "utilisateur_id")
    private Long utilisateurId;

    @Column(name = "email_utilisateur", length = 150)
    private String emailUtilisateur;

    @Column(length = 20)
    private String role;

    @Column(name = "date_connexion")
    private LocalDateTime dateConnexion = LocalDateTime.now();

    @Column(name = "adresse_ip", length = 50)
    private String adresseIp;

    @Column(nullable = false)
    private Boolean succes = true;

    @Column(name = "message_erreur", length = 255)
    private String messageErreur;

    public LogConnexion(Long utilisateurId, String emailUtilisateur,
                        String role, Boolean succes, String adresseIp) {
        this.utilisateurId = utilisateurId;
        this.emailUtilisateur = emailUtilisateur;
        this.role = role;
        this.succes = succes;
        this.adresseIp = adresseIp;
        this.dateConnexion = LocalDateTime.now();
    }
}