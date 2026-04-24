package com.medibook.medibook_springboot.medecin.repository;

import com.medibook.medibook_springboot.medecin.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByPatientIdOrderByDateConsultationDescHeureConsultationDesc(Long patientId);
    List<Consultation> findByMedecinIdOrderByDateConsultationDescHeureConsultationDesc(Long medecinId);
}
