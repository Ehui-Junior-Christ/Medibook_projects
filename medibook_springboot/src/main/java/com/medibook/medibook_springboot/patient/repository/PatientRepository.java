package com.medibook.medibook_springboot.patient.repository;

import com.medibook.medibook_springboot.patient.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
    Optional<Patient> findByTelephone(String telephone);
    Optional<Patient> findByCmu(String cmu);

    @Query("""
            select p from Patient p
            where lower(coalesce(p.cmu, '')) like lower(concat('%', :term, '%'))
            order by p.nom asc, p.prenom asc
            """)
    List<Patient> searchByTerm(@Param("term") String term);
}
