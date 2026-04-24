package com.medibook.medibook_springboot.medecin.service;

import com.medibook.medibook_springboot.medecin.dto.ConsultationDto;
import com.medibook.medibook_springboot.medecin.entity.Consultation;
import com.medibook.medibook_springboot.medecin.entity.Medecin;
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
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final PatientRepository patientRepository;
    private final MedecinRepository medecinRepository;

    public ConsultationService(
            ConsultationRepository consultationRepository,
            PatientRepository patientRepository,
            MedecinRepository medecinRepository
    ) {
        this.consultationRepository = consultationRepository;
        this.patientRepository = patientRepository;
        this.medecinRepository = medecinRepository;
    }

    @Transactional
    public ConsultationDto create(ConsultationDto request) {
        Consultation consultation = new Consultation();
        applyRequest(consultation, request);
        return map(consultationRepository.save(consultation));
    }

    @Transactional(readOnly = true)
    public List<ConsultationDto> findAll() {
        return consultationRepository.findAll().stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public ConsultationDto findById(Long id) {
        return map(getConsultationOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<ConsultationDto> findByPatient(Long patientId) {
        return consultationRepository.findByPatientIdOrderByDateConsultationDescHeureConsultationDesc(patientId)
                .stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public List<ConsultationDto> findByMedecin(Long medecinId) {
        return consultationRepository.findByMedecinIdOrderByDateConsultationDescHeureConsultationDesc(medecinId)
                .stream().map(this::map).toList();
    }

    @Transactional
    public ConsultationDto update(Long id, ConsultationDto request) {
        Consultation consultation = getConsultationOrThrow(id);
        applyRequest(consultation, request);
        return map(consultationRepository.save(consultation));
    }

    private void applyRequest(Consultation consultation, ConsultationDto request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient introuvable."));
        Medecin medecin = medecinRepository.findById(request.getMedecinId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medecin introuvable."));

        consultation.setPatient(patient);
        consultation.setMedecin(medecin);
        consultation.setDateConsultation(request.getDateConsultation() != null ? request.getDateConsultation() : LocalDate.now());
        consultation.setHeureConsultation(request.getHeureConsultation());
        consultation.setMotifPrincipal(request.getMotifPrincipal());
        consultation.setSymptomes(request.getSymptomes());
        consultation.setDiagnostic(request.getDiagnostic());
        consultation.setTraitement(request.getTraitement());
        consultation.setObservations(request.getObservations());
        consultation.setTensionSystolique(request.getTensionSystolique());
        consultation.setTensionDiastolique(request.getTensionDiastolique());
        consultation.setTemperature(request.getTemperature());
        consultation.setFrequenceCardiaque(request.getFrequenceCardiaque());
        consultation.setSpo2(request.getSpo2());
    }

    private Consultation getConsultationOrThrow(Long id) {
        return consultationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation introuvable."));
    }

    private ConsultationDto map(Consultation consultation) {
        ConsultationDto dto = new ConsultationDto();
        dto.setId(consultation.getId());
        dto.setPatientId(consultation.getPatient().getId());
        dto.setPatientNom(consultation.getPatient().getNomComplet());
        dto.setMedecinId(consultation.getMedecin().getId());
        dto.setMedecinNom(consultation.getMedecin().getNomComplet());
        dto.setDateConsultation(consultation.getDateConsultation());
        dto.setHeureConsultation(consultation.getHeureConsultation());
        dto.setMotifPrincipal(consultation.getMotifPrincipal());
        dto.setSymptomes(consultation.getSymptomes());
        dto.setDiagnostic(consultation.getDiagnostic());
        dto.setTraitement(consultation.getTraitement());
        dto.setObservations(consultation.getObservations());
        dto.setTensionSystolique(consultation.getTensionSystolique());
        dto.setTensionDiastolique(consultation.getTensionDiastolique());
        dto.setTemperature(consultation.getTemperature());
        dto.setFrequenceCardiaque(consultation.getFrequenceCardiaque());
        dto.setSpo2(consultation.getSpo2());
        return dto;
    }
}
