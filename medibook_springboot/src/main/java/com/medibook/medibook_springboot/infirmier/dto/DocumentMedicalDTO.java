package com.medibook.medibook_springboot.infirmier.dto;

import lombok.Data;

@Data
public class DocumentMedicalDTO {

    private String type;
    private String description;

    // 🔥 IMPORTANT
    private Long patientId;
}