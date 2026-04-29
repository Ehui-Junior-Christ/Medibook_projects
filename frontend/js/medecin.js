const DEFAULT_MEDECIN_SESSION = {
  name: "Dr. Bamba A.",
  role: "Medecin",
  specialty: "Medecine generale",
  initials: "BA",
  phone: "+225 27 21 24 26 26",
  email: "bamba.adama@medibook.ci",
  matricule: "MAT-MED-00142",
  bio: "Medecin generaliste en charge du suivi clinique et de la coordination des soins.",
  avatar: ""
};

const SHARED_RECORDS_KEY = "medibook.shared.records";
const WORKFLOW_STATE_KEY = "medibook.medecin.workflow";
const API_BASE_URL = "http://localhost:8080/api";
const PATIENT_RECORDS_CACHE = new Map();
const MEDECIN_API_CONTEXT = {
  ready: false,
  medecinId: null
};

const DEFAULT_MEDECIN_PATIENTS = [
  {
    id: "CMU-2024-08821",
    fullName: "Kouadio Jean Baptiste",
    initials: "KJ",
    cmu: "CMU-2024-08821",
    age: "37 ans",
    birthDate: "14/03/1987",
    phone: "+225 07 12 34 56",
    allergy: "Allergie Penicilline",
    condition: "Hypertension",
    blood: "O+ Rhesus+",
    lastConsultation: "12 Mar 2025",
    summary: "Fievre persistante"
  },
  {
    id: "CMU-2023-04512",
    fullName: "Assi Koffi Martial",
    initials: "AK",
    cmu: "CMU-2023-04512",
    age: "52 ans",
    birthDate: "19/11/1973",
    phone: "+225 05 23 45 67",
    allergy: "Aucune allergie connue",
    condition: "Diabete",
    blood: "A+ Rhesus+",
    lastConsultation: "08 Mar 2025",
    summary: "Bilan diabete"
  },
  {
    id: "CMU-2025-01277",
    fullName: "Traore Awa Mariam",
    initials: "TA",
    cmu: "CMU-2025-01277",
    age: "29 ans",
    birthDate: "08/02/1997",
    phone: "+225 01 44 98 10 22",
    allergy: "Aucune",
    condition: "Suivi prenatal",
    blood: "B+ Rhesus+",
    lastConsultation: "21 Mar 2025",
    summary: "Suivi prenatal"
  }
];
let MEDECIN_PATIENTS = [...DEFAULT_MEDECIN_PATIENTS];

const MEDECIN_CONSULTATIONS = [
  { patientId: "CMU-2024-08821", date: "2025-03-12", status: "done" },
  { patientId: "CMU-2023-04512", date: "2025-03-08", status: "done" },
  { patientId: "CMU-2025-01277", date: "2025-03-21", status: "done" },
  { patientId: "CMU-2024-08821", date: "2025-04-06", status: "pending" },
  { patientId: "CMU-2023-04512", date: "2025-04-06", status: "done" }
];

const MEDECIN_ORDONNANCES = [
  { patientId: "CMU-2024-08821", date: "2025-03-12" },
  { patientId: "CMU-2023-04512", date: "2025-03-08" },
  { patientId: "CMU-2025-01277", date: "2025-03-21" }
];

const MEDECIN_CERTIFICATS = [
  { patientId: "CMU-2024-08821", date: "2025-03-12" },
  { patientId: "CMU-2025-01277", date: "2025-03-21" }
];

const MEDECIN_NOTIFICATION_COUNT = 3;
const MEDECIN_NOTIFICATIONS = [
  { title: "Resultats biologiques", body: "Le bilan du patient Kouadio Jean Baptiste est disponible.", time: "Aujourd'hui Â· 08:15", tag: "laboratoire" },
  { title: "Consultation a valider", body: "La consultation d'Assi Koffi Martial attend votre validation.", time: "Aujourd'hui Â· 10:00", tag: "consultation" },
  { title: "Rappel de suivi", body: "Traore Awa Mariam doit etre revue cette semaine.", time: "Demain Â· 09:30", tag: "suivi" }
];

function getStoredMedecinSession() {
  const raw = window.localStorage.getItem("medecinSession");
  if (!raw) return { ...DEFAULT_MEDECIN_SESSION };
  try {
    return { ...DEFAULT_MEDECIN_SESSION, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_MEDECIN_SESSION };
  }
}

let MEDECIN_SESSION = getStoredMedecinSession();

function saveMedecinSession(updates) {
  MEDECIN_SESSION = { ...MEDECIN_SESSION, ...updates };
  window.localStorage.setItem("medecinSession", JSON.stringify(MEDECIN_SESSION));
}

function getPatientInitials(fullName = "") {
  return fullName
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "PT";
}

function formatBirthDate(value) {
  if (!value) return "Non renseignee";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR").format(date);
}

function formatAge(value) {
  if (!value) return "Age non renseigne";
  const birthDate = new Date(value);
  if (Number.isNaN(birthDate.getTime())) return "Age non renseigne";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return `${Math.max(age, 0)} ans`;
}

function normalizePatientFromApi(patient) {
  const fullName = [patient.prenom, patient.nom].filter(Boolean).join(" ").trim() || "Patient";
  const cmu = patient.numeroAssure || patient.cmu || `PAT-${patient.id}`;
  return {
    id: String(patient.id ?? cmu),
    fullName,
    initials: getPatientInitials(fullName),
    cmu,
    age: formatAge(patient.dateNaissance),
    birthDate: formatBirthDate(patient.dateNaissance),
    phone: patient.telephone || "Non renseigne",
    allergy: patient.allergies || "Aucune allergie connue",
    condition: patient.maladiesChroniques || "Aucune condition renseignee",
    blood: patient.groupeSanguin || "Non renseigne",
    lastConsultation: "Aucune consultation",
    summary: patient.notesPatient || "Aucun resume clinique disponible"
  };
}

async function loadPatientsFromApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`);
    if (!response.ok) {
      throw new Error("Chargement des patients impossible");
    }

    const patients = await response.json();
    if (Array.isArray(patients) && patients.length > 0) {
      MEDECIN_PATIENTS = patients.map(normalizePatientFromApi);
      return;
    }
  } catch (error) {
    console.error(error);
  }

  MEDECIN_PATIENTS = [...DEFAULT_MEDECIN_PATIENTS];
}

async function apiFetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message = `Erreur API ${response.status}`;
    try {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const payload = await response.json();
        message = payload.message || payload.detail || payload.error || message;
      } else {
        const text = await response.text();
        if (text) {
          message = text;
        }
      }
    } catch {
      // Message par defaut conserve.
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}

function clearWorkflowValidation() {
  document.querySelectorAll(".field-invalid").forEach((node) => node.classList.remove("field-invalid"));
}

function addValidationIssue(issues, tracker, label, field) {
  issues.push(label);
  if (field) {
    field.classList.add("field-invalid");
    if (!tracker.firstInvalid) {
      tracker.firstInvalid = field;
    }
  }
}

function focusFirstInvalidField(tracker) {
  if (tracker.firstInvalid instanceof HTMLElement) {
    tracker.firstInvalid.focus();
  }
}

function buildValidationResult(prefix, issues) {
  return {
    ok: issues.length === 0,
    message: issues.length ? `${prefix} ${issues.join(", ")}.` : ""
  };
}

function normalizeDateLabel(value) {
  if (!value) return "Date inconnue";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR").format(date);
}

function getFallbackPatientRecords(patientId) {
  const records = loadSharedRecords();
  return {
    consultations: records.consultations.filter((item) => String(item.patientId) === String(patientId)),
    ordonnances: records.ordonnances.filter((item) => String(item.patientId) === String(patientId)),
    certificats: (records.certificats || []).filter((item) => String(item.patientId) === String(patientId)),
    vitals: records.vitals.filter((item) => String(item.patientId) === String(patientId)),
    timeline: records.timeline.filter((item) => String(item.patientId) === String(patientId))
  };
}

function normalizeConsultationFromApi(item) {
  return {
    id: String(item.id),
    patientId: String(item.patientId),
    date: item.dateConsultation,
    heure: item.heureConsultation ? String(item.heureConsultation).slice(0, 5) : "",
    titre: item.motifPrincipal || "Consultation medicale",
    etablissement: item.etablissement || "MediBook",
    medecin: item.medecinNomComplet || item.medecinNom || MEDECIN_SESSION.name,
    specialite: item.specialiteMedicale || item.specialite || MEDECIN_SESSION.specialty,
    statut: item.statut || "terminee",
    symptomes: item.symptomes || "",
    diagnostic: item.diagnostic || "",
    traitement: item.traitement || "",
    observations: item.observations || "",
    vitals: {
      taSys: item.tensionSystolique,
      taDia: item.tensionDiastolique,
      temp: item.temperature,
      fc: item.frequenceCardiaque,
      spo2: item.spo2
    }
  };
}

function normalizeOrdonnanceFromApi(item) {
  return {
    id: String(item.id),
    patientId: String(item.patientId),
    date: item.datePrescription,
    statut: item.statut || "active",
    medecin: item.medecinNomComplet || item.medecinNom || MEDECIN_SESSION.name,
    specialite: item.specialiteMedicale || item.specialite || MEDECIN_SESSION.specialty,
    recommandations: item.recommandations || "",
    consultationId: item.consultationId ? String(item.consultationId) : "",
    medicaments: Array.isArray(item.medicaments)
      ? item.medicaments.map((medicament) =>
          [
            medicament.nom,
            medicament.dosage,
            medicament.voie,
            medicament.prisesParJour ? `${medicament.prisesParJour}x/j` : "",
            medicament.dureeJours ? `${medicament.dureeJours} jours` : "",
            medicament.instructions
          ].filter(Boolean).join(" - ")
        )
      : []
  };
}

function normalizeCertificatFromApi(item) {
  return {
    id: String(item.id),
    patientId: String(item.patientId),
    date: item.dateCertificat,
    type: item.type || "general",
    source: item.medecinNomComplet || item.medecinNom || MEDECIN_SESSION.name,
    destinataire: item.destinataire || "",
    motif: item.motif || "",
    restrictions: item.restrictions || "",
    consultationId: item.consultationId ? String(item.consultationId) : "",
    debutArret: item.debutArret || "",
    finArret: item.finArret || ""
  };
}

async function loadCurrentMedecinContext() {
  if (MEDECIN_API_CONTEXT.ready) return MEDECIN_API_CONTEXT.medecinId;

  try {
    const medecins = await apiFetchJson("/medecins");
    const matchingMedecin = Array.isArray(medecins)
      ? medecins.find((item) =>
          item.matricule === MEDECIN_SESSION.matricule
          || (item.email && item.email === MEDECIN_SESSION.email)
        ) || medecins[0]
      : null;

    MEDECIN_API_CONTEXT.medecinId = matchingMedecin?.id ?? null;
    MEDECIN_API_CONTEXT.ready = true;
    if (matchingMedecin?.id) {
      saveMedecinSession({
        id: matchingMedecin.id,
        name: matchingMedecin.nomComplet || MEDECIN_SESSION.name,
        specialty: matchingMedecin.specialiteMedicale || MEDECIN_SESSION.specialty,
        email: matchingMedecin.email || MEDECIN_SESSION.email,
        phone: matchingMedecin.telephone || MEDECIN_SESSION.phone,
        matricule: matchingMedecin.matricule || MEDECIN_SESSION.matricule
      });
      initMedecinSessionUi();
    }
  } catch (error) {
    console.error(error);
    MEDECIN_API_CONTEXT.ready = true;
  }

  return MEDECIN_API_CONTEXT.medecinId;
}

async function findPatientByCmu(cmu) {
  const value = String(cmu || "").trim();
  if (!value) return null;

  try {
    const patient = await apiFetchJson(`/patients/cmu/${encodeURIComponent(value)}`);
    if (patient) {
      const normalized = normalizePatientFromApi(patient);
      MEDECIN_PATIENTS = [
        normalized,
        ...MEDECIN_PATIENTS.filter((item) => item.id !== normalized.id)
      ];
      return normalized;
    }
  } catch (error) {
    if (error.status !== 404) {
      console.error(error);
    }
  }

  return filterPatientsByPriority(value)[0] || null;
}

async function refreshPatientRecords(patientId) {
  if (!patientId) return getFallbackPatientRecords(patientId);

  try {
    const [consultations, ordonnances, certificats] = await Promise.all([
      apiFetchJson(`/medecins/consultations/patient/${patientId}`),
      apiFetchJson(`/medecins/ordonnances/patient/${patientId}`),
      apiFetchJson(`/medecins/certificats/patient/${patientId}`)
    ]);

    const normalized = {
      consultations: Array.isArray(consultations) ? consultations.map(normalizeConsultationFromApi) : [],
      ordonnances: Array.isArray(ordonnances) ? ordonnances.map(normalizeOrdonnanceFromApi) : [],
      certificats: Array.isArray(certificats) ? certificats.map(normalizeCertificatFromApi) : [],
      vitals: Array.isArray(consultations)
        ? consultations
          .filter((item) => item.tensionSystolique || item.tensionDiastolique || item.temperature || item.frequenceCardiaque || item.spo2)
          .map((item) => ({
            id: `vital-${item.id}`,
            patientId: String(item.patientId),
            date: item.dateConsultation,
            heure: item.heureConsultation ? String(item.heureConsultation).slice(0, 5) : "",
            taSys: item.tensionSystolique,
            taDia: item.tensionDiastolique,
            temp: item.temperature,
            fc: item.frequenceCardiaque,
            spo2: item.spo2
          }))
        : [],
      timeline: []
    };

    PATIENT_RECORDS_CACHE.set(String(patientId), normalized);
    return normalized;
  } catch (error) {
    console.error(error);
    return getFallbackPatientRecords(patientId);
  }
}

function fillText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value;
  });
}

function fillHtml(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    node.innerHTML = value;
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeFilename(value) {
  return String(value || "document")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentTimeLabel() {
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function createRecordId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getWorkflowState() {
  const raw = window.localStorage.getItem(WORKFLOW_STATE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveWorkflowState(updates) {
  const next = { ...getWorkflowState(), ...updates };
  window.localStorage.setItem(WORKFLOW_STATE_KEY, JSON.stringify(next));
  return next;
}

function setSelectedPatient(patientId) {
  if (!patientId) {
    window.localStorage.removeItem("medecinSelectedPatientId");
    saveWorkflowState({ patientId: null });
    return;
  }
  window.localStorage.setItem("medecinSelectedPatientId", patientId);
  saveWorkflowState({ patientId });
}

function getSelectedPatient() {
  const statePatientId = getWorkflowState().patientId;
  const savedPatientId = window.localStorage.getItem("medecinSelectedPatientId");
  const patientId = statePatientId || savedPatientId;
  if (!patientId) return null;
  return MEDECIN_PATIENTS.find((patient) => patient.id === patientId || patient.cmu === patientId) || null;
}

function goToWorkflowPage(page, action, extras = {}) {
  const selectedPatient = getSelectedPatient();
  saveWorkflowState({ action, patientId: selectedPatient?.id, ...extras });
  window.location.href = page;
}

function loadSharedRecords() {
  const fallback = { consultations: [], ordonnances: [], certificats: [], documents: [], vitals: [], timeline: [] };
  const raw = window.localStorage.getItem(SHARED_RECORDS_KEY);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return {
      consultations: Array.isArray(parsed.consultations) ? parsed.consultations : [],
      ordonnances: Array.isArray(parsed.ordonnances) ? parsed.ordonnances : [],
      certificats: Array.isArray(parsed.certificats) ? parsed.certificats : [],
      documents: Array.isArray(parsed.documents) ? parsed.documents : [],
      vitals: Array.isArray(parsed.vitals) ? parsed.vitals : [],
      timeline: Array.isArray(parsed.timeline) ? parsed.timeline : []
    };
  } catch {
    return fallback;
  }
}

function saveSharedRecords(records) {
  window.localStorage.setItem(SHARED_RECORDS_KEY, JSON.stringify(records));
}

function appendSharedRecord(collection, record) {
  const records = loadSharedRecords();
  records[collection] = [record, ...(records[collection] || []).filter((item) => item.id !== record.id)];
  saveSharedRecords(records);
}

function getSharedPatientRecords(patientId) {
  const records = PATIENT_RECORDS_CACHE.get(String(patientId)) || getFallbackPatientRecords(patientId);
  return {
    consultations: records.consultations.filter((item) => String(item.patientId) === String(patientId)),
    ordonnances: records.ordonnances.filter((item) => String(item.patientId) === String(patientId)),
    certificats: (records.certificats || []).filter((item) => String(item.patientId) === String(patientId)),
    vitals: records.vitals.filter((item) => String(item.patientId) === String(patientId)),
    timeline: records.timeline.filter((item) => String(item.patientId) === String(patientId))
  };
}

function getLatestSharedConsultation(patientId) {
  return getSharedPatientRecords(patientId).consultations
    .slice()
    .sort((a, b) => new Date(`${b.date}T${b.heure || "00:00"}`) - new Date(`${a.date}T${a.heure || "00:00"}`))[0];
}

function triggerFileDownload(filename, content, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function filterPatients(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return MEDECIN_PATIENTS;
  return MEDECIN_PATIENTS.filter((patient) => {
    return [patient.fullName, patient.cmu, patient.phone, patient.summary].some((value) =>
      String(value || "").toLowerCase().includes(normalized)
    );
  });
}

function filterPatientsByPriority(query) {
  const normalized = query.trim().toLowerCase();
  const patients = filterPatients(query);
  return patients.sort((a, b) => {
    const aStartsWithCmu = String(a.cmu || "").toLowerCase().startsWith(normalized);
    const bStartsWithCmu = String(b.cmu || "").toLowerCase().startsWith(normalized);
    if (aStartsWithCmu !== bStartsWithCmu) return aStartsWithCmu ? -1 : 1;
    return a.fullName.localeCompare(b.fullName);
  });
}

function applyPatientData(patient) {
  if (!patient) return;

  const latestSharedConsultation = getLatestSharedConsultation(patient.id);
  const lastConsultation = latestSharedConsultation
    ? new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(latestSharedConsultation.date))
    : patient.lastConsultation;
  const summary = latestSharedConsultation?.titre || latestSharedConsultation?.diagnostic || patient.summary;

  fillText("[data-patient-name]", patient.fullName);
  fillText("[data-patient-cmu]", patient.cmu);
  fillText("[data-patient-age]", patient.age);
  fillText("[data-patient-phone]", patient.phone);
  fillText("[data-patient-birth]", patient.birthDate);
  fillText("[data-patient-initials]", patient.initials);
  fillText("[data-patient-allergy]", patient.allergy);
  fillText("[data-patient-condition]", patient.condition);
  fillText("[data-patient-blood]", patient.blood);
  fillText("[data-patient-summary]", summary);
  fillText("[data-patient-last-consultation]", lastConsultation);
  fillText("[data-search-selected]", `${patient.fullName} · ${patient.cmu}`);
  fillHtml("[data-patient-meta-short]", `${patient.cmu} · ${patient.age}`);
  fillHtml("[data-patient-meta-long]", `${patient.cmu} · Ne le ${patient.birthDate} · ${patient.phone}`);

  renderDossierPatientRecords(patient);
  syncDossierVisibility();
  syncConsultationVisibility();
  hydrateConsultationSelects();
  hydrateConsultationFollowUp();

  refreshPatientRecords(patient.id).then(() => {
    const selectedPatient = getSelectedPatient();
    if (selectedPatient && String(selectedPatient.id) === String(patient.id)) {
      renderDossierPatientRecords(selectedPatient);
      hydrateConsultationSelects(selectedPatient);
      initDashboardStats();
    }
  });
}

function createPatientSearchItem(patient) {
  const item = document.createElement("button");
  item.type = "button";
  item.className = "patient-search-item";
  item.dataset.patientId = patient.id;
  item.innerHTML = `
    <span class="patient-search-avatar">${patient.initials}</span>
    <span class="patient-search-copy">
      <strong>${patient.fullName}</strong>
      <small>${patient.cmu} Â· ${patient.age}</small>
    </span>
  `;
  return item;
}

function closeAllPatientSearches() {
  document.querySelectorAll(".patient-search-shell.open").forEach((shell) => shell.classList.remove("open"));
}

function selectPatient(patient, options = {}) {
  if (!patient) return;
  const { input, selectedLabel, openDossier = false, action } = options;
  setSelectedPatient(patient.id);
  if (action) {
    saveWorkflowState({ action, patientId: patient.id, consultationSaved: action === "consultation" ? false : getWorkflowState().consultationSaved });
  }
  applyPatientData(patient);
  if (input) {
    input.value = "";
  }
  if (selectedLabel) {
    selectedLabel.textContent = `${patient.fullName} · ${patient.cmu}`;
  }
  const workflowShell = document.querySelector("[data-workflow-dossier]");
  workflowShell?.classList.remove("is-hidden");
  closeAllPatientSearches();
  syncConsultationVisibility();
  syncDossierVisibility();
  if (openDossier) {
    goToWorkflowPage("dossier-patient.html", "dossier");
  }
}

function initPatientSearch() {
  document.querySelectorAll(".patient-search-shell").forEach((shell) => {
    const input = shell.querySelector(".patient-search-input");
    const results = shell.querySelector(".patient-search-results");
    const selectedLabel = shell.querySelector(".patient-search-selected");
    if (!input || !results) return;

    const renderResults = async (query = "") => {
      await loadPatientsFromApi();
      results.innerHTML = "";
      filterPatientsByPriority(query).slice(0, 5).forEach((patient) => {
        const item = createPatientSearchItem(patient);
        item.addEventListener("click", () => {
          selectPatient(patient, { input, selectedLabel });
          input.value = "";
          shell.classList.remove("open");
        });
        results.appendChild(item);
      });

      if (!results.children.length) {
        const emptyState = document.createElement("div");
        emptyState.className = "patient-search-empty";
        emptyState.textContent = "Aucun patient trouve";
        results.appendChild(emptyState);
      }
    };

    renderResults();
    input.addEventListener("focus", () => {
      closeAllPatientSearches();
      renderResults(input.value);
      shell.classList.add("open");
    });
    input.addEventListener("input", () => {
      renderResults(input.value);
      shell.classList.add("open");
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".patient-search-shell")) {
      closeAllPatientSearches();
    }
  });
}

async function renderLookupResults(container, query, action = "dossier") {
  if (!container) return;
  await loadPatientsFromApi();
  container.innerHTML = "";
  const matches = filterPatientsByPriority(query);

  if (!query.trim()) {
    container.innerHTML = `<div class="patient-lookup-empty">Entrez le numero CMU du patient pour lancer la recherche.</div>`;
    return;
  }

  if (!matches.length) {
    container.innerHTML = `<div class="patient-lookup-empty">Aucun patient correspondant.</div>`;
    return;
  }

  matches.forEach((patient) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "patient-lookup-item";
    button.innerHTML = `
      <span class="patient-search-avatar">${patient.initials}</span>
      <span class="patient-lookup-copy">
        <strong>${patient.fullName}</strong>
        <small>${patient.cmu} Â· ${patient.age} Â· ${patient.phone}</small>
      </span>
      <span class="badge badge-teal">Choisir</span>
    `;
    button.addEventListener("click", () => {
      selectPatient(patient, { action });
      if (document.body.dataset.page === "consultation" && action === "dossier") {
        goToWorkflowPage("dossier-patient.html", "dossier");
      }
    });
    container.appendChild(button);
  });
}

async function findExactPatientMatch(query) {
  const value = String(query || "").trim();
  if (!value) return null;

  const patient = await findPatientByCmu(value);
  if (!patient) return null;

  const normalizedQuery = value.toLowerCase();
  const matchesExactly =
    String(patient.cmu || "").toLowerCase() === normalizedQuery
    || String(patient.id || "").toLowerCase() === normalizedQuery;

  return matchesExactly ? patient : null;
}

function initPatientLookup() {
  document.querySelectorAll("[data-patient-lookup]").forEach((block) => {
    const input = block.querySelector("[data-patient-lookup-input]");
    const submit = block.querySelector("[data-patient-lookup-submit]");
    const results = block.querySelector("[data-patient-lookup-results]");
    if (!input || !submit || !results) return;

    const runSearch = async () => {
      const exactPatient = await findExactPatientMatch(input.value);
      if (exactPatient) {
        selectPatient(exactPatient, { action: "dossier", input });
        goToWorkflowPage("dossier-patient.html", "dossier");
        return;
      }
      await renderLookupResults(results, input.value, "dossier");
    };
    submit.addEventListener("click", runSearch);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        runSearch();
      }
    });
  });

  document.querySelectorAll("[data-consultation-picker]").forEach((block) => {
    const input = block.querySelector("[data-patient-lookup-input]");
    const submit = block.querySelector("[data-patient-lookup-submit]");
    const results = block.querySelector("[data-patient-lookup-results]");
    if (!input || !submit || !results) return;

    const runSearch = async () => {
      const patient = await findPatientByCmu(input.value);
      results.innerHTML = "";

      if (!input.value.trim()) {
        results.innerHTML = `<div class="patient-lookup-empty">Entrez le numero CMU du patient pour lancer la recherche.</div>`;
        return;
      }

      if (patient && String(patient.cmu).toLowerCase() === input.value.trim().toLowerCase()) {
        selectPatient(patient, { action: "consultation", input });
        results.innerHTML = `
          <div class="patient-lookup-item">
            <span class="patient-search-avatar">${patient.initials}</span>
            <span class="patient-lookup-copy">
              <strong>${patient.fullName}</strong>
              <small>${patient.cmu} · ${patient.age} · ${patient.phone}</small>
            </span>
            <span class="badge badge-teal">Patient trouve</span>
          </div>
        `;
        return;
      }

      await renderLookupResults(results, input.value, "consultation");
    };
    submit.addEventListener("click", runSearch);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        runSearch();
      }
    });
  });
}

function initWorkflowActions() {
  document.querySelectorAll("[data-open-patient-dossier]").forEach((button) => {
    button.addEventListener("click", () => {
      goToWorkflowPage("dossier-patient.html", "dossier");
    });
  });

  document.querySelectorAll("[data-start-consultation]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      goToWorkflowPage("nouvelle-consultation.html", "consultation", { consultationSaved: false });
    });
  });

  document.querySelectorAll("[data-start-certificat]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      goToWorkflowPage("nouveau-certificat.html", "certificat");
    });
  });

  document.querySelectorAll("[data-after-consult-certificat]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      goToWorkflowPage("nouveau-certificat.html", "certificat");
    });
  });

  document.querySelectorAll("[data-after-consult-ordonnance]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      goToWorkflowPage("nouvelle-ordonnance.html", "ordonnance");
    });
  });
}

function initRoundBackButtons() {
  document.querySelectorAll("[data-round-back]").forEach((button) => {
    button.addEventListener("click", () => {
      const path = window.location.pathname;
      const referrerUrl = window.document.referrer ? new URL(window.document.referrer) : null;
      const hasInternalReferrer = referrerUrl && referrerUrl.origin === window.location.origin;
      const referrerPath = hasInternalReferrer ? referrerUrl.pathname : "";

      const goToReferrerOr = (fallbackPage, action) => {
        const internalTargets = [
          "/dashboard.html",
          "/dossier-patient.html",
          "/nouvelle-consultation.html",
          "/nouveau-certificat.html",
          "/nouvelle-ordonnance.html",
          "/liste-patients.html"
        ];
        if (referrerPath && internalTargets.some((target) => referrerPath.endsWith(target))) {
          window.location.href = referrerUrl.href;
          return;
        }
        goToWorkflowPage(fallbackPage, action);
      };

      if (path.endsWith("/nouvelle-consultation.html")) {
        goToWorkflowPage("dossier-patient.html", "dossier");
        return;
      }
      if (path.endsWith("/nouveau-certificat.html") || path.endsWith("/nouvelle-ordonnance.html")) {
        goToReferrerOr("dossier-patient.html", "dossier");
        return;
      }
      if (path.endsWith("/dossier-patient.html")) {
        goToWorkflowPage("dashboard.html", "dashboard");
        return;
      }
      goToReferrerOr("dashboard.html", "dashboard");
    });
  });
}

function syncConsultationVisibility() {
  const picker = document.querySelector("[data-consultation-picker]");
  const formShell = document.querySelector("[data-consultation-form-shell]");
  if (!picker || !formShell) return;
  const workflow = getWorkflowState();
  const hasPatient = Boolean(workflow.patientId || window.localStorage.getItem("medecinSelectedPatientId"));
  const shouldShowForm = hasPatient && (workflow.action === "consultation" || document.body.dataset.page === "consultation");
  picker.classList.toggle("is-hidden", shouldShowForm);
  formShell.classList.toggle("is-hidden", !shouldShowForm);
}

function syncDossierVisibility() {
  const picker = document.querySelector("[data-patient-lookup]");
  const dossierShell = document.querySelector("[data-dossier-content]");
  if (!picker || !dossierShell) return;
  const patient = getSelectedPatient();
  const shouldShowDossier = Boolean(patient) && document.body.dataset.page === "dossier";
  picker.classList.toggle("is-hidden", shouldShowDossier);
  dossierShell.classList.toggle("is-hidden", !shouldShowDossier);
}

function hydrateConsultationFollowUp() {
  const actions = document.querySelector("[data-post-consult-actions]");
  if (!actions) return;
  const workflow = getWorkflowState();
  actions.classList.toggle("is-hidden", !workflow.consultationSaved);
}

function getPatientConsultationOptions(patient = getSelectedPatient()) {
  if (!patient) return [];

  const sharedConsultations = getSharedPatientRecords(patient.id).consultations.map((item) => ({
    value: String(item.id),
    label: `${normalizeDateLabel(item.date)} - ${item.titre || item.diagnostic || "Consultation medicale"}`,
    date: item.date
  }));

  if (sharedConsultations.length) {
    return sharedConsultations.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return [{
    value: "",
    label: `${patient.lastConsultation} - ${patient.summary || "Consultation medicale"}`,
    date: "2025-03-12"
  }];
}

function hydrateConsultationSelects() {
  const options = getPatientConsultationOptions();
  if (!options.length) return;

  ["cConsult", "oConsult"].forEach((selectId) => {
    const select = document.getElementById(selectId);
    if (!select) return;

    const previousValue = select.value;
    select.innerHTML = options.map((item) => `<option value="${item.value}">${item.label}</option>`).join("");
    select.value = options.some((item) => item.value === previousValue) ? previousValue : options[0].value;
  });
}

function hydrateCurrentPatientContext() {
  const patient = getSelectedPatient();
  if (!patient) {
    syncDossierVisibility();
    syncConsultationVisibility();
    hydrateConsultationFollowUp();
    return;
  }

  applyPatientData(patient);
  hydrateConsultationSelects();
}

function initPageIdentity() {
  const path = window.location.pathname;
  if (path.endsWith("/dashboard.html")) document.body.dataset.page = "dashboard";
  if (path.endsWith("/dossier-patient.html")) document.body.dataset.page = "dossier";
  if (path.endsWith("/nouvelle-consultation.html")) document.body.dataset.page = "consultation";
  if (path.endsWith("/nouveau-certificat.html")) document.body.dataset.page = "certificat";
  if (path.endsWith("/nouvelle-ordonnance.html")) document.body.dataset.page = "ordonnance";
}

function setCert(type, el) {
  document.querySelectorAll("#certTypePills .dpill").forEach((pill) => {
    pill.classList.toggle("sel", pill === el);
  });
  const start = document.getElementById("fArretD");
  const end = document.getElementById("fArretF");
  if (start && end) {
    const visible = type === "arret";
    start.style.display = visible ? "flex" : "none";
    end.style.display = visible ? "flex" : "none";
  }
  updateCert(type);
}

function updateCert(explicitType) {
  const type = explicitType || document.querySelector("#certTypePills .dpill.sel")?.dataset.type || "apt";
  const dateValue = document.getElementById("cDate")?.value || "";
  const consultation = document.getElementById("cConsult")?.selectedOptions?.[0]?.textContent || "12/03/2025 - Fievre persistante";
  const destinataire = document.getElementById("cDest")?.value?.trim() || "A qui de droit";
  const motif = document.getElementById("cMotif")?.value || "pour raisons de sante";
  const restrictions = document.getElementById("cRestr")?.value || "";
  const titles = {
    apt: "Certificat d'aptitude au travail",
    arret: "Certificat d'arret de travail",
    dispense: "Certificat de dispense",
    general: "Certificat medical general"
  };

  fillText("#cpTitle", titles[type]);
  fillText("#cpConsult", consultation);
  fillText("#cpDest", destinataire);
  fillText("#cpDate", dateValue ? new Date(dateValue).toLocaleDateString("fr-FR") : "...");

  const main = document.getElementById("cpMain");
  if (main) {
    if (type === "arret") {
      const start = document.getElementById("arretD")?.value;
      const end = document.getElementById("arretF")?.value;
      const from = start ? new Date(start).toLocaleDateString("fr-FR") : "...";
      const to = end ? new Date(end).toLocaleDateString("fr-FR") : "...";
      main.innerHTML = `Prescrit un arret de travail du <strong>${from}</strong> au <strong>${to}</strong>, ${motif}, suite a la consultation <strong>${consultation}</strong>.`;
    } else if (type === "dispense") {
      main.innerHTML = `Delivre une dispense d'activite, ${motif}, pour le dossier issu de la consultation <strong>${consultation}</strong>.`;
    } else if (type === "general") {
      main.innerHTML = `Certifie avoir examine le patient ce jour (${motif}) dans le cadre de la consultation <strong>${consultation}</strong>.`;
    } else {
      main.innerHTML = `Et atteste que l'etat de sante de ce patient lui permet d'exercer son activite professionnelle sans restriction particuliere, apres evaluation lors de la consultation <strong>${consultation}</strong>.`;
    }
  }

  const restr = document.getElementById("cpRestr");
  if (restr) {
    restr.innerHTML = restrictions ? `<em>Restrictions : ${restrictions}</em>` : "";
  }
}

function addRow() {
  const table = document.getElementById("ordoRows");
  if (!table) return;
  const row = document.createElement("tr");
  row.innerHTML = '<td><input type="text" placeholder="Medicament" required oninput="updateOrdonnance()"></td><td><input type="text" placeholder="Dosage" required oninput="updateOrdonnance()"></td><td><select required onchange="updateOrdonnance()"><option>Oral</option><option>IV</option><option>IM</option></select></td><td><input type="number" value="1" min="1" max="6" required oninput="updateOrdonnance()"></td><td><input type="text" placeholder="Matin..." required oninput="updateOrdonnance()"></td><td><input type="number" value="7" min="1" required oninput="updateOrdonnance()"></td><td><input type="text" placeholder="Instructions" required oninput="updateOrdonnance()"></td><td><button class="btn-row-del" type="button" onclick="delRow(this)">âœ•</button></td>';
  table.appendChild(row);
  updateOrdonnance();
}

function delRow(button) {
  const rows = document.getElementById("ordoRows")?.rows;
  if (rows && rows.length > 1) {
    button.closest("tr")?.remove();
    updateOrdonnance();
  }
}

function updateOrdonnance() {
  const dateValue = document.getElementById("oDate")?.value || "";
  const consultValue = document.getElementById("oConsult")?.selectedOptions?.[0]?.textContent || "";
  const renewValue = document.getElementById("oRenew")?.value || "";
  const validityValue = document.getElementById("oValidity")?.value || "";
  const recoValue = document.getElementById("oReco")?.value?.trim() || "Repos complet, hydratation abondante...";

  fillText("#opDate", dateValue ? new Date(dateValue).toLocaleDateString("fr-FR") : "...");
  fillText("#opSignatureDate", dateValue ? new Date(dateValue).toLocaleDateString("fr-FR") : "...");
  fillText("#opConsult", consultValue || "...");
  fillText("#opRenew", renewValue || "...");
  fillText("#opValidity", validityValue || "...");
  fillHtml("#opReco", `<strong>Recommandations :</strong> ${recoValue}`);

  const previewLines = document.getElementById("opLines");
  if (!previewLines) return;
  const rows = Array.from(document.querySelectorAll("#ordoRows tr"));
  previewLines.innerHTML = rows.map((row, index) => {
    const cells = row.querySelectorAll("td");
    const medicament = cells[0]?.querySelector("input")?.value?.trim() || "Medicament";
    const dosage = cells[1]?.querySelector("input")?.value?.trim() || "Dosage";
    const voie = cells[2]?.querySelector("select")?.value || "Oral";
    const prises = cells[3]?.querySelector("input")?.value || "1";
    const moments = cells[4]?.querySelector("input")?.value?.trim() || "Moments";
    const duree = cells[5]?.querySelector("input")?.value || "1";
    const instructions = cells[6]?.querySelector("input")?.value?.trim() || "";
    return `<p>${index + 1}. ${medicament} ${dosage} - ${voie} - ${prises} prises/j (${moments}) - ${duree} jours${instructions ? ` - ${instructions}` : ""}</p>`;
  }).join("") || "<p>Aucun medicament saisi.</p>";
}

function collectOrdonnanceData() {
  const consultationSelect = document.getElementById("oConsult");
  return {
    date: document.getElementById("oDate")?.value || "",
    consultationId: consultationSelect?.value ? Number.parseInt(consultationSelect.value, 10) || null : null,
    consultation: consultationSelect?.selectedOptions?.[0]?.textContent || "",
    renouvellement: document.getElementById("oRenew")?.value || "",
    validite: document.getElementById("oValidity")?.value || "",
    recommandations: document.getElementById("oReco")?.value?.trim() || "",
    rows: Array.from(document.querySelectorAll("#ordoRows tr")).map((row) => {
      const cells = row.querySelectorAll("td");
      return {
        medicament: cells[0]?.querySelector("input")?.value?.trim() || "",
        dosage: cells[1]?.querySelector("input")?.value?.trim() || "",
        voie: cells[2]?.querySelector("select")?.value || "",
        prises: cells[3]?.querySelector("input")?.value || "",
        moments: cells[4]?.querySelector("input")?.value?.trim() || "",
        duree: cells[5]?.querySelector("input")?.value || "",
        instructions: cells[6]?.querySelector("input")?.value?.trim() || ""
      };
    })
  };
}

function collectCertificatData() {
  const consultationSelect = document.getElementById("cConsult");
  return {
    type: document.querySelector("#certTypePills .dpill.sel")?.dataset.type || "apt",
    date: document.getElementById("cDate")?.value || "",
    consultationId: consultationSelect?.value ? Number.parseInt(consultationSelect.value, 10) || null : null,
    consultation: consultationSelect?.selectedOptions?.[0]?.textContent || "",
    destinataire: document.getElementById("cDest")?.value?.trim() || "",
    motif: document.getElementById("cMotif")?.value || "",
    restrictions: document.getElementById("cRestr")?.value?.trim() || "",
    debutArret: document.getElementById("arretD")?.value || "",
    finArret: document.getElementById("arretF")?.value || ""
  };
}

function validateOrdonnanceBeforeSave() {
  clearWorkflowValidation();
  const patient = getSelectedPatient();
  if (!patient) {
    return { ok: false, message: "Veuillez d'abord selectionner un patient." };
  }

  const issues = [];
  const tracker = { firstInvalid: null };
  const dateField = document.getElementById("oDate");
  const consultationField = document.getElementById("oConsult");
  const recommandationsField = document.getElementById("oReco");

  if (!dateField?.value) addValidationIssue(issues, tracker, "date de l'ordonnance", dateField);
  if (!consultationField?.value) addValidationIssue(issues, tracker, "consultation liee", consultationField);
  if (!recommandationsField?.value?.trim()) addValidationIssue(issues, tracker, "recommandations", recommandationsField);

  const rows = Array.from(document.querySelectorAll("#ordoRows tr"));
  if (!rows.length) {
    issues.push("au moins un medicament");
  }

  rows.forEach((row, index) => {
    const suffix = rows.length > 1 ? ` (ligne ${index + 1})` : "";
    const cells = row.querySelectorAll("td");
    const medicament = cells[0]?.querySelector("input");
    const dosage = cells[1]?.querySelector("input");
    const voie = cells[2]?.querySelector("select");
    const prises = cells[3]?.querySelector("input");
    const moments = cells[4]?.querySelector("input");
    const duree = cells[5]?.querySelector("input");
    const instructions = cells[6]?.querySelector("input");

    if (!medicament?.value?.trim()) addValidationIssue(issues, tracker, `medicament${suffix}`, medicament);
    if (!dosage?.value?.trim()) addValidationIssue(issues, tracker, `dosage${suffix}`, dosage);
    if (!voie?.value?.trim()) addValidationIssue(issues, tracker, `voie${suffix}`, voie);
    if (!prises?.value || Number(prises.value) <= 0) addValidationIssue(issues, tracker, `prises/jour${suffix}`, prises);
    if (!moments?.value?.trim()) addValidationIssue(issues, tracker, `moments de prise${suffix}`, moments);
    if (!duree?.value || Number(duree.value) <= 0) addValidationIssue(issues, tracker, `duree${suffix}`, duree);
    if (!instructions?.value?.trim()) addValidationIssue(issues, tracker, `instructions${suffix}`, instructions);
  });

  focusFirstInvalidField(tracker);
  return buildValidationResult("Veuillez renseigner les champs obligatoires de l'ordonnance :", issues);
}

function validateCertificatBeforeSave() {
  clearWorkflowValidation();
  const patient = getSelectedPatient();
  if (!patient) {
    return { ok: false, message: "Veuillez d'abord selectionner un patient." };
  }

  const issues = [];
  const tracker = { firstInvalid: null };
  const type = document.querySelector("#certTypePills .dpill.sel")?.dataset.type || "apt";
  const dateField = document.getElementById("cDate");
  const consultationField = document.getElementById("cConsult");
  const destinataireField = document.getElementById("cDest");
  const motifField = document.getElementById("cMotif");
  const restrictionsField = document.getElementById("cRestr");
  const debutArretField = document.getElementById("arretD");
  const finArretField = document.getElementById("arretF");

  if (!dateField?.value) addValidationIssue(issues, tracker, "date du certificat", dateField);
  if (!consultationField?.value) addValidationIssue(issues, tracker, "consultation liee", consultationField);
  if (!destinataireField?.value?.trim()) addValidationIssue(issues, tracker, "destinataire", destinataireField);
  if (!motifField?.value?.trim()) addValidationIssue(issues, tracker, "motif medical", motifField);
  if (!restrictionsField?.value?.trim()) addValidationIssue(issues, tracker, "restrictions", restrictionsField);

  if (type === "arret") {
    if (!debutArretField?.value) addValidationIssue(issues, tracker, "date de debut d'arret", debutArretField);
    if (!finArretField?.value) addValidationIssue(issues, tracker, "date de fin d'arret", finArretField);
    if (debutArretField?.value && finArretField?.value && finArretField.value < debutArretField.value) {
      addValidationIssue(issues, tracker, "coherence des dates d'arret", finArretField);
    }
  }

  focusFirstInvalidField(tracker);
  return buildValidationResult("Veuillez renseigner les champs obligatoires du certificat :", issues);
}

function validateConsultationBeforeSave() {
  clearWorkflowValidation();
  const patient = getSelectedPatient();
  if (!patient) {
    return { ok: false, message: "Veuillez d'abord selectionner un patient." };
  }

  const issues = [];
  const tracker = { firstInvalid: null };
  const motifField = document.getElementById("consult-motif");
  const symptomesField = document.getElementById("consult-symptomes");
  const taField = document.getElementById("consult-ta");
  const temperatureField = document.getElementById("consult-temperature");
  const fcField = document.getElementById("consult-fc");
  const spo2Field = document.getElementById("consult-spo2");
  const diagnosticField = document.getElementById("consult-diagnostic");
  const traitementField = document.getElementById("consult-traitement");

  if (!motifField?.value?.trim()) addValidationIssue(issues, tracker, "motif principal", motifField);
  if (!symptomesField?.value?.trim()) addValidationIssue(issues, tracker, "symptomes", symptomesField);
  if (!taField?.value?.trim() || !/^\d+\s*\/\s*\d+$/.test(taField.value.trim())) addValidationIssue(issues, tracker, "tension arterielle (format 120/80)", taField);
  if (!temperatureField?.value || Number.isNaN(Number(temperatureField.value)) || Number(temperatureField.value) <= 0) addValidationIssue(issues, tracker, "temperature", temperatureField);
  if (!fcField?.value || Number.isNaN(Number(fcField.value)) || Number(fcField.value) <= 0) addValidationIssue(issues, tracker, "frequence cardiaque", fcField);
  if (!spo2Field?.value || Number.isNaN(Number(spo2Field.value)) || Number(spo2Field.value) <= 0) addValidationIssue(issues, tracker, "SpO2", spo2Field);
  if (!diagnosticField?.value?.trim()) addValidationIssue(issues, tracker, "diagnostic retenu", diagnosticField);
  if (!traitementField?.value?.trim()) addValidationIssue(issues, tracker, "plan de traitement", traitementField);

  focusFirstInvalidField(tracker);
  return buildValidationResult("Veuillez renseigner les champs obligatoires de la consultation :", issues);
}

function collectConsultationData() {
  const patient = getSelectedPatient();
  if (!patient) return null;
  const taValue = document.getElementById("consult-ta")?.value?.trim() || "";
  const [taSys, taDia] = taValue.split("/").map((part) => Number.parseInt(part?.trim() || "", 10));
  const temperature = Number.parseFloat(document.getElementById("consult-temperature")?.value || "");
  const fc = Number.parseInt(document.getElementById("consult-fc")?.value || "", 10);
  const spo2 = Number.parseInt(document.getElementById("consult-spo2")?.value || "", 10);

  return {
    id: createRecordId("consult"),
    patientId: patient.id,
    date: getTodayIsoDate(),
    heure: getCurrentTimeLabel(),
    titre: document.getElementById("consult-motif")?.value?.trim() || "",
    etablissement: "MediBook",
    medecin: MEDECIN_SESSION.name,
    specialite: MEDECIN_SESSION.specialty,
    statut: "terminee",
    symptomes: document.getElementById("consult-symptomes")?.value?.trim() || "",
    diagnostic: document.getElementById("consult-diagnostic")?.value?.trim() || "",
    traitement: document.getElementById("consult-traitement")?.value?.trim() || "",
    observations: document.getElementById("consult-observations")?.value?.trim() || "",
    medecinId: MEDECIN_API_CONTEXT.medecinId,
    vitals: {
      taSys: Number.isFinite(taSys) ? taSys : null,
      taDia: Number.isFinite(taDia) ? taDia : null,
      temp: Number.isFinite(temperature) ? temperature : null,
      fc: Number.isFinite(fc) ? fc : null,
      spo2: Number.isFinite(spo2) ? spo2 : null
    }
  };
}

async function saveValidatedConsultation(payload) {
  const medecinId = await loadCurrentMedecinContext();
  let savedPayload = payload;
  const numericPatientId = Number.parseInt(payload.patientId, 10);

  if (medecinId && Number.isFinite(numericPatientId)) {
    const response = await apiFetchJson("/medecins/consultations", {
      method: "POST",
      body: JSON.stringify({
        patientId: numericPatientId,
        medecinId,
        dateConsultation: payload.date,
        heureConsultation: payload.heure?.length === 5 ? `${payload.heure}:00` : null,
        motifPrincipal: payload.titre,
        symptomes: payload.symptomes,
        diagnostic: payload.diagnostic,
        traitement: payload.traitement,
        observations: payload.observations,
        tensionSystolique: payload.vitals.taSys,
        tensionDiastolique: payload.vitals.taDia,
        temperature: payload.vitals.temp,
        frequenceCardiaque: payload.vitals.fc,
        spo2: payload.vitals.spo2
      })
    });
    savedPayload = normalizeConsultationFromApi(response);
  }

  appendSharedRecord("consultations", savedPayload);
  appendSharedRecord("vitals", {
    id: `vital-${savedPayload.id}`,
    patientId: savedPayload.patientId,
    date: savedPayload.date,
    heure: savedPayload.heure,
    taSys: savedPayload.vitals.taSys,
    taDia: savedPayload.vitals.taDia,
    temp: savedPayload.vitals.temp,
    fc: savedPayload.vitals.fc,
    spo2: savedPayload.vitals.spo2,
    poids: 0,
    taille: 0,
    glycemie: 0,
    fr: 0,
    source: "medecin",
    auteur: MEDECIN_SESSION.name
  });
  appendSharedRecord("timeline", {
    id: `timeline-${savedPayload.id}`,
    patientId: savedPayload.patientId,
    date: savedPayload.date,
    titre: savedPayload.titre,
    detail: savedPayload.diagnostic,
    source: "medecin"
  });

  await refreshPatientRecords(savedPayload.patientId);
  return savedPayload;
}

async function saveValidatedOrdonnance(payload) {
  const patient = getSelectedPatient();
  const medecinId = await loadCurrentMedecinContext();
  let ordonnance = {
    id: createRecordId("ordo").toUpperCase(),
    patientId: patient.id,
    date: payload.date,
    statut: "active",
    medecin: MEDECIN_SESSION.name,
    specialite: MEDECIN_SESSION.specialty,
    medicaments: payload.rows.filter((row) => row.medicament).map((row) =>
      `${row.medicament} ${row.dosage} - ${row.prises}x/j - ${row.duree} jours${row.instructions ? ` - ${row.instructions}` : ""}`
    ),
    recommandations: payload.recommandations,
    consultationId: payload.consultationId ? String(payload.consultationId) : "",
    consultation: payload.consultation
  };

  if (medecinId) {
    const response = await apiFetchJson("/medecins/ordonnances", {
      method: "POST",
      body: JSON.stringify({
        patientId: Number.parseInt(patient.id, 10),
        medecinId,
        consultationId: payload.consultationId,
        datePrescription: payload.date,
        statut: "active",
        renouvellement: payload.renouvellement,
        validiteJours: Number.parseInt(payload.validite, 10) || null,
        recommandations: payload.recommandations,
        medicaments: payload.rows
          .filter((row) => row.medicament)
          .map((row) => ({
            nom: row.medicament,
            dosage: row.dosage,
            voie: row.voie,
            prisesParJour: Number.parseInt(row.prises, 10) || null,
            moments: row.moments,
            dureeJours: Number.parseInt(row.duree, 10) || null,
            instructions: row.instructions
          }))
      })
    });
    ordonnance = normalizeOrdonnanceFromApi(response);
  }

  appendSharedRecord("ordonnances", ordonnance);
  appendSharedRecord("documents", {
    id: `doc-${ordonnance.id}`,
    patientId: patient.id,
    categorie: "ordonnance",
    nom: `Ordonnance ${ordonnance.id}`,
    date: ordonnance.date,
    source: MEDECIN_SESSION.name,
    format: "PDF",
    consultationId: ordonnance.consultationId || "",
    medecin: ordonnance.medecin || MEDECIN_SESSION.name,
    specialite: ordonnance.specialite || MEDECIN_SESSION.specialty,
    recommandations: ordonnance.recommandations || "",
    medicaments: [...(ordonnance.medicaments || [])]
  });

  await refreshPatientRecords(patient.id);
  return ordonnance;
}

