package com.medibook.medibook_springboot.patient.repository;

import com.medibook.medibook_springboot.patient.entity.ImageMedicale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImageMedicaleRepository extends JpaRepository<ImageMedicale, Long> {
    List<ImageMedicale> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<ImageMedicale> findByPatientIdAndTypeOrderByCreatedAtDesc(Long patientId, String type);
    Optional<ImageMedicale> findByIdAndPatientId(Long id, Long patientId);
}
