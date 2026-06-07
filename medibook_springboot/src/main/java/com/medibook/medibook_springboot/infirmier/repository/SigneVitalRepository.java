package com.medibook.medibook_springboot.infirmier.repository;

import com.medibook.medibook_springboot.infirmier.entity.SigneVital;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SigneVitalRepository extends JpaRepository<SigneVital, Long> {

    List<SigneVital> findByPatient_Id(Long patientId);
}