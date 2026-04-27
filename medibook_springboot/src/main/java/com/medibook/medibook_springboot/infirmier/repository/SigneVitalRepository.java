package com.medibook.medibook_springboot.infirmier.repository;

import com.medibook.medibook_springboot.infirmier.entity.SigneVital;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SigneVitalRepository extends JpaRepository<SigneVital, Long> {
}