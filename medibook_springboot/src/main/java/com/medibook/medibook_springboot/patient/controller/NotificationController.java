package com.medibook.medibook_springboot.patient.controller;

import com.medibook.medibook_springboot.patient.dto.NotificationDto;
import com.medibook.medibook_springboot.patient.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final PatientService patientService;

    public NotificationController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/patient/{patientId}")
    public List<NotificationDto> getByPatient(@PathVariable Long patientId) {
        return patientService.getNotifications(patientId);
    }

    @GetMapping("/patient/{patientId}/count")
    public Map<String, Long> countUnread(@PathVariable Long patientId) {
        return Map.of("nonLues", patientService.countUnreadNotifications(patientId));
    }

    @PostMapping("/patient/{patientId}")
    @ResponseStatus(HttpStatus.CREATED)
    public NotificationDto create(@PathVariable Long patientId, @RequestBody NotificationDto dto) {
        return patientService.createNotification(patientId, dto);
    }

    @PatchMapping("/{notifId}/patient/{patientId}/lu")
    public NotificationDto markAsRead(
            @PathVariable Long notifId,
            @PathVariable Long patientId
    ) {
        return patientService.markNotificationAsRead(patientId, notifId);
    }

    @DeleteMapping("/{notifId}/patient/{patientId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long notifId, @PathVariable Long patientId) {
        patientService.deleteNotification(patientId, notifId);
    }
}
