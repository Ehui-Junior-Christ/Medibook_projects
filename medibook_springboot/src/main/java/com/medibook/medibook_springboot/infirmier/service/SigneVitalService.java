package com.medibook.medibook_springboot.infirmier.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.medibook.medibook_springboot.infirmier.entity.*;
import com.medibook.medibook_springboot.infirmier.repository.*;
import com.medibook.medibook_springboot.infirmier.dto.SigneVitalDTO;

@Service
@RequiredArgsConstructor
public class SigneVitalService {

    private final SigneVitalRepository signeRepo;
    private final InfirmierRepository infirmierRepo;

    public SigneVital enregistrer(SigneVitalDTO dto) {

        Infirmier infirmier = infirmierRepo.findById(dto.getInfirmierId())
                .orElseThrow(() -> new RuntimeException("Infirmier non trouvé"));

        SigneVital signe = new SigneVital();
        signe.setTension(dto.getTension());
        signe.setTemperature(dto.getTemperature());
        signe.setPoids(dto.getPoids());
        signe.setImc(dto.getImc());
        signe.setFrequenceCardiaque(dto.getFrequenceCardiaque());
        signe.setSaturationOxygene(dto.getSaturationOxygene());
        signe.setGlycemie(dto.getGlycemie());
        signe.setDateHeure(dto.getDateHeure());
        signe.setInfirmier(infirmier);

        return signeRepo.save(signe);
    }
}