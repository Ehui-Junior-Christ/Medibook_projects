package com.medibook.medibook_springboot.patient.repository;

import com.medibook.medibook_springboot.patient.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByPatientIdOrderByDateCreationDesc(Long patientId);
    long countByPatientIdAndLuFalse(Long patientId);
}
