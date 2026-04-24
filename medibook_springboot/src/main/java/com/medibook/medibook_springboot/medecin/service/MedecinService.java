package com.medibook.medibook_springboot.medecin.service;

import com.medibook.medibook_springboot.auth.entity.Role;
import com.medibook.medibook_springboot.medecin.dto.MedecinRequestDto;
import com.medibook.medibook_springboot.medecin.dto.MedecinResponseDto;
import com.medibook.medibook_springboot.medecin.entity.Medecin;
import com.medibook.medibook_springboot.medecin.repository.MedecinRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MedecinService {

    private final MedecinRepository medecinRepository;

    public MedecinService(MedecinRepository medecinRepository) {
        this.medecinRepository = medecinRepository;
    }

    @Transactional
    public MedecinResponseDto create(MedecinRequestDto request) {
        validateMatricule(request, null);
        Medecin medecin = new Medecin();
        applyRequest(medecin, request);
        medecin.setRole(Role.MEDECIN);
        medecin.setActif(true);
        return map(medecinRepository.save(medecin));
    }

    @Transactional(readOnly = true)
    public List<MedecinResponseDto> findAll() {
        return medecinRepository.findAll().stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public MedecinResponseDto findById(Long id) {
        return map(getMedecinOrThrow(id));
    }

    @Transactional
    public MedecinResponseDto update(Long id, MedecinRequestDto request) {
        Medecin medecin = getMedecinOrThrow(id);
        validateMatricule(request, id);
        applyRequest(medecin, request);
        return map(medecinRepository.save(medecin));
    }

    @Transactional
    public void delete(Long id) {
        medecinRepository.delete(getMedecinOrThrow(id));
    }

    private Medecin getMedecinOrThrow(Long id) {
        return medecinRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medecin introuvable."));
    }

    private void applyRequest(Medecin medecin, MedecinRequestDto request) {
        medecin.setNom(request.getNom());
        medecin.setPrenom(request.getPrenom());
        medecin.setEmail(request.getEmail());
        medecin.setTelephone(request.getTelephone());
        medecin.setCmu(request.getCmu());
        medecin.setPhotoProfil(request.getPhotoProfil());
        medecin.setMatricule(request.getMatricule());
        medecin.setSpecialiteMedicale(request.getSpecialiteMedicale());
        medecin.setBiographie(request.getBiographie());
        if (request.getMotDePasse() != null && !request.getMotDePasse().isBlank()) {
            medecin.setMotDePasse(request.getMotDePasse());
        }
    }

    private void validateMatricule(MedecinRequestDto request, Long currentId) {
        if (request.getMatricule() == null || request.getMatricule().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le matricule medecin est obligatoire.");
        }

        medecinRepository.findAll().stream()
                .filter(existing -> currentId == null || !existing.getId().equals(currentId))
                .filter(existing -> existing.getMatricule().equalsIgnoreCase(request.getMatricule()))
                .findFirst()
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Un medecin existe deja avec ce matricule.");
                });
    }

    private MedecinResponseDto map(Medecin medecin) {
        MedecinResponseDto dto = new MedecinResponseDto();
        dto.setId(medecin.getId());
        dto.setNom(medecin.getNom());
        dto.setPrenom(medecin.getPrenom());
        dto.setNomComplet(medecin.getNomComplet());
        dto.setEmail(medecin.getEmail());
        dto.setTelephone(medecin.getTelephone());
        dto.setCmu(medecin.getCmu());
        dto.setPhotoProfil(medecin.getPhotoProfil());
        dto.setActif(medecin.getActif());
        dto.setMatricule(medecin.getMatricule());
        dto.setSpecialiteMedicale(medecin.getSpecialiteMedicale());
        dto.setBiographie(medecin.getBiographie());
        return dto;
    }
}
