package com.medibook.medibook_springboot.medecin.service;

import com.medibook.medibook_springboot.medecin.dto.CertificatDto;
import com.medibook.medibook_springboot.medecin.entity.CertificatMedical;
import com.medibook.medibook_springboot.medecin.entity.Consultation;
import com.medibook.medibook_springboot.medecin.entity.Medecin;
import com.medibook.medibook_springboot.medecin.repository.CertificatRepository;
import com.medibook.medibook_springboot.medecin.repository.ConsultationRepository;
import com.medibook.medibook_springboot.medecin.repository.MedecinRepository;
import com.medibook.medibook_springboot.patient.entity.Patient;
import com.medibook.medibook_springboot.patient.repository.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class CertificatService {

    private final CertificatRepository certificatRepository;
    private final PatientRepository patientRepository;
    private final MedecinRepository medecinRepository;
    private final ConsultationRepository consultationRepository;

    public CertificatService(
            CertificatRepository certificatRepository,
            PatientRepository patientRepository,
            MedecinRepository medecinRepository,
            ConsultationRepository consultationRepository
    ) {
        this.certificatRepository = certificatRepository;
        this.patientRepository = patientRepository;
        this.medecinRepository = medecinRepository;
        this.consultationRepository = consultationRepository;
    }

    @Transactional
    public CertificatDto create(CertificatDto request) {
        validateRequest(request);
        CertificatMedical certificat = new CertificatMedical();
        applyRequest(certificat, request);
        return map(certificatRepository.save(certificat));
    }

    @Transactional(readOnly = true)
    public List<CertificatDto> findAll() {
        return certificatRepository.findAll().stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public List<CertificatDto> findByPatient(Long patientId) {
        return certificatRepository.findByPatientIdOrderByDateCertificatDesc(patientId)
                .stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public List<CertificatDto> findByMedecin(Long medecinId) {
        return certificatRepository.findByMedecinIdOrderByDateCertificatDesc(medecinId)
                .stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public CertificatDto findById(Long id) {
        return map(getCertificatOrThrow(id));
    }

    @Transactional
    public CertificatDto update(Long id, CertificatDto request) {
        validateRequest(request);
        CertificatMedical certificat = getCertificatOrThrow(id);
        applyRequest(certificat, request);
        return map(certificatRepository.save(certificat));
    }

    private void validateRequest(CertificatDto request) {
        if (request == null) {
            throw new IllegalArgumentException("Requete certificat invalide.");
        }

        if ("arret".equalsIgnoreCase(request.getType())) {
            if (request.getDebutArret() == null || request.getFinArret() == null) {
                throw new IllegalArgumentException("Les dates de debut et de fin d'arret sont obligatoires.");
            }
            if (request.getFinArret().isBefore(request.getDebutArret())) {
                throw new IllegalArgumentException("La date de fin d'arret doit etre posterieure ou egale a la date de debut.");
            }
        }
    }

    private void applyRequest(CertificatMedical certificat, CertificatDto request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient introuvable."));
        Medecin medecin = medecinRepository.findById(request.getMedecinId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medecin introuvable."));

        certificat.setPatient(patient);
        certificat.setMedecin(medecin);
        certificat.setDateCertificat(request.getDateCertificat() != null ? request.getDateCertificat() : LocalDate.now());
        certificat.setType(request.getType());
        certificat.setDestinataire(request.getDestinataire());
        certificat.setMotif(request.getMotif());
        certificat.setRestrictions(request.getRestrictions());
        certificat.setDebutArret(request.getDebutArret());
        certificat.setFinArret(request.getFinArret());

        Consultation consultation = null;
        if (request.getConsultationId() != null) {
            consultation = consultationRepository.findById(request.getConsultationId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation introuvable."));
        }
        certificat.setConsultation(consultation);
    }

    private CertificatMedical getCertificatOrThrow(Long id) {
        return certificatRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Certificat introuvable."));
    }

    private CertificatDto map(CertificatMedical certificat) {
        CertificatDto dto = new CertificatDto();
        dto.setId(certificat.getId());
        dto.setPatientId(certificat.getPatient().getId());
        dto.setPatientNom(certificat.getPatient().getNomComplet());
        dto.setMedecinId(certificat.getMedecin().getId());
        dto.setMedecinNom(certificat.getMedecin().getNomComplet());
        dto.setConsultationId(certificat.getConsultation() != null ? certificat.getConsultation().getId() : null);
        dto.setDateCertificat(certificat.getDateCertificat());
        dto.setType(certificat.getType());
        dto.setDestinataire(certificat.getDestinataire());
        dto.setMotif(certificat.getMotif());
        dto.setRestrictions(certificat.getRestrictions());
        dto.setDebutArret(certificat.getDebutArret());
        dto.setFinArret(certificat.getFinArret());
        return dto;
    }
}
