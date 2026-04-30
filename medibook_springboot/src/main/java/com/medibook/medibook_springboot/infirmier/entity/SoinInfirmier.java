package com.medibook.medibook_springboot.infirmier.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.medibook.medibook_springboot.patient.entity.Patient;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "soin_infirmier") // ✅ recommandé pour éviter les bugs SQL
public class SoinInfirmier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String typeSoin;
    private String description;

    private LocalDateTime dateHeure;

    @ManyToOne
    @JoinColumn(name = "infirmier_id", nullable = false) // ✅ sécurise la relation
    private Infirmier infirmier;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false) // ✅ sécurise la relation
    private Patient patient;
}