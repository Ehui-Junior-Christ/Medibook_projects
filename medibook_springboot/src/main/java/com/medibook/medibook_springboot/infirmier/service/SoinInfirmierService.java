package com.medibook.medibook_springboot.infirmier.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.medibook.medibook_springboot.infirmier.entity.*;
import com.medibook.medibook_springboot.infirmier.repository.*;
import com.medibook.medibook_springboot.infirmier.dto.SoinInfirmierDTO;

@Service
@RequiredArgsConstructor
public class SoinInfirmierService {

    private final SoinInfirmierRepository soinRepo;
    private final InfirmierRepository infirmierRepo;

    public SoinInfirmier enregistrer(SoinInfirmierDTO dto) {

        Infirmier infirmier = infirmierRepo.findById(dto.getInfirmierId())
                .orElseThrow(() -> new RuntimeException("Infirmier non trouvé"));

        SoinInfirmier soin = new SoinInfirmier();
        soin.setTypeSoin(dto.getTypeSoin());
        soin.setDescription(dto.getDescription());
        soin.setDateHeure(dto.getDateHeure());
        soin.setInfirmier(infirmier);

        return soinRepo.save(soin);
    }
}