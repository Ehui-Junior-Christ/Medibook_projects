package com.medibook.medibook_springboot.infirmier.repository;

import com.medibook.medibook_springboot.infirmier.entity.DocumentMedical;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentMedicalRepository extends JpaRepository<DocumentMedical, Long> {
}