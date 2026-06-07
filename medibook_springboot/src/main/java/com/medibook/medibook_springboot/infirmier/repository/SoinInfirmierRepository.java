package com.medibook.medibook_springboot.infirmier.repository;

import com.medibook.medibook_springboot.infirmier.entity.SoinInfirmier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SoinInfirmierRepository extends JpaRepository<SoinInfirmier, Long> {

    List<SoinInfirmier> findByPatient_Id(Long patientId);
}