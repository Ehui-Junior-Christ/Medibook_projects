package com.medibook.medibook_springboot.auth.repository;


import com.medibook.medibook_springboot.auth.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    // 🔐 Login avec CMU OU téléphone
    Optional<Utilisateur> findByCmuOrTelephone(String cmu, String telephone);

    // 🔍 Vérification pour inscription
    boolean existsByCmu(String cmu);
    boolean existsByTelephone(String telephone);
    boolean existsByEmail(String email);
}
