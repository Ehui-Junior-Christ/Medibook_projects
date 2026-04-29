package com.medibook.medibook_springboot.infirmier.controller;

import com.medibook.medibook_springboot.infirmier.dto.InfirmierRequestDTO;
import com.medibook.medibook_springboot.infirmier.dto.InfirmierResponseDTO;
import com.medibook.medibook_springboot.infirmier.service.InfirmierService;
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
@RequestMapping("/api/infirmiers")
@CrossOrigin(origins = "*")
public class InfirmierController {

    private final InfirmierService infirmierService;

    public InfirmierController(InfirmierService infirmierService) {
        this.infirmierService = infirmierService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InfirmierResponseDTO create(@RequestBody InfirmierRequestDTO request) {
        return infirmierService.create(request);
    }

    @GetMapping
    public List<InfirmierResponseDTO> findAll() {
        return infirmierService.findAll();
    }

    @GetMapping("/{id}")
    public InfirmierResponseDTO findById(@PathVariable Long id) {
        return infirmierService.findById(id);
    }

    @PutMapping("/{id}")
    public InfirmierResponseDTO update(@PathVariable Long id, @RequestBody InfirmierRequestDTO request) {
        return infirmierService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        infirmierService.delete(id);
    }
}
