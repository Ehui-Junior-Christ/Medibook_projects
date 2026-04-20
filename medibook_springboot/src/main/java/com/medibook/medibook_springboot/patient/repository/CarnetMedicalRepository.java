package com.medibook.medibook_springboot.patient.repository;

import com.medibook.medibook_springboot.patient.entity.CarnetMedical;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarnetMedicalRepository extends JpaRepository<CarnetMedical, Long> {
    Optional<CarnetMedical> findByPatientId(Long patientId);
}
