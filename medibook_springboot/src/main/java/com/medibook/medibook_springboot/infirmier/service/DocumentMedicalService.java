package com.medibook.medibook_springboot.infirmier.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.medibook.medibook_springboot.infirmier.entity.DocumentMedical;
import com.medibook.medibook_springboot.infirmier.repository.DocumentMedicalRepository;
import com.medibook.medibook_springboot.infirmier.dto.DocumentMedicalDTO;

@Service
@RequiredArgsConstructor
public class DocumentMedicalService {

    private final DocumentMedicalRepository repo;

    public DocumentMedical enregistrer(DocumentMedicalDTO dto) {

        DocumentMedical doc = new DocumentMedical();
        doc.setType(dto.getType());
        doc.setCheminFichier(dto.getCheminFichier());
        doc.setDescription(dto.getDescription());

        return repo.save(doc);
    }
}