package com.medibook.medibook_springboot.infirmier.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.medibook.medibook_springboot.infirmier.entity.DocumentMedical;
import com.medibook.medibook_springboot.infirmier.repository.DocumentMedicalRepository;
import com.medibook.medibook_springboot.patient.entity.Patient;
import com.medibook.medibook_springboot.patient.repository.PatientRepository;

import java.io.File;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class DocumentMedicalService {

    private final DocumentMedicalRepository repo;
    private final PatientRepository patientRepo; // 🔥 IMPORTANT

    public DocumentMedical upload(MultipartFile file, String type, String description, Long patientId) {

        try {
            // 🔥 1. Vérifier patient
            Patient patient = patientRepo.findById(patientId)
                    .orElseThrow(() -> new RuntimeException("Patient non trouvé"));

            // 🔥 2. Créer dossier si pas existant
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // 🔥 3. Générer nom fichier unique
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            // 🔥 4. Sauvegarder fichier
            String filePath = uploadDir + fileName;

                // 🔥 DEBUG
            System.out.println("FICHIER RECU = " + file.getOriginalFilename());
            System.out.println("TAILLE = " + file.getSize());
            System.out.println("CHEMIN = " + filePath);

            file.transferTo(new File(filePath));
            System.out.println("UPLOAD OK ✅");

            // 🔥 5. Enregistrer en base
            DocumentMedical doc = new DocumentMedical();
            doc.setType(type);
            doc.setDescription(description);
            doc.setCheminFichier(filePath);
            doc.setPatient(patient);

            return repo.save(doc);

        } catch (IOException e) {
            throw new RuntimeException("Erreur upload fichier");
        }
    }
}