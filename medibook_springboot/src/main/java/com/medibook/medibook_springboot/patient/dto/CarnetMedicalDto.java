package com.medibook.medibook_springboot.patient.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CarnetMedicalDto {
    private Long id;
    private String allergies;
    private String maladiesChroniques;
    private String traitementsEnCours;
    private List<AntecedentMedicalDto> antecedents = new ArrayList<>();
    private List<ConditionMedicaleDto> conditions = new ArrayList<>();
    private List<RappelDto> rappels = new ArrayList<>();
}
