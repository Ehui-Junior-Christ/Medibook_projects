package com.medibook.medibook_springboot.infirmier.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SoinInfirmier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String typeSoin;
    private String description;

    private LocalDateTime dateHeure;

    @ManyToOne
    @JoinColumn(name = "infirmier_id")
    private Infirmier infirmier;
}