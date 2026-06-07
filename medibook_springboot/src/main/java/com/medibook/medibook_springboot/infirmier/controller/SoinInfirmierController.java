package com.medibook.medibook_springboot.infirmier.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.medibook.medibook_springboot.infirmier.dto.SoinInfirmierDTO;
import com.medibook.medibook_springboot.infirmier.entity.SoinInfirmier;
import com.medibook.medibook_springboot.infirmier.service.SoinInfirmierService;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/soins")
@RequiredArgsConstructor
public class SoinInfirmierController {

    private final SoinInfirmierService service;

    @PostMapping
    public SoinInfirmier creer(@RequestBody SoinInfirmierDTO dto) {
        return service.enregistrer(dto);
    }

    @GetMapping
    public List<SoinInfirmier> getAllSoins() {
        return service.getAllSoins();
    }
}