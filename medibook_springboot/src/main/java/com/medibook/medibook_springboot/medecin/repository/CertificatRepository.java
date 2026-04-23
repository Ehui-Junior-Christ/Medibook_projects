package com.medibook.medibook_springboot.medecin.repository;

import com.medibook.medibook_springboot.medecin.entity.CertificatMedical;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CertificatRepository extends JpaRepository<CertificatMedical, Long> {
    List<CertificatMedical> findByPatientIdOrderByDateCertificatDesc(Long patientId);
    List<CertificatMedical> findByMedecinIdOrderByDateCertificatDesc(Long medecinId);
}
