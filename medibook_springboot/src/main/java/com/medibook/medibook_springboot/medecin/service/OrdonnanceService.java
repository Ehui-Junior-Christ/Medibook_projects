package com.medibook.medibook_springboot.medecin.service;

import com.medibook.medibook_springboot.medecin.dto.MedicamentDto;
import com.medibook.medibook_springboot.medecin.dto.OrdonnanceDto;
import com.medibook.medibook_springboot.medecin.entity.Consultation;
import com.medibook.medibook_springboot.medecin.entity.Medecin;
import com.medibook.medibook_springboot.medecin.entity.Medicament;
import com.medibook.medibook_springboot.medecin.entity.Ordonnance;
import com.medibook.medibook_springboot.medecin.repository.ConsultationRepository;
import com.medibook.medibook_springboot.medecin.repository.MedecinRepository;
import com.medibook.medibook_springboot.medecin.repository.OrdonnanceRepository;
import com.medibook.medibook_springboot.patient.entity.Patient;
import com.medibook.medibook_springboot.patient.repository.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class OrdonnanceService {

    private final OrdonnanceRepository ordonnanceRepository;
    private final PatientRepository patientRepository;
    private final MedecinRepository medecinRepository;
    private final ConsultationRepository consultationRepository;

    public OrdonnanceService(
            OrdonnanceRepository ordonnanceRepository,
            PatientRepository patientRepository,
            MedecinRepository medecinRepository,
            ConsultationRepository consultationRepository
    ) {
        this.ordonnanceRepository = ordonnanceRepository;
        this.patientRepository = patientRepository;
        this.medecinRepository = medecinRepository;
        this.consultationRepository = consultationRepository;
    }

    @Transactional
    public OrdonnanceDto create(OrdonnanceDto request) {
        Ordonnance ordonnance = new Ordonnance();
        applyRequest(ordonnance, request);
        return map(ordonnanceRepository.save(ordonnance));
    }

    @Transactional(readOnly = true)
    public List<OrdonnanceDto> findAll() {
        return ordonnanceRepository.findAll().stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public List<OrdonnanceDto> findByPatient(Long patientId) {
        return ordonnanceRepository.findByPatientIdOrderByDatePrescriptionDesc(patientId)
                .stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public List<OrdonnanceDto> findByMedecin(Long medecinId) {
        return ordonnanceRepository.findByMedecinIdOrderByDatePrescriptionDesc(medecinId)
                .stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public OrdonnanceDto findById(Long id) {
        return map(getOrdonnanceOrThrow(id));
    }

    @Transactional
    public OrdonnanceDto update(Long id, OrdonnanceDto request) {
        Ordonnance ordonnance = getOrdonnanceOrThrow(id);
        applyRequest(ordonnance, request);
        return map(ordonnanceRepository.save(ordonnance));
    }

    private void applyRequest(Ordonnance ordonnance, OrdonnanceDto request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient introuvable."));
        Medecin medecin = medecinRepository.findById(request.getMedecinId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medecin introuvable."));

        ordonnance.setPatient(patient);
        ordonnance.setMedecin(medecin);
        ordonnance.setDatePrescription(request.getDatePrescription() != null ? request.getDatePrescription() : LocalDate.now());
        ordonnance.setStatut(request.getStatut() != null ? request.getStatut() : "active");
        ordonnance.setRenouvellement(request.getRenouvellement());
        ordonnance.setValiditeJours(request.getValiditeJours());
        ordonnance.setRecommandations(request.getRecommandations());

        Consultation consultation = null;
        if (request.getConsultationId() != null) {
            consultation = consultationRepository.findById(request.getConsultationId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation introuvable."));
        }
        ordonnance.setConsultation(consultation);

        ordonnance.getMedicaments().clear();
        for (MedicamentDto medicamentDto : request.getMedicaments()) {
            Medicament medicament = mapMedicamentEntity(medicamentDto, ordonnance);
            ordonnance.getMedicaments().add(medicament);
        }
    }

    private Ordonnance getOrdonnanceOrThrow(Long id) {
        return ordonnanceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ordonnance introuvable."));
    }

    private Medicament mapMedicamentEntity(MedicamentDto dto, Ordonnance ordonnance) {
        Medicament medicament = new Medicament();
        medicament.setOrdonnance(ordonnance);
        medicament.setNom(dto.getNom());
        medicament.setDosage(dto.getDosage());
        medicament.setVoie(dto.getVoie());
        medicament.setPrisesParJour(dto.getPrisesParJour());
        medicament.setMoments(dto.getMoments());
        medicament.setDureeJours(dto.getDureeJours());
        medicament.setInstructions(dto.getInstructions());
        return medicament;
    }

    private OrdonnanceDto map(Ordonnance ordonnance) {
        OrdonnanceDto dto = new OrdonnanceDto();
        dto.setId(ordonnance.getId());
        dto.setPatientId(ordonnance.getPatient().getId());
        dto.setPatientNom(ordonnance.getPatient().getNomComplet());
        dto.setMedecinId(ordonnance.getMedecin().getId());
        dto.setMedecinNom(ordonnance.getMedecin().getNomComplet());
        dto.setConsultationId(ordonnance.getConsultation() != null ? ordonnance.getConsultation().getId() : null);
        dto.setDatePrescription(ordonnance.getDatePrescription());
        dto.setStatut(ordonnance.getStatut());
        dto.setRenouvellement(ordonnance.getRenouvellement());
        dto.setValiditeJours(ordonnance.getValiditeJours());
        dto.setRecommandations(ordonnance.getRecommandations());
        dto.setMedicaments(ordonnance.getMedicaments().stream().map(this::mapMedicamentDto).toList());
        return dto;
    }

    private MedicamentDto mapMedicamentDto(Medicament medicament) {
        MedicamentDto dto = new MedicamentDto();
        dto.setId(medicament.getId());
        dto.setNom(medicament.getNom());
        dto.setDosage(medicament.getDosage());
        dto.setVoie(medicament.getVoie());
        dto.setPrisesParJour(medicament.getPrisesParJour());
        dto.setMoments(medicament.getMoments());
        dto.setDureeJours(medicament.getDureeJours());
        dto.setInstructions(medicament.getInstructions());
        return dto;
    }
}
