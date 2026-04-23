package com.medibook.medibook_springboot.medecin.controller;

import com.medibook.medibook_springboot.medecin.dto.MedecinRequestDto;
import com.medibook.medibook_springboot.medecin.dto.MedecinResponseDto;
import com.medibook.medibook_springboot.medecin.service.MedecinService;
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
@RequestMapping("/api/medecins")
@CrossOrigin(origins = "*")
public class MedecinController {

    private final MedecinService medecinService;

    public MedecinController(MedecinService medecinService) {
        this.medecinService = medecinService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MedecinResponseDto create(@RequestBody MedecinRequestDto request) {
        return medecinService.create(request);
    }

    @GetMapping
    public List<MedecinResponseDto> findAll() {
        return medecinService.findAll();
    }

    @GetMapping("/{id}")
    public MedecinResponseDto findById(@PathVariable Long id) {
        return medecinService.findById(id);
    }

    @PutMapping("/{id}")
    public MedecinResponseDto update(@PathVariable Long id, @RequestBody MedecinRequestDto request) {
        return medecinService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        medecinService.delete(id);
    }
}
