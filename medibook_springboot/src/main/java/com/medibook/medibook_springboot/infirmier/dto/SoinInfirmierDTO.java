package com.medibook.medibook_springboot.infirmier.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SoinInfirmierDTO {
    private String typeSoin;
    private String description;
    private LocalDateTime dateHeure;
    private Long infirmierId;
}