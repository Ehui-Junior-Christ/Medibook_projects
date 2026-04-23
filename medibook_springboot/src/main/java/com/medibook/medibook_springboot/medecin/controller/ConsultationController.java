package com.medibook.medibook_springboot.medecin.controller;

import com.medibook.medibook_springboot.medecin.dto.ConsultationDto;
import com.medibook.medibook_springboot.medecin.service.ConsultationService;
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
@RequestMapping("/api/medecins/consultations")
@CrossOrigin(origins = "*")
public class ConsultationController {

    private final ConsultationService consultationService;

    public ConsultationController(ConsultationService consultationService) {
        this.consultationService = consultationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConsultationDto create(@RequestBody ConsultationDto request) {
        return consultationService.create(request);
    }

    @GetMapping
    public List<ConsultationDto> findAll() {
        return consultationService.findAll();
    }

    @GetMapping("/{id}")
    public ConsultationDto findById(@PathVariable Long id) {
        return consultationService.findById(id);
    }

    @GetMapping("/patient/{patientId}")
    public List<ConsultationDto> findByPatient(@PathVariable Long patientId) {
        return consultationService.findByPatient(patientId);
    }

    @GetMapping("/medecin/{medecinId}")
    public List<ConsultationDto> findByMedecin(@PathVariable Long medecinId) {
        return consultationService.findByMedecin(medecinId);
    }

    @PutMapping("/{id}")
    public ConsultationDto update(@PathVariable Long id, @RequestBody ConsultationDto request) {
        return consultationService.update(id, request);
    }
}
