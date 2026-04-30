package com.medibook.medibook_springboot.infirmier.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.medibook.medibook_springboot.infirmier.entity.*;
import com.medibook.medibook_springboot.infirmier.repository.*;
import com.medibook.medibook_springboot.infirmier.dto.SoinInfirmierDTO;
import com.medibook.medibook_springboot.patient.entity.Patient;// ✅ IMPORTANT IMPORT
import com.medibook.medibook_springboot.patient.repository.PatientRepository;

@Service
@RequiredArgsConstructor
public class SoinInfirmierService {

    private final SoinInfirmierRepository soinRepo;
    private final PatientRepository patientRepo;       // ✅
    private final InfirmierRepository infirmierRepo;   // ✅

    public SoinInfirmier enregistrer(SoinInfirmierDTO dto) {

        SoinInfirmier soin = new SoinInfirmier();

        soin.setTypeSoin(dto.getTypeSoin());
        soin.setDescription(dto.getDescription());
        soin.setDateHeure(dto.getDateHeure());

        // 🔥 récupération en base
        Patient patient = patientRepo.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient introuvable"));

        Infirmier infirmier = infirmierRepo.findById(dto.getInfirmierId())
                .orElseThrow(() -> new RuntimeException("Infirmier introuvable"));

        soin.setPatient(patient);
        soin.setInfirmier(infirmier);

        return soinRepo.save(soin);
    }
}