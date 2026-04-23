package com.medibook.medibook_springboot.medecin.controller;

import com.medibook.medibook_springboot.medecin.dto.OrdonnanceDto;
import com.medibook.medibook_springboot.medecin.service.OrdonnanceService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/medecins/ordonnances")
@CrossOrigin(origins = "*")
public class OrdonnanceController {

    private final OrdonnanceService ordonnanceService;

    public OrdonnanceController(OrdonnanceService ordonnanceService) {
        this.ordonnanceService = ordonnanceService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrdonnanceDto create(@RequestBody OrdonnanceDto request) {
        return ordonnanceService.create(request);
    }

    @GetMapping
    public List<OrdonnanceDto> findAll() {
        return ordonnanceService.findAll();
    }

    @GetMapping("/{id}")
    public OrdonnanceDto findById(@PathVariable Long id) {
        return ordonnanceService.findById(id);
    }

    @GetMapping("/patient/{patientId}")
    public List<OrdonnanceDto> findByPatient(@PathVariable Long patientId) {
        return ordonnanceService.findByPatient(patientId);
    }

    @GetMapping("/medecin/{medecinId}")
    public List<OrdonnanceDto> findByMedecin(@PathVariable Long medecinId) {
        return ordonnanceService.findByMedecin(medecinId);
    }

    @PutMapping("/{id}")
    public OrdonnanceDto update(@PathVariable Long id, @RequestBody OrdonnanceDto request) {
        return ordonnanceService.update(id, request);
    }
}
