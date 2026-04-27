package com.medibook.medibook_springboot.infirmier.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.medibook.medibook_springboot.infirmier.dto.SigneVitalDTO;
import com.medibook.medibook_springboot.infirmier.entity.SigneVital;
import com.medibook.medibook_springboot.infirmier.service.SigneVitalService;

@RestController
@RequestMapping("/api/signes")
@RequiredArgsConstructor
public class SigneVitalController {

    private final SigneVitalService service;

    @PostMapping
    public SigneVital creer(@RequestBody SigneVitalDTO dto) {
        return service.enregistrer(dto);
    }
}