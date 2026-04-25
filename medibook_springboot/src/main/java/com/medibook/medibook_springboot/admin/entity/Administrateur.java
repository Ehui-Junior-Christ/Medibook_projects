package com.medibook.medibook_springboot.admin.entity;

import com.medibook.medibook_springboot.auth.entity.Role;
import com.medibook.medibook_springboot.auth.entity.Utilisateur;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "administrateurs")
@PrimaryKeyJoinColumn(name = "id")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Administrateur extends Utilisateur {

    @Column(name = "numero_matricule", length = 50)
    private String numeroMatricule;

    public Administrateur(String nom, String prenom, String cmu,
                          String email, String motDePasse, String numeroMatricule) {
        this.setNom(nom);
        this.setPrenom(prenom);
        this.setCmu(cmu);
        this.setEmail(email);
        this.setMotDePasse(motDePasse);
        this.setRole(Role.ADMINISTRATEUR);
        this.setActif(true);
        this.numeroMatricule = numeroMatricule;
    }
}