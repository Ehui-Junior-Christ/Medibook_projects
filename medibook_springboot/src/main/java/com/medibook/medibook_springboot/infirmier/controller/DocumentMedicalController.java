package com.medibook.medibook_springboot.infirmier.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.medibook.medibook_springboot.infirmier.entity.DocumentMedical;
import com.medibook.medibook_springboot.infirmier.service.DocumentMedicalService;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 🔥 IMPORTANT (CORS)

public class DocumentMedicalController {

    private final DocumentMedicalService service;

    @PostMapping("/upload")
    public DocumentMedical upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type,
            @RequestParam("description") String description,
            @RequestParam("patientId") Long patientId
    ) {
        return service.upload(file, type, description, patientId);
    }

    // 🔥 AJOUT ICI
    @GetMapping
    public java.util.List<DocumentMedical> getAll() {
        return service.getAll();
    }
}