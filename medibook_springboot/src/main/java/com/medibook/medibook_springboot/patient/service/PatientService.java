package com.medibook.medibook_springboot.patient.service;

import com.medibook.medibook_springboot.auth.entity.Role;
import com.medibook.medibook_springboot.patient.dto.AntecedentMedicalDto;
import com.medibook.medibook_springboot.patient.dto.CarnetMedicalDto;
import com.medibook.medibook_springboot.patient.dto.ConditionMedicaleDto;
import com.medibook.medibook_springboot.patient.dto.PatientRequestDto;
import com.medibook.medibook_springboot.patient.dto.PatientResponseDto;
import com.medibook.medibook_springboot.patient.dto.RappelDto;
import com.medibook.medibook_springboot.patient.entity.AntecedentMedical;
import com.medibook.medibook_springboot.patient.entity.CarnetMedical;
import com.medibook.medibook_springboot.patient.entity.ConditionMedicale;
import com.medibook.medibook_springboot.patient.entity.Patient;
import com.medibook.medibook_springboot.patient.entity.Rappel;
import com.medibook.medibook_springboot.patient.repository.CarnetMedicalRepository;
import com.medibook.medibook_springboot.patient.repository.PatientRepository;
import com.medibook.medibook_springboot.patient.repository.RappelRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final CarnetMedicalRepository carnetMedicalRepository;
    private final RappelRepository rappelRepository;

    public PatientService(
            PatientRepository patientRepository,
            CarnetMedicalRepository carnetMedicalRepository,
            RappelRepository rappelRepository
    ) {
        this.patientRepository = patientRepository;
        this.carnetMedicalRepository = carnetMedicalRepository;
        this.rappelRepository = rappelRepository;
    }

    @Transactional
    public PatientResponseDto create(PatientRequestDto request) {
        validerUnicite(request, null);

        Patient patient = new Patient();
        appliquerRequest(patient, request);
        patient.setRole(Role.PATIENT);
        patient.setActif(true);

        CarnetMedical carnet = new CarnetMedical();
        rattacherCarnet(patient, carnet);
        synchroniserCarnetDepuisRequest(carnet, request);

        return mapPatient(patientRepository.save(patient));
    }

    @Transactional(readOnly = true)
    public List<PatientResponseDto> findAll() {
        return patientRepository.findAll().stream()
                .map(this::mapPatient)
                .toList();
    }

    @Transactional(readOnly = true)
    public PatientResponseDto findById(Long id) {
        return mapPatient(getPatientOrThrow(id));
    }

    @Transactional(readOnly = true)
    public PatientResponseDto findByCmu(String cmu) {
        return patientRepository.findByCmu(cmu)
                .map(this::mapPatient)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient introuvable."));
    }

    @Transactional
    public PatientResponseDto update(Long id, PatientRequestDto request) {
        Patient patient = getPatientOrThrow(id);
        validerUnicite(request, id);

        appliquerRequest(patient, request);
        CarnetMedical carnet = getOrCreateCarnet(patient);
        synchroniserCarnetDepuisRequest(carnet, request);

        return mapPatient(patientRepository.save(patient));
    }

    @Transactional
    public void delete(Long id) {
        patientRepository.delete(getPatientOrThrow(id));
    }

    @Transactional(readOnly = true)
    public CarnetMedicalDto getCarnetMedical(Long patientId) {
        Patient patient = getPatientOrThrow(patientId);
        return mapCarnet(getOrCreateCarnet(patient));
    }

    @Transactional(readOnly = true)
    public List<RappelDto> getRappels(Long patientId) {
        getPatientOrThrow(patientId);
        return sortRappels(
                rappelRepository.findByCarnetMedicalPatientIdOrderByDateHeureAscIdAsc(patientId).stream()
                        .map(this::mapRappel)
                        .toList()
        );
    }

    @Transactional
    public CarnetMedicalDto updateCarnetMedical(Long patientId, CarnetMedicalDto dto) {
        Patient patient = getPatientOrThrow(patientId);
        CarnetMedical carnet = getOrCreateCarnet(patient);

        carnet.setAllergies(dto.getAllergies());
        carnet.setMaladiesChroniques(dto.getMaladiesChroniques());
        carnet.setTraitementsEnCours(dto.getTraitementsEnCours());

        carnet.getAntecedents().clear();
        dto.getAntecedents().forEach(item -> carnet.getAntecedents().add(mapAntecedentEntity(item, carnet)));

        carnet.getConditions().clear();
        dto.getConditions().forEach(item -> carnet.getConditions().add(mapConditionEntity(item, carnet)));

        synchroniserRappels(carnet, dto.getRappels());

        return mapCarnet(carnetMedicalRepository.save(carnet));
    }

    @Transactional
    public List<RappelDto> updateRappels(Long patientId, List<RappelDto> rappels) {
        Patient patient = getPatientOrThrow(patientId);
        CarnetMedical carnet = getOrCreateCarnet(patient);
        synchroniserRappels(carnet, rappels);
        CarnetMedical savedCarnet = carnetMedicalRepository.save(carnet);
        return sortRappels(savedCarnet.getRappels().stream().map(this::mapRappel).toList());
    }

    @Transactional
    public RappelDto updateRappelStatut(Long patientId, Long rappelId, Boolean fait) {
        Rappel rappel = rappelRepository.findByIdAndCarnetMedicalPatientId(rappelId, patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rappel introuvable."));
        rappel.setFait(fait != null ? fait : Boolean.FALSE);
        return mapRappel(rappelRepository.save(rappel));
    }

    private void appliquerRequest(Patient patient, PatientRequestDto request) {
        patient.setNom(request.getNom());
        patient.setPrenom(request.getPrenom());
        patient.setEmail(request.getEmail());
        patient.setTelephone(request.getTelephone());
        patient.setCmu(request.getNumeroAssure());
        if (request.getMotDePasse() != null && !request.getMotDePasse().isBlank()) {
            patient.setMotDePasse(request.getMotDePasse());
        }
        patient.setPhotoProfil(request.getPhotoProfil());
        patient.setDateNaissance(request.getDateNaissance());
        patient.setSexe(request.getSexe());
        patient.setAdresse(request.getAdresse());
        patient.setProfession(request.getProfession());
        patient.setSituationFamiliale(request.getSituationFamiliale());
        patient.setNumeroUrgence(request.getNumeroUrgence());
        patient.setPersonneUrgence(request.getPersonneUrgence());
        patient.setLienUrgence(request.getLienUrgence());
        patient.setAssurance(request.getAssurance());
        patient.setPoids(request.getPoids());
        patient.setTaille(request.getTaille());
        patient.setGroupeSanguin(request.getGroupeSanguin());
        patient.setHandicap(request.getHandicap());
        patient.setNotesPatient(request.getNotesPatient());
        patient.setMedecinTraitant(request.getMedecinTraitant());
        patient.setSpecialiteMedecin(request.getSpecialiteMedecin());
        patient.setTelephoneMedecin(request.getTelephoneMedecin());
    }

    private void synchroniserCarnetDepuisRequest(CarnetMedical carnet, PatientRequestDto request) {
        carnet.setAllergies(request.getAllergies());
        carnet.setMaladiesChroniques(request.getMaladiesChroniques());
        carnet.setTraitementsEnCours(request.getTraitements());

        carnet.getAntecedents().clear();
        if (request.getAntecedents() != null && !request.getAntecedents().isBlank()) {
            AntecedentMedical antecedent = new AntecedentMedical();
            antecedent.setLibelle("Antecedents medicaux");
            antecedent.setDetails(request.getAntecedents());
            antecedent.setCarnetMedical(carnet);
            carnet.getAntecedents().add(antecedent);
        }
    }

    private void validerUnicite(PatientRequestDto request, Long patientId) {
        verifierDoublon(patientRepository.findByEmail(request.getEmail()), patientId, "Cet email est deja utilise.");
        verifierDoublon(patientRepository.findByTelephone(request.getTelephone()), patientId, "Ce numero de telephone est deja utilise.");
        verifierDoublon(patientRepository.findByCmu(request.getNumeroAssure()), patientId, "Ce numero assure ou CMU est deja utilise.");
    }

    private void verifierDoublon(java.util.Optional<Patient> existing, Long patientId, String message) {
        if (existing.isPresent() && (patientId == null || !existing.get().getId().equals(patientId))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, message);
        }
    }

    private Patient getPatientOrThrow(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient introuvable."));
    }

    private CarnetMedical getOrCreateCarnet(Patient patient) {
        if (patient.getCarnetMedical() != null) {
            return patient.getCarnetMedical();
        }

        return carnetMedicalRepository.findByPatientId(patient.getId())
                .orElseGet(() -> {
                    CarnetMedical carnet = new CarnetMedical();
                    rattacherCarnet(patient, carnet);
                    return carnetMedicalRepository.save(carnet);
                });
    }

    private void rattacherCarnet(Patient patient, CarnetMedical carnet) {
        carnet.setPatient(patient);
        patient.setCarnetMedical(carnet);
    }

    private PatientResponseDto mapPatient(Patient patient) {
        CarnetMedical carnet = patient.getCarnetMedical();
        PatientResponseDto dto = new PatientResponseDto();
        dto.setId(patient.getId());
        dto.setNom(patient.getNom());
        dto.setPrenom(patient.getPrenom());
        dto.setNomComplet(patient.getNomComplet());
        dto.setEmail(patient.getEmail());
        dto.setTelephone(patient.getTelephone());
        dto.setNumeroAssure(patient.getCmu());
        dto.setPhotoProfil(patient.getPhotoProfil());
        dto.setActif(patient.getActif());
        dto.setDateNaissance(patient.getDateNaissance());
        dto.setSexe(patient.getSexe());
        dto.setAdresse(patient.getAdresse());
        dto.setProfession(patient.getProfession());
        dto.setSituationFamiliale(patient.getSituationFamiliale());
        dto.setNumeroUrgence(patient.getNumeroUrgence());
        dto.setPersonneUrgence(patient.getPersonneUrgence());
        dto.setLienUrgence(patient.getLienUrgence());
        dto.setAssurance(patient.getAssurance());
        dto.setPoids(patient.getPoids());
        dto.setTaille(patient.getTaille());
        dto.setGroupeSanguin(patient.getGroupeSanguin());
        dto.setHandicap(patient.getHandicap());
        dto.setNotesPatient(patient.getNotesPatient());
        dto.setMedecinTraitant(patient.getMedecinTraitant());
        dto.setSpecialiteMedecin(patient.getSpecialiteMedecin());
        dto.setTelephoneMedecin(patient.getTelephoneMedecin());
        if (carnet != null) {
            dto.setAllergies(carnet.getAllergies());
            dto.setMaladiesChroniques(carnet.getMaladiesChroniques());
            dto.setTraitements(carnet.getTraitementsEnCours());
            dto.setAntecedents(carnet.getAntecedents().stream()
                    .map(AntecedentMedical::getDetails)
                    .filter(item -> item != null && !item.isBlank())
                    .reduce((left, right) -> left + "\n" + right)
                    .orElse(null));
            dto.setCarnetMedical(mapCarnet(carnet));
        }
        return dto;
    }

    private CarnetMedicalDto mapCarnet(CarnetMedical carnet) {
        CarnetMedicalDto dto = new CarnetMedicalDto();
        dto.setId(carnet.getId());
        dto.setAllergies(carnet.getAllergies());
        dto.setMaladiesChroniques(carnet.getMaladiesChroniques());
        dto.setTraitementsEnCours(carnet.getTraitementsEnCours());
        dto.setAntecedents(carnet.getAntecedents().stream().map(this::mapAntecedent).toList());
        dto.setConditions(carnet.getConditions().stream().map(this::mapCondition).toList());
        dto.setRappels(sortRappels(carnet.getRappels().stream().map(this::mapRappel).toList()));
        return dto;
    }

    private AntecedentMedicalDto mapAntecedent(AntecedentMedical antecedent) {
        AntecedentMedicalDto dto = new AntecedentMedicalDto();
        dto.setId(antecedent.getId());
        dto.setLibelle(antecedent.getLibelle());
        dto.setDetails(antecedent.getDetails());
        dto.setDateDebut(antecedent.getDateDebut());
        dto.setActif(antecedent.getActif());
        return dto;
    }

    private ConditionMedicaleDto mapCondition(ConditionMedicale condition) {
        ConditionMedicaleDto dto = new ConditionMedicaleDto();
        dto.setId(condition.getId());
        dto.setLibelle(condition.getLibelle());
        dto.setDetails(condition.getDetails());
        dto.setDateDiagnostic(condition.getDateDiagnostic());
        dto.setChronique(condition.getChronique());
        dto.setTraitement(condition.getTraitement());
        return dto;
    }

    private RappelDto mapRappel(Rappel rappel) {
        RappelDto dto = new RappelDto();
        dto.setId(rappel.getId());
        dto.setType(rappel.getType());
        dto.setTitre(rappel.getTitre());
        dto.setDescription(rappel.getDescription());
        dto.setDateHeure(rappel.getDateHeure());
        dto.setUrgence(rappel.getUrgence());
        dto.setFait(rappel.getFait());
        return dto;
    }

    private AntecedentMedical mapAntecedentEntity(AntecedentMedicalDto dto, CarnetMedical carnet) {
        AntecedentMedical entity = new AntecedentMedical();
        entity.setLibelle(dto.getLibelle());
        entity.setDetails(dto.getDetails());
        entity.setDateDebut(dto.getDateDebut());
        entity.setActif(dto.getActif() != null ? dto.getActif() : Boolean.TRUE);
        entity.setCarnetMedical(carnet);
        return entity;
    }

    private ConditionMedicale mapConditionEntity(ConditionMedicaleDto dto, CarnetMedical carnet) {
        ConditionMedicale entity = new ConditionMedicale();
        entity.setLibelle(dto.getLibelle());
        entity.setDetails(dto.getDetails());
        entity.setDateDiagnostic(dto.getDateDiagnostic());
        entity.setChronique(dto.getChronique() != null ? dto.getChronique() : Boolean.FALSE);
        entity.setTraitement(dto.getTraitement());
        entity.setCarnetMedical(carnet);
        return entity;
    }

    private void synchroniserRappels(CarnetMedical carnet, List<RappelDto> rappels) {
        List<RappelDto> payload = rappels == null ? List.of() : rappels;
        Map<Long, Rappel> existingById = carnet.getRappels().stream()
                .filter(rappel -> rappel.getId() != null)
                .collect(Collectors.toMap(Rappel::getId, Function.identity()));

        carnet.getRappels().removeIf(existing ->
                existing.getId() != null
                        && payload.stream().noneMatch(dto -> Objects.equals(dto.getId(), existing.getId()))
        );

        for (RappelDto dto : payload) {
            Rappel entity = dto.getId() != null ? existingById.get(dto.getId()) : null;
            if (entity == null) {
                entity = new Rappel();
                carnet.getRappels().add(entity);
            }
            applyRappel(entity, dto, carnet);
        }
    }

    private void applyRappel(Rappel entity, RappelDto dto, CarnetMedical carnet) {
        entity.setType(dto.getType() != null && !dto.getType().isBlank() ? dto.getType() : "rappel");
        entity.setTitre(dto.getTitre() != null && !dto.getTitre().isBlank() ? dto.getTitre() : "Rappel patient");
        entity.setDescription(dto.getDescription());
        entity.setDateHeure(dto.getDateHeure());
        entity.setUrgence(dto.getUrgence());
        entity.setFait(dto.getFait() != null ? dto.getFait() : Boolean.FALSE);
        entity.setCarnetMedical(carnet);
    }

    private List<RappelDto> sortRappels(List<RappelDto> rappels) {
        return rappels.stream()
                .sorted(Comparator
                        .comparing(RappelDto::getDateHeure, Comparator.nullsLast(Comparator.naturalOrder()))
                        .thenComparing(RappelDto::getId, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
    }
}
