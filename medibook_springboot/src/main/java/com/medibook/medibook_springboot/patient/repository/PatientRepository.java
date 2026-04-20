package com.medibook.medibook_springboot.patient.repository;

import com.medibook.medibook_springboot.patient.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
    Optional<Patient> findByTelephone(String telephone);
    Optional<Patient> findByCmu(String cmu);
}
