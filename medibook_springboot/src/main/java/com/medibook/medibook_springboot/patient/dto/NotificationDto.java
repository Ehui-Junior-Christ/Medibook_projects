package com.medibook.medibook_springboot.patient.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDto {
    private Long id;
    private String type;
    private String titre;
    private String message;
    private LocalDateTime dateCreation;
    private Boolean lu;
    private String urgence;
}
