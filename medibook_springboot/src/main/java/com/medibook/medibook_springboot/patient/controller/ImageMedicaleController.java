package com.medibook.medibook_springboot.patient.controller;

import com.medibook.medibook_springboot.patient.dto.ImageMedicaleDto;
import com.medibook.medibook_springboot.patient.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patients/images-medicales")
@CrossOrigin(origins = "*")
public class ImageMedicaleController {

    private final PatientService patientService;

    public ImageMedicaleController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/patient/{patientId}")
    public List<ImageMedicaleDto> getByPatient(
            @PathVariable Long patientId,
            @RequestParam(required = false) String type
    ) {
        return patientService.getImagesMedicales(patientId, type);
    }

    @GetMapping("/{imageId}/patient/{patientId}")
    public ImageMedicaleDto getOne(@PathVariable Long imageId, @PathVariable Long patientId) {
        return patientService.getImageMedicale(patientId, imageId);
    }

    @PostMapping("/patient/{patientId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ImageMedicaleDto upload(@PathVariable Long patientId, @RequestBody ImageMedicaleDto dto) {
        return patientService.createImageMedicale(patientId, dto);
    }

    @DeleteMapping("/{imageId}/patient/{patientId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long imageId, @PathVariable Long patientId) {
        patientService.deleteImageMedicale(patientId, imageId);
    }
}
