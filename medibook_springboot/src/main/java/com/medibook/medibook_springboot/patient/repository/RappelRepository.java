package com.medibook.medibook_springboot.patient.repository;

import com.medibook.medibook_springboot.patient.entity.Rappel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RappelRepository extends JpaRepository<Rappel, Long> {
    List<Rappel> findByCarnetMedicalPatientIdOrderByDateHeureAscIdAsc(Long patientId);
    Optional<Rappel> findByIdAndCarnetMedicalPatientId(Long id, Long patientId);
}
