package com.medibook.medibook_springboot.infirmier.entity;

import com.medibook.medibook_springboot.auth.entity.Role;
import com.medibook.medibook_springboot.auth.entity.Utilisateur;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "infirmiers")
@PrimaryKeyJoinColumn(name = "id")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Infirmier extends Utilisateur {

    @Column(nullable = false, unique = true, length = 50)
    private String matricule;

    @Column(length = 120)
    private String service;

    @Column(name = "biographie", columnDefinition = "TEXT")
    private String biographie;

    @PrePersist
    public void initialiserRoleInfirmier() {
        if (getRole() == null) {
            setRole(Role.INFIRMIER);
        }
    }
}