async function saveValidatedCertificat(payload) {
  const patient = getSelectedPatient();
  const medecinId = await loadCurrentMedecinContext();
  let certificatRecord = {
    id: createRecordId("cert"),
    patientId: patient.id,
    date: payload.date,
    type: payload.type,
    destinataire: payload.destinataire,
    motif: payload.motif,
    restrictions: payload.restrictions,
    consultationId: payload.consultationId ? String(payload.consultationId) : "",
    debutArret: payload.debutArret,
    finArret: payload.finArret
  };

  if (medecinId) {
    const response = await apiFetchJson("/medecins/certificats", {
      method: "POST",
      body: JSON.stringify({
        patientId: Number.parseInt(patient.id, 10),
        medecinId,
        consultationId: payload.consultationId,
        dateCertificat: payload.date,
        type: payload.type,
        destinataire: payload.destinataire,
        motif: payload.motif,
        restrictions: payload.restrictions,
        debutArret: payload.debutArret || null,
        finArret: payload.finArret || null
      })
    });
    certificatRecord = normalizeCertificatFromApi(response);
  }

  appendSharedRecord("certificats", certificatRecord);
  appendSharedRecord("documents", {
    id: `doc-${certificatRecord.id}`,
    patientId: patient.id,
    categorie: "certificat",
    nom: `Certificat ${payload.type}`,
    date: certificatRecord.date,
    source: MEDECIN_SESSION.name,
    format: "PDF",
    consultation: payload.consultation,
    consultationId: certificatRecord.consultationId || "",
    type: certificatRecord.type,
    destinataire: certificatRecord.destinataire,
    motif: certificatRecord.motif,
    restrictions: certificatRecord.restrictions,
    debutArret: certificatRecord.debutArret,
    finArret: certificatRecord.finArret
  });
  appendSharedRecord("timeline", {
    id: createRecordId("timeline-cert"),
    patientId: patient.id,
    date: payload.date,
    titre: "Certificat medical",
    detail: `${payload.type} - ${payload.motif || "Document valide"}`,
    source: "medecin"
  });

  await refreshPatientRecords(patient.id);
  return certificatRecord;
}

