package com.medibook.medibook_springboot.medecin.controller;

import com.medibook.medibook_springboot.medecin.dto.CertificatDto;
import com.medibook.medibook_springboot.medecin.service.CertificatService;
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
@RequestMapping("/api/medecins/certificats")
@CrossOrigin(origins = "*")
public class CertificatController {

    private final CertificatService certificatService;

    public CertificatController(CertificatService certificatService) {
        this.certificatService = certificatService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CertificatDto create(@RequestBody CertificatDto request) {
        return certificatService.create(request);
    }

    @GetMapping
    public List<CertificatDto> findAll() {
        return certificatService.findAll();
    }

    @GetMapping("/{id}")
    public CertificatDto findById(@PathVariable Long id) {
        return certificatService.findById(id);
    }

    @GetMapping("/patient/{patientId}")
    public List<CertificatDto> findByPatient(@PathVariable Long patientId) {
        return certificatService.findByPatient(patientId);
    }

    @GetMapping("/medecin/{medecinId}")
    public List<CertificatDto> findByMedecin(@PathVariable Long medecinId) {
        return certificatService.findByMedecin(medecinId);
    }

    @PutMapping("/{id}")
    public CertificatDto update(@PathVariable Long id, @RequestBody CertificatDto request) {
        return certificatService.update(id, request);
    }
}
