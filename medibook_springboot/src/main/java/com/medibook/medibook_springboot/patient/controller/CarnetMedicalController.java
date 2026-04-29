package com.medibook.medibook_springboot.patient.controller;

import com.medibook.medibook_springboot.patient.dto.CarnetMedicalDto;
import com.medibook.medibook_springboot.patient.service.PatientService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patients/carnets-medicaux")
@CrossOrigin(origins = "*")
public class CarnetMedicalController {

    private final PatientService patientService;

    public CarnetMedicalController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/patient/{patientId}")
    public CarnetMedicalDto getByPatient(@PathVariable Long patientId) {
        return patientService.getCarnetMedical(patientId);
    }

    @PutMapping("/patient/{patientId}")
    public CarnetMedicalDto updateByPatient(@PathVariable Long patientId, @RequestBody CarnetMedicalDto request) {
        return patientService.updateCarnetMedical(patientId, request);
    }
}
