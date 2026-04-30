package com.medibook.medibook_springboot.infirmier.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.medibook.medibook_springboot.infirmier.entity.*;
import com.medibook.medibook_springboot.infirmier.repository.*;
import com.medibook.medibook_springboot.infirmier.dto.SigneVitalDTO;
import com.medibook.medibook_springboot.patient.repository.PatientRepository;
import com.medibook.medibook_springboot.patient.entity.Patient;

@Service
@RequiredArgsConstructor
public class SigneVitalService {

    private final SigneVitalRepository signeRepo;
    private final InfirmierRepository infirmierRepo;
    private final PatientRepository patientRepo; // ✅ AJOUT IMPORTANT

    public SigneVital enregistrer(SigneVitalDTO dto) {

        // ✅ récupération patient
        Patient patient = patientRepo.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));

        // ✅ récupération infirmier
        Infirmier infirmier = infirmierRepo.findById(dto.getInfirmierId())
                .orElseThrow(() -> new RuntimeException("Infirmier non trouvé"));

        SigneVital signe = new SigneVital();

        // ✅ correspond EXACTEMENT à ton frontend
        signe.setTaSystolique(dto.getTaSystolique());
        signe.setTaDiastolique(dto.getTaDiastolique());
        signe.setTemperature(dto.getTemperature());
        signe.setFrequenceCardiaque(dto.getFrequenceCardiaque());
        signe.setPoids(dto.getPoids());
        signe.setTaille(dto.getTaille());
        signe.setSpo2(dto.getSpo2());
        signe.setGlycemie(dto.getGlycemie());
        signe.setFrequenceRespiratoire(dto.getFrequenceRespiratoire());
        signe.setNotes(dto.getNotes());

        // relations
        signe.setPatient(patient);
        signe.setInfirmier(infirmier);

        return signeRepo.save(signe);
    }
}