package com.medibook.medibook_springboot.patient.controller;

import com.medibook.medibook_springboot.patient.dto.RappelDto;
import com.medibook.medibook_springboot.patient.dto.RappelStatutRequestDto;
import com.medibook.medibook_springboot.patient.service.PatientService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patients/rappels")
@CrossOrigin(origins = "*")
public class RappelController {

    private final PatientService patientService;

    public RappelController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/patient/{patientId}")
    public List<RappelDto> getByPatient(@PathVariable Long patientId) {
        return patientService.getRappels(patientId);
    }

    @PutMapping("/patient/{patientId}")
    public List<RappelDto> updateByPatient(@PathVariable Long patientId, @RequestBody List<RappelDto> request) {
        return patientService.updateRappels(patientId, request);
    }

    @PatchMapping("/{rappelId}/patient/{patientId}/statut")
    public RappelDto updateStatut(
            @PathVariable Long rappelId,
            @PathVariable Long patientId,
            @RequestBody RappelStatutRequestDto request
    ) {
        return patientService.updateRappelStatut(patientId, rappelId, request.getFait());
    }
}
