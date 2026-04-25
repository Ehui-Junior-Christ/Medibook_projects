package com.medibook.medibook_springboot.medecin.repository;

import com.medibook.medibook_springboot.medecin.entity.Medecin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MedecinRepository extends JpaRepository<Medecin, Long> {
    boolean existsByMatricule(String matricule);
    boolean existsByEmail(String email);
    boolean existsByTelephone(String telephone);
    boolean existsByCmu(String cmu);
    Optional<Medecin> findByMatricule(String matricule);
}
