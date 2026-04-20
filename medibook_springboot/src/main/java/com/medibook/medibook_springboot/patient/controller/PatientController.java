package com.medibook.medibook_springboot.patient.controller;

import com.medibook.medibook_springboot.patient.dto.CarnetMedicalDto;
import com.medibook.medibook_springboot.patient.dto.PatientRequestDto;
import com.medibook.medibook_springboot.patient.dto.PatientResponseDto;
import com.medibook.medibook_springboot.patient.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PatientResponseDto create(@RequestBody PatientRequestDto request) {
        return patientService.create(request);
    }

    @GetMapping
    public List<PatientResponseDto> findAll() {
        return patientService.findAll();
    }

    @GetMapping("/{id}")
    public PatientResponseDto findById(@PathVariable Long id) {
        return patientService.findById(id);
    }

    @PutMapping("/{id}")
    public PatientResponseDto update(@PathVariable Long id, @RequestBody PatientRequestDto request) {
        return patientService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        patientService.delete(id);
    }

    @GetMapping("/{id}/carnet-medical")
    public CarnetMedicalDto getCarnetMedical(@PathVariable Long id) {
        return patientService.getCarnetMedical(id);
    }

    @PutMapping("/{id}/carnet-medical")
    public CarnetMedicalDto updateCarnetMedical(@PathVariable Long id, @RequestBody CarnetMedicalDto request) {
        return patientService.updateCarnetMedical(id, request);
    }
}
