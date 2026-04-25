package com.medibook.medibook_springboot.admin.repository;

import com.medibook.medibook_springboot.admin.entity.Administrateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Administrateur, Long> {

    Optional<Administrateur> findByEmail(String email);

    boolean existsByNumeroMatricule(String numeroMatricule);
}