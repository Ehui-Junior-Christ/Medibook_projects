package com.medibook.medibook_springboot.infirmier.repository;

import com.medibook.medibook_springboot.infirmier.entity.Infirmier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InfirmierRepository extends JpaRepository<Infirmier, Long> {
    boolean existsByMatricule(String matricule);
    Optional<Infirmier> findByMatricule(String matricule);
}