function renderDossierPatientRecords(patient = getSelectedPatient()) {
  const consultRoot = document.getElementById("dtab-consult");
  const ordonnanceRoot = document.getElementById("dtab-ordo");
  const certificatRoot = document.getElementById("dtab-cert");
  const vitalsRoot = document.getElementById("dtab-vit");
  if (!consultRoot && !ordonnanceRoot && !certificatRoot && !vitalsRoot) return;
  if (!patient) return;

  const shared = getSharedPatientRecords(patient.id);
  const consultationItems = shared.consultations.length ? shared.consultations : [{
    id: "fallback-consultation",
    date: "2025-03-12",
    titre: `${patient.summary} - Suivi`,
    diagnostic: "Consultation precedente du dossier.",
    vitals: { taSys: 130, taDia: 85, temp: 39.2, fc: 98, spo2: 97 }
  }];
  const latestVital = shared.vitals[0] || consultationItems[0]?.vitals;
  const ordonnanceItems = shared.ordonnances.length ? shared.ordonnances : [{
    id: "ORD-STATIC",
    date: "2025-03-12",
    medicaments: [
      "Artemether/Lumefantrine - 80/480mg - 2x/j - 3 jours",
      "Paracetamol - 1000mg - 3x/j - 5 jours"
    ]
  }];
  const certificatItems = shared.certificats.length ? shared.certificats : [{
    id: "CERT-STATIC",
    date: "2025-03-12",
    type: "apt",
    motif: "Certificat medical disponible",
    destinataire: "A qui de droit"
  }];

  if (consultRoot) {
    consultRoot.innerHTML = consultationItems.map((item) => {
      const date = new Date(item.date);
      const day = String(date.getDate()).padStart(2, "0");
      const month = new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(date);
      const vitals = item.vitals || latestVital || {};
      return `
        <div class="consult-item">
          <div class="consult-date-box">
            <div class="consult-date-d">${day}</div>
            <div class="consult-date-m">${month}</div>
          </div>
          <div class="flex-1">
            <div class="consult-title">${item.titre}</div>
            <div class="consult-sub">TA: ${vitals.taSys || "--"}/${vitals.taDia || "--"} Â· TÂ°: ${vitals.temp || "--"}Â°C Â· FC: ${vitals.fc || "--"} bpm</div>
            <div class="consult-sub">${item.diagnostic || ""}</div>
          </div>
          <button class="btn btn-secondary btn-sm" type="button" data-open-dossier-consultation="${item.id}">Voir details</button>
        </div>
      `;
    }).join("");
  }

  if (ordonnanceRoot) {
    const latestOrdonnance = ordonnanceItems[0];
    ordonnanceRoot.innerHTML = `
      <div class="card">
        <div class="card-title mb-16">Ordonnance - ${latestOrdonnance.date}</div>
        <div class="table-wrap" style="border:none">
          <table>
            <thead><tr><th>Medicament</th><th>Detail</th></tr></thead>
            <tbody>
              ${latestOrdonnance.medicaments.map((line) => `<tr><td>${line.split(" - ")[0]}</td><td>${line.split(" - ").slice(1).join(" - ")}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
        <div class="mt-8"><button class="btn btn-secondary btn-sm" type="button" data-dossier-ordonnance-pdf>PDF</button></div>
      </div>
    `;
  }

  if (certificatRoot) {
    certificatRoot.innerHTML = certificatItems.map((item) => `
      <div class="consult-item">
        <div class="consult-date-box">
          <div class="consult-date-d">${String(new Date(item.date).getDate()).padStart(2, "0")}</div>
          <div class="consult-date-m">${new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(new Date(item.date))}</div>
        </div>
        <div class="flex-1">
          <div class="consult-title">Certificat ${item.type || "medical"}</div>
          <div class="consult-sub">${item.destinataire || "A qui de droit"}</div>
          <div class="consult-sub">${item.motif || "Document medical enregistre"}</div>
        </div>
        <button class="btn btn-secondary btn-sm" type="button" data-open-dossier-certificat="${item.id}">Voir details</button>
      </div>
    `).join("");
  }

  if (vitalsRoot) {
    const vital = latestVital || { taSys: 145, taDia: 92, temp: 37.1, fc: 78, spo2: 97 };
    const warnTA = Number(vital.taSys) > 140 || Number(vital.taDia) > 90;
    vitalsRoot.innerHTML = `
      <div class="vital-grid">
        <div class="vital-card ${warnTA ? "warning" : ""}">
          <div class="vital-icon">ðŸ©¸</div>
          <div class="vital-val">${vital.taSys}/${vital.taDia}</div>
          <div class="vital-lbl">Tension (mmHg)</div>
        </div>
        <div class="vital-card">
          <div class="vital-icon">ðŸŒ¡</div>
          <div class="vital-val">${vital.temp}Â°C</div>
          <div class="vital-lbl">Temperature</div>
        </div>
        <div class="vital-card">
          <div class="vital-icon">â¤</div>
          <div class="vital-val">${vital.fc} bpm</div>
          <div class="vital-lbl">Frequence cardiaque</div>
        </div>
        <div class="vital-card">
          <div class="vital-icon">ðŸ’¨</div>
          <div class="vital-val">${vital.spo2}%</div>
          <div class="vital-lbl">SpO2</div>
        </div>
      </div>
    `;
  }
}

function getConsultationLinkedRecords(patientId, consultationId) {
  const shared = getSharedPatientRecords(patientId);
  return {
    ordonnances: shared.ordonnances.filter((item) => String(item.consultationId || "") === String(consultationId || "")),
    certificats: shared.certificats.filter((item) => String(item.consultationId || "") === String(consultationId || ""))
  };
}

function openDossierDetailModal(title, subtitle, sections) {
  const overlay = document.querySelector("[data-dossier-detail-modal]");
  if (!overlay) return;
  fillText("[data-dossier-detail-title]", title);
  fillText("[data-dossier-detail-subtitle]", subtitle);
  fillHtml("[data-dossier-detail-body]", sections.join(""));
  overlay.classList.add("open");
}

function closeDossierDetailModal() {
  document.querySelector("[data-dossier-detail-modal]")?.classList.remove("open");
}

function openConsultationDetailFromDossier(consultationId) {
  const patient = getSelectedPatient();
  if (!patient) return;
  const shared = getSharedPatientRecords(patient.id);
  const fallbackConsultation = {
    id: "fallback-consultation",
    date: "2025-03-12",
    titre: `${patient.summary} - Suivi`,
    diagnostic: "Consultation precedente du dossier.",
    symptomes: patient.summary || "Symptomes non renseignes",
    traitement: "Traitement non detaille dans l'historique.",
    observations: "Historique simplifie du dossier patient.",
    vitals: shared.vitals[0] || { taSys: 130, taDia: 85, temp: 39.2, fc: 98, spo2: 97 }
  };
  const consultation = shared.consultations.find((item) => String(item.id) === String(consultationId))
    || (String(consultationId) === "fallback-consultation" ? fallbackConsultation : null);
  if (!consultation) return;

  const linked = String(consultation.id) === "fallback-consultation"
    ? { ordonnances: shared.ordonnances, certificats: shared.certificats }
    : getConsultationLinkedRecords(patient.id, consultation.id);
  const vitals = consultation.vitals || {};
  const sections = [
    `
      <div class="info-stack">
        <div><strong>Medecin</strong><p>${escapeHtml(`${consultation.medecin || MEDECIN_SESSION.name} · ${consultation.specialite || MEDECIN_SESSION.specialty}`)}</p></div>
        <div><strong>Etablissement</strong><p>${escapeHtml(consultation.etablissement || "MediBook")}</p></div>
        <div><strong>Symptomes</strong><p>${escapeHtml(consultation.symptomes || "Non renseignes")}</p></div>
        <div><strong>Diagnostic</strong><p>${escapeHtml(consultation.diagnostic || "Non renseigne")}</p></div>
        <div><strong>Traitement</strong><p>${escapeHtml(consultation.traitement || "Non renseigne")}</p></div>
        <div><strong>Observations</strong><p>${escapeHtml(consultation.observations || "Aucune observation complementaire")}</p></div>
        <div><strong>Constantes</strong><p>${escapeHtml(`TA ${vitals.taSys || "--"}/${vitals.taDia || "--"} · Temperature ${vitals.temp || "--"}°C · FC ${vitals.fc || "--"} bpm · SpO2 ${vitals.spo2 || "--"}%`)}</p></div>
      </div>
    `
  ];

  sections.push(`
    <div class="info-stack">
      <div><strong>Ordonnances liees</strong><p>${linked.ordonnances.length ? escapeHtml(linked.ordonnances.map((item) => `${item.id} · ${normalizeDateLabel(item.date)}`).join(" | ")) : "Aucune ordonnance liee a cette consultation."}</p></div>
      <div><strong>Certificats lies</strong><p>${linked.certificats.length ? escapeHtml(linked.certificats.map((item) => `${item.type || "medical"} · ${normalizeDateLabel(item.date)}`).join(" | ")) : "Aucun certificat lie a cette consultation."}</p></div>
    </div>
  `);

  openDossierDetailModal(
    consultation.titre || "Consultation medicale",
    `${normalizeDateLabel(consultation.date)}${consultation.heure ? ` a ${consultation.heure}` : ""}`,
    sections
  );
}

function openCertificatDetailFromDossier(certificatId) {
  const patient = getSelectedPatient();
  if (!patient) return;
  const shared = getSharedPatientRecords(patient.id);
  const certificat = shared.certificats.find((item) => String(item.id) === String(certificatId))
    || (String(certificatId) === "CERT-STATIC"
      ? {
          id: "CERT-STATIC",
          date: "2025-03-12",
          type: "apt",
          destinataire: "A qui de droit",
          motif: "Certificat medical disponible",
          restrictions: ""
        }
      : null);
  if (!certificat) return;

  openDossierDetailModal(
    `Certificat ${certificat.type || "medical"}`,
    normalizeDateLabel(certificat.date),
    [`
      <div class="info-stack">
        <div><strong>Destinataire</strong><p>${escapeHtml(certificat.destinataire || "A qui de droit")}</p></div>
        <div><strong>Motif</strong><p>${escapeHtml(certificat.motif || "Document medical enregistre")}</p></div>
        <div><strong>Restrictions</strong><p>${escapeHtml(certificat.restrictions || "Aucune restriction renseignee")}</p></div>
        <div><strong>Periode d'arret</strong><p>${escapeHtml(certificat.debutArret || certificat.finArret ? `${certificat.debutArret || "--"} au ${certificat.finArret || "--"}` : "Non applicable")}</p></div>
      </div>
    `]
  );
}

function initDossierDetailInteractions() {
  document.addEventListener("click", (event) => {
    const consultationButton = event.target.closest("[data-open-dossier-consultation]");
    if (consultationButton) {
      openConsultationDetailFromDossier(consultationButton.dataset.openDossierConsultation);
      return;
    }

    const certificatButton = event.target.closest("[data-open-dossier-certificat]");
    if (certificatButton) {
      openCertificatDetailFromDossier(certificatButton.dataset.openDossierCertificat);
      return;
    }

    if (event.target.closest("[data-close-dossier-detail-modal]")) {
      closeDossierDetailModal();
    }
  });

  document.querySelector("[data-dossier-detail-modal]")?.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      closeDossierDetailModal();
    }
  });
}

function initConsultationVitalsSync() {
  const taInput = document.getElementById("consult-ta");
  const temperatureInput = document.getElementById("consult-temperature");
  const fcInput = document.getElementById("consult-fc");
  const spo2Input = document.getElementById("consult-spo2");
  if (!taInput || !temperatureInput || !fcInput || !spo2Input) return;

  const updateVitalsPreview = () => {
    const taValue = taInput.value.trim() || taInput.placeholder || "--/--";
    const temperature = temperatureInput.value.trim() || temperatureInput.placeholder || "--.-";
    const fc = fcInput.value.trim() || fcInput.placeholder || "--";
    const spo2 = spo2Input.value.trim() || spo2Input.placeholder || "--";

    fillText("[data-consult-vital='tension']", taValue);
    fillText("[data-consult-vital='temperature']", `${temperature}Â°C`);
    fillText("[data-consult-vital='fc']", `${fc} bpm`);
    fillText("[data-consult-vital='spo2']", `${spo2}%`);

    const [taSys, taDia] = taValue.split("/").map((part) => Number.parseInt(part?.trim() || "", 10));
    const tensionWarning = Number.isFinite(taSys) && Number.isFinite(taDia) && (taSys > 140 || taDia > 90);
    document.querySelector("[data-vital-card='tension']")?.classList.toggle("warning", tensionWarning);
    fillText("[data-consult-vital-label='tension']", tensionWarning ? "Tension en alerte" : "Tension");
    document.querySelector("[data-vital-card='temperature']")?.classList.toggle("warning", Number.parseFloat(temperature) >= 38);
    document.querySelector("[data-vital-card='fc']")?.classList.toggle("warning", Number.parseInt(fc, 10) > 100);
    document.querySelector("[data-vital-card='spo2']")?.classList.toggle("warning", Number.parseInt(spo2, 10) < 95);
  };

  [taInput, temperatureInput, fcInput, spo2Input].forEach((input) => {
    input.addEventListener("input", updateVitalsPreview);
    input.addEventListener("change", updateVitalsPreview);
  });
  updateVitalsPreview();
}

function initOrdonnanceActions() {
  const draftButton = document.getElementById("ordoDraftBtn");
  const pdfButton = document.getElementById("ordoPdfBtn");
  const printButton = document.getElementById("ordoPrintBtn");
  const validateButton = document.getElementById("ordoValidateBtn");
  if (!draftButton && !pdfButton && !printButton && !validateButton) return;

  const printOnlyPreview = () => {
    document.body.classList.add("print-ordonnance-preview");
    window.print();
  };
  window.addEventListener("afterprint", () => {
    document.body.classList.remove("print-ordonnance-preview");
  });

  draftButton?.addEventListener("click", () => {
    window.localStorage.setItem("ordonnanceDraft", JSON.stringify(collectOrdonnanceData()));
    window.alert("Brouillon d'ordonnance enregistre.");
  });
  pdfButton?.addEventListener("click", printOnlyPreview);
  printButton?.addEventListener("click", printOnlyPreview);
  validateButton?.addEventListener("click", async () => {
    const validation = validateOrdonnanceBeforeSave();
    if (!validation.ok) {
      window.alert(validation.message);
      return;
    }
    try {
      const payload = collectOrdonnanceData();
      const savedPayload = await saveValidatedOrdonnance(payload);
      window.localStorage.setItem("lastValidatedOrdonnance", JSON.stringify(savedPayload));
      applyPatientData(getSelectedPatient());
      window.alert("Ordonnance enregistree dans la base de donnees.");
    } catch (error) {
      console.error(error);
      window.alert(error.message || "Impossible d'enregistrer l'ordonnance pour le moment.");
    }
  });
}

function initCertificatActions() {
  const draftButton = document.getElementById("certDraftBtn");
  const pdfButton = document.getElementById("certPdfBtn");
  const printButton = document.getElementById("certPrintBtn");
  const validateButton = document.getElementById("certValidateBtn");
  if (!draftButton && !pdfButton && !printButton && !validateButton) return;

  const printOnlyPreview = () => {
    document.body.classList.add("print-certificat-preview");
    window.print();
  };
  window.addEventListener("afterprint", () => {
    document.body.classList.remove("print-certificat-preview");
  });

  draftButton?.addEventListener("click", () => {
    window.localStorage.setItem("certificatDraft", JSON.stringify(collectCertificatData()));
    window.alert("Brouillon de certificat enregistre.");
  });
  pdfButton?.addEventListener("click", printOnlyPreview);
  printButton?.addEventListener("click", printOnlyPreview);
  validateButton?.addEventListener("click", async () => {
    const validation = validateCertificatBeforeSave();
    if (!validation.ok) {
      window.alert(validation.message);
      return;
    }
    try {
      const payload = collectCertificatData();
      const savedPayload = await saveValidatedCertificat(payload);
      window.localStorage.setItem("lastValidatedCertificat", JSON.stringify(savedPayload));
      applyPatientData(getSelectedPatient());
      window.alert("Certificat enregistre dans la base de donnees.");
    } catch (error) {
      console.error(error);
      window.alert(error.message || "Impossible d'enregistrer le certificat pour le moment.");
    }
  });
}

function initConsultationActions() {
  const draftButton = document.querySelector("[data-consultation-draft]");
  const validateButton = document.querySelector("[data-consultation-validate]");

  draftButton?.addEventListener("click", () => {
    const patient = getSelectedPatient();
    if (!patient) {
      window.alert("Veuillez d'abord selectionner un patient.");
      return;
    }
    const payload = {
      patientId: patient.id,
      motif: document.querySelector("#ct1 input[type='text']")?.value || "",
      diagnostic: document.querySelector("#ct3 textarea")?.value || "",
      traitement: document.querySelector("#ct4 textarea")?.value || ""
    };
    window.localStorage.setItem("consultationDraft", JSON.stringify(payload));
    window.alert("Brouillon de consultation enregistre.");
  });

  validateButton?.addEventListener("click", async () => {
    const validation = validateConsultationBeforeSave();
    if (!validation.ok) {
      window.alert(validation.message);
      return;
    }
    const consultationData = collectConsultationData();
    if (!consultationData) {
      window.alert("Veuillez d'abord selectionner un patient.");
      return;
    }
    try {
      const payload = { ...consultationData, validatedAt: new Date().toISOString() };
      const savedPayload = await saveValidatedConsultation(payload);
      window.localStorage.setItem("lastValidatedConsultation", JSON.stringify(savedPayload));
      saveWorkflowState({
        patientId: savedPayload.patientId,
        action: "consultation",
        consultationSaved: true,
        lastConsultationId: savedPayload.id
      });
      hydrateConsultationFollowUp();
      applyPatientData(getSelectedPatient());
      window.alert("Consultation enregistree dans la base de donnees. Vous pouvez maintenant creer un certificat ou une ordonnance.");
    } catch (error) {
      console.error(error);
      window.alert(error.message || "Impossible d'enregistrer la consultation pour le moment.");
    }
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-dossier-ordonnance-pdf]");
    if (!button) return;
    const patient = getSelectedPatient();
    const content = [
      "MediBook - Ordonnance du dossier patient",
      `Patient: ${patient.fullName}`,
      `CMU: ${patient.cmu}`,
      "",
      "Document genere depuis le dossier patient."
    ].join("\n");
    triggerFileDownload(`${sanitizeFilename(`ordonnance-${patient.fullName}`)}.txt`, content);
  });
}

function renderMedecinNotificationsMenu(menu) {
  if (!menu) return;
  menu.innerHTML = `
    <div class="notif-menu-head">
      <strong>Notifications medecin</strong>
      <span>${MEDECIN_NOTIFICATIONS.length} element(s) a consulter</span>
    </div>
    <div class="notif-menu-list">
      ${MEDECIN_NOTIFICATIONS.map((item) => `
        <article class="notif-item">
          <div class="notif-item-head">
            <div class="notif-item-title">${item.title}</div>
            <div class="notif-item-time">${item.time}</div>
          </div>
          <div class="notif-item-copy">${item.body}</div>
          <div class="notif-item-meta">
            <span class="notif-item-tag">${item.tag}</span>
            <span class="badge badge-amber">A traiter</span>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function activateConsultationStep(wrapper, step) {
  const targetStep = String(step);
  wrapper.querySelectorAll(".tab-btn").forEach((button) => {
    if (button.dataset.step) {
      button.classList.toggle("active", button.dataset.step === targetStep);
    }
  });
  wrapper.querySelectorAll(".tab-content").forEach((panel) => {
    if (panel.dataset.step) {
      panel.classList.toggle("active", panel.dataset.step === targetStep);
    }
  });
  document.querySelectorAll("[data-consultation-steps] .step-item").forEach((item) => {
    const itemStep = Number(item.dataset.step);
    const dot = item.querySelector(".step-dot");
    item.classList.remove("active", "done");
    if (itemStep < Number(step)) {
      item.classList.add("done");
      if (dot) dot.textContent = "âœ“";
    } else if (itemStep === Number(step)) {
      item.classList.add("active");
      if (dot) dot.textContent = String(itemStep);
    } else if (dot) {
      dot.textContent = String(itemStep);
    }
  });
}

function initTabs() {
  document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const wrapper = button.closest("[data-tabs]") || button.closest("section[data-tabs]");
      if (!wrapper) return;
      if (button.dataset.step) {
        activateConsultationStep(wrapper, button.dataset.step || "1");
        return;
      }
      wrapper.querySelectorAll(".tab-btn").forEach((node) => node.classList.remove("active"));
      wrapper.querySelectorAll(".tab-content").forEach((node) => node.classList.remove("active"));
      button.classList.add("active");
      wrapper.querySelector(`#${button.dataset.target}`)?.classList.add("active");
    });
  });

  document.querySelectorAll(".consult-nav").forEach((button) => {
    button.addEventListener("click", () => {
      const wrapper = button.closest("[data-tabs]");
      const activeButton = wrapper?.querySelector(".tab-btn.active[data-step]");
      if (!wrapper || !activeButton) return;
      const currentStep = Number(activeButton.dataset.step || "1");
      const direction = button.dataset.direction === "prev" ? -1 : 1;
      activateConsultationStep(wrapper, Math.min(4, Math.max(1, currentStep + direction)));
    });
  });
}

