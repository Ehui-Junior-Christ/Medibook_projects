package com.medibook.medibook_springboot.infirmier.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.medibook.medibook_springboot.infirmier.dto.DocumentMedicalDTO;
import com.medibook.medibook_springboot.infirmier.entity.DocumentMedical;
import com.medibook.medibook_springboot.infirmier.service.DocumentMedicalService;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
   public class DocumentMedicalController {

    private final DocumentMedicalService service;

    @PostMapping
    public DocumentMedical creer(@RequestBody DocumentMedicalDTO dto) {
        return service.enregistrer(dto);
    }
}