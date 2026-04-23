package com.medibook.medibook_springboot.medecin.repository;

import com.medibook.medibook_springboot.medecin.entity.Ordonnance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdonnanceRepository extends JpaRepository<Ordonnance, Long> {
    List<Ordonnance> findByPatientIdOrderByDatePrescriptionDesc(Long patientId);
    List<Ordonnance> findByMedecinIdOrderByDatePrescriptionDesc(Long medecinId);
}
