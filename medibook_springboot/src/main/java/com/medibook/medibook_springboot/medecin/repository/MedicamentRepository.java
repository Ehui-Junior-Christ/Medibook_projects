package com.medibook.medibook_springboot.medecin.repository;

import com.medibook.medibook_springboot.medecin.entity.Medicament;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicamentRepository extends JpaRepository<Medicament, Long> {
}
