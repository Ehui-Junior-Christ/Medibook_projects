package com.medibook.medibook_springboot.infirmier.service;

import com.medibook.medibook_springboot.auth.entity.Role;
import com.medibook.medibook_springboot.infirmier.dto.InfirmierRequestDTO;
import com.medibook.medibook_springboot.infirmier.dto.InfirmierResponseDTO;
import com.medibook.medibook_springboot.infirmier.entity.Infirmier;
import com.medibook.medibook_springboot.infirmier.repository.InfirmierRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class InfirmierService {

    private final InfirmierRepository infirmierRepository;

    public InfirmierService(InfirmierRepository infirmierRepository) {
        this.infirmierRepository = infirmierRepository;
    }

    @Transactional
    public InfirmierResponseDTO create(InfirmierRequestDTO request) {
        validateMatricule(request, null);
        Infirmier infirmier = new Infirmier();
        applyRequest(infirmier, request);
        infirmier.setRole(Role.INFIRMIER);
        infirmier.setActif(true);
        return map(infirmierRepository.save(infirmier));
    }

    @Transactional(readOnly = true)
    public List<InfirmierResponseDTO> findAll() {
        return infirmierRepository.findAll().stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public InfirmierResponseDTO findById(Long id) {
        return map(getInfirmierOrThrow(id));
    }

    @Transactional
    public InfirmierResponseDTO update(Long id, InfirmierRequestDTO request) {
        Infirmier infirmier = getInfirmierOrThrow(id);
        validateMatricule(request, id);
        applyRequest(infirmier, request);
        return map(infirmierRepository.save(infirmier));
    }

    @Transactional
    public void delete(Long id) {
        infirmierRepository.delete(getInfirmierOrThrow(id));
    }

    private Infirmier getInfirmierOrThrow(Long id) {
        return infirmierRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Infirmier introuvable."));
    }

    private void applyRequest(Infirmier infirmier, InfirmierRequestDTO request) {
        infirmier.setNom(request.getNom());
        infirmier.setPrenom(request.getPrenom());
        infirmier.setEmail(request.getEmail());
        infirmier.setTelephone(request.getTelephone());
        infirmier.setCmu(request.getCmu());
        infirmier.setPhotoProfil(request.getPhotoProfil());
        infirmier.setMatricule(request.getMatricule());
        infirmier.setService(request.getService());
        infirmier.setBiographie(request.getBiographie());
        if (request.getMotDePasse() != null && !request.getMotDePasse().isBlank()) {
            infirmier.setMotDePasse(request.getMotDePasse());
        }
    }

    private void validateMatricule(InfirmierRequestDTO request, Long currentId) {
        if (request.getMatricule() == null || request.getMatricule().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le matricule infirmier est obligatoire.");
        }

        infirmierRepository.findAll().stream()
                .filter(existing -> currentId == null || !existing.getId().equals(currentId))
                .filter(existing -> existing.getMatricule().equalsIgnoreCase(request.getMatricule()))
                .findFirst()
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Un infirmier existe deja avec ce matricule.");
                });
    }

    private InfirmierResponseDTO map(Infirmier infirmier) {
        InfirmierResponseDTO dto = new InfirmierResponseDTO();
        dto.setId(infirmier.getId());
        dto.setNom(infirmier.getNom());
        dto.setPrenom(infirmier.getPrenom());
        dto.setNomComplet(infirmier.getNomComplet());
        dto.setEmail(infirmier.getEmail());
        dto.setTelephone(infirmier.getTelephone());
        dto.setCmu(infirmier.getCmu());
        dto.setPhotoProfil(infirmier.getPhotoProfil());
        dto.setActif(infirmier.getActif());
        dto.setMatricule(infirmier.getMatricule());
        dto.setService(infirmier.getService());
        dto.setBiographie(infirmier.getBiographie());
        return dto;
    }
}