function initSelectableChips() {
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => chip.classList.toggle("sel"));
  });
  document.querySelectorAll("#ct3 .dpill").forEach((pill) => {
    pill.addEventListener("click", () => {
      pill.parentElement?.querySelectorAll(".dpill").forEach((node) => node.classList.remove("sel"));
      pill.classList.add("sel");
    });
  });
}

function initTopbarActions() {
  document.querySelectorAll("[data-action='notifications']").forEach((button) => {
    button.classList.remove("icon-btn-badge");
    button.classList.add("icon-btn-count");
    button.setAttribute("data-count", String(MEDECIN_NOTIFICATION_COUNT));
    if (!button.parentElement?.classList.contains("notif-shell")) {
      const shell = document.createElement("div");
      shell.className = "notif-shell";
      button.parentNode?.insertBefore(shell, button);
      shell.appendChild(button);
      const menu = document.createElement("div");
      menu.className = "notif-menu";
      shell.appendChild(menu);
      renderMedecinNotificationsMenu(menu);
    }
    button.addEventListener("click", () => {
      button.parentElement?.classList.toggle("open");
    });
  });

  document.addEventListener("click", (event) => {
    document.querySelectorAll(".notif-shell").forEach((shell) => {
      if (!shell.contains(event.target)) {
        shell.classList.remove("open");
      }
    });
  });

  document.querySelectorAll("[data-action='logout']").forEach((button) => {
    button.addEventListener("click", () => {
      if (window.confirm("Voulez-vous vous deconnecter ?")) {
        window.location.href = "../login.html";
      }
    });
  });
}

function initMedecinSessionUi() {
  fillText("[data-medecin-name]", MEDECIN_SESSION.name);
  fillText("[data-medecin-role]", MEDECIN_SESSION.role);
  fillText("[data-medecin-specialty]", MEDECIN_SESSION.specialty);
  fillText("[data-medecin-initials]", MEDECIN_SESSION.initials);
  fillText("[data-medecin-phone]", MEDECIN_SESSION.phone);
  fillText("[data-medecin-email]", MEDECIN_SESSION.email);
  fillText("[data-medecin-matricule]", MEDECIN_SESSION.matricule);
  fillText("[data-medecin-cmu]", MEDECIN_SESSION.cmu || "Non renseigne");
  fillText("[data-medecin-sexe]", MEDECIN_SESSION.sexe || "Non renseigne");
  fillText("[data-medecin-birthdate]", MEDECIN_SESSION.dateNaissance ? formatBirthDate(MEDECIN_SESSION.dateNaissance) : "Non renseignee");
  fillText("[data-medecin-bio]", MEDECIN_SESSION.bio);

  document.querySelectorAll("[data-medecin-avatar]").forEach((node) => {
    if (MEDECIN_SESSION.avatar) {
      node.style.backgroundImage = `url(${MEDECIN_SESSION.avatar})`;
      node.style.backgroundSize = "cover";
      node.style.backgroundPosition = "center";
      node.textContent = "";
    } else {
      node.style.backgroundImage = "";
      node.textContent = MEDECIN_SESSION.initials;
    }
  });
}

async function initDashboardStats() {
  const cards = document.querySelector("[data-dashboard-stats]");
  if (!cards) return;
  const today = getTodayIsoDate();
  let consultations = MEDECIN_CONSULTATIONS;
  let ordonnances = MEDECIN_ORDONNANCES;
  let certificats = MEDECIN_CERTIFICATS;

  try {
    consultations = await apiFetchJson("/medecins/consultations");
    ordonnances = await apiFetchJson("/medecins/ordonnances");
    certificats = await apiFetchJson("/medecins/certificats");
  } catch (error) {
    console.error(error);
  }

  const todayConsultations = consultations.filter((item) => {
    const date = item.date || item.dateConsultation;
    return date === today;
  });

  fillText("[data-stat='patients']", String(MEDECIN_PATIENTS.length));
  fillText("[data-stat='consultations']", String(todayConsultations.length));
  fillText("[data-stat='ordonnances']", String(ordonnances.length));
  fillText("[data-stat='certificats']", String(certificats.length));
  fillText("[data-stat-trend='patients']", `${MEDECIN_PATIENTS.length} patients suivis`);
  fillText("[data-stat-trend='consultations']", `${todayConsultations.length} aujourd'hui`);
  fillText("[data-stat-trend='ordonnances']", "Donnees synchronisees");
  fillText("[data-stat-trend='certificats']", "Donnees synchronisees");
}

function initProfileForm() {
  const form = document.getElementById("medecinProfileForm");
  if (!form) return;
  const fields = {
    name: document.getElementById("mpName"),
    specialty: document.getElementById("mpSpecialty"),
    role: document.getElementById("mpRole"),
    matricule: document.getElementById("mpMatricule"),
    cmu: document.getElementById("mpCmu"),
    sexe: document.getElementById("mpSexe"),
    birthDate: document.getElementById("mpBirthDate"),
    phone: document.getElementById("mpPhone"),
    email: document.getElementById("mpEmail"),
    bio: document.getElementById("mpBio")
  };
  const avatarInput = document.getElementById("mpAvatar");
  const preview = document.getElementById("mpAvatarPreview");
  const feedback = document.querySelector("[data-medecin-profile-feedback]");

  if (fields.name) fields.name.value = MEDECIN_SESSION.name;
  if (fields.specialty) fields.specialty.value = MEDECIN_SESSION.specialty;
  if (fields.role) fields.role.value = MEDECIN_SESSION.role;
  if (fields.matricule) fields.matricule.value = MEDECIN_SESSION.matricule;
  if (fields.cmu) fields.cmu.value = MEDECIN_SESSION.cmu || "";
  if (fields.sexe) fields.sexe.value = MEDECIN_SESSION.sexe || "";
  if (fields.birthDate) fields.birthDate.value = MEDECIN_SESSION.dateNaissance ? formatBirthDate(MEDECIN_SESSION.dateNaissance) : "";
  if (fields.phone) fields.phone.value = MEDECIN_SESSION.phone;
  if (fields.email) fields.email.value = MEDECIN_SESSION.email;
  if (fields.bio) fields.bio.value = MEDECIN_SESSION.bio;

  if (preview && !MEDECIN_SESSION.avatar) preview.textContent = MEDECIN_SESSION.initials;

  avatarInput?.addEventListener("change", () => {
    const file = avatarInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const avatar = typeof reader.result === "string" ? reader.result : "";
      saveMedecinSession({ avatar });
      initMedecinSessionUi();
      if (preview) {
        preview.style.backgroundImage = `url(${avatar})`;
        preview.style.backgroundSize = "cover";
        preview.style.backgroundPosition = "center";
        preview.textContent = "";
      }
      if (feedback) {
        feedback.textContent = "Nouvelle photo prete a etre enregistree.";
      }
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveMedecinSession({
      phone: fields.phone?.value?.trim() || DEFAULT_MEDECIN_SESSION.phone,
      email: fields.email?.value?.trim() || DEFAULT_MEDECIN_SESSION.email,
      bio: fields.bio?.value?.trim() || DEFAULT_MEDECIN_SESSION.bio
    });
    initMedecinSessionUi();
    if (feedback) {
      feedback.textContent = "Profil mis a jour avec succes.";
    }
    window.alert("Profil mis a jour.");
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPatientsFromApi();
  await loadCurrentMedecinContext();
  initPageIdentity();
  initMedecinSessionUi();
  await initDashboardStats();
  initProfileForm();
  initPatientSearch();
  initPatientLookup();
  initWorkflowActions();
  initRoundBackButtons();
  initDossierDetailInteractions();
  initTabs();
  initSelectableChips();
  initTopbarActions();
  initOrdonnanceActions();
  initCertificatActions();
  initConsultationActions();
  initConsultationVitalsSync();

  if (document.getElementById("certTypePills")) updateCert();
  if (document.getElementById("ordoRows")) updateOrdonnance();

  const consultationTabs = document.querySelector("[data-tabs]");
  if (consultationTabs?.querySelector(".tab-btn[data-step='1']")) {
    activateConsultationStep(consultationTabs, 1);
  }

  fillText("[data-search-selected]", "");
  document.querySelectorAll("[data-patient-lookup-input]").forEach((input) => {
    input.value = "";
  });
  hydrateCurrentPatientContext();

  const consultationShell = document.querySelector("[data-consultation-form-shell]");
  if (document.body.dataset.page === "consultation" && !getSelectedPatient()) {
    consultationShell?.classList.add("is-hidden");
  }
});

window.setCert = setCert;
window.updateCert = updateCert;
window.addRow = addRow;
window.delRow = delRow;
window.updateOrdonnance = updateOrdonnance;
