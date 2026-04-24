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
  const fallback = { consultations: [], ordonnances: [], documents: [], vitals: [], timeline: [] };
  const raw = window.localStorage.getItem(SHARED_RECORDS_KEY);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return {
      consultations: Array.isArray(parsed.consultations) ? parsed.consultations : [],
      ordonnances: Array.isArray(parsed.ordonnances) ? parsed.ordonnances : [],
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
  const records = loadSharedRecords();
  return {
    consultations: records.consultations.filter((item) => item.patientId === patientId),
    ordonnances: records.ordonnances.filter((item) => item.patientId === patientId),
    vitals: records.vitals.filter((item) => item.patientId === patientId),
    timeline: records.timeline.filter((item) => item.patientId === patientId)
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

function initPatientLookup() {
  document.querySelectorAll("[data-patient-lookup]").forEach((block) => {
    const input = block.querySelector("[data-patient-lookup-input]");
    const submit = block.querySelector("[data-patient-lookup-submit]");
    const results = block.querySelector("[data-patient-lookup-results]");
    if (!input || !submit || !results) return;

    const runSearch = async () => renderLookupResults(results, input.value, "dossier");
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

    const runSearch = async () => renderLookupResults(results, input.value, "dossier");
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
      if (path.endsWith("/nouvelle-consultation.html")) {
        goToWorkflowPage("dossier-patient.html", "dossier");
        return;
      }
      if (path.endsWith("/nouveau-certificat.html") || path.endsWith("/nouvelle-ordonnance.html")) {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          goToWorkflowPage("dossier-patient.html", "dossier");
        }
        return;
      }
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "dashboard.html";
      }
    });
  });
}

function syncConsultationVisibility() {
  const picker = document.querySelector("[data-consultation-picker]");
  const formShell = document.querySelector("[data-consultation-form-shell]");
  if (!picker || !formShell) return;
  const workflow = getWorkflowState();
  const hasPatient = Boolean(workflow.patientId || window.localStorage.getItem("medecinSelectedPatientId"));
  const shouldShowForm = hasPatient && workflow.action === "consultation";
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
    value: `${new Intl.DateTimeFormat("fr-FR").format(new Date(item.date))} - ${item.titre || item.diagnostic || "Consultation medicale"}`,
    date: item.date
  }));

  if (sharedConsultations.length) {
    return sharedConsultations.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return [{
    value: `${patient.lastConsultation} - ${patient.summary || "Consultation medicale"}`,
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
    select.innerHTML = options.map((item) => `<option>${item.value}</option>`).join("");
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
  const consultation = document.getElementById("cConsult")?.value || "12/03/2025 - Fievre persistante";
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
  row.innerHTML = '<td><input type="text" placeholder="Medicament" oninput="updateOrdonnance()"></td><td><input type="text" placeholder="Dosage" oninput="updateOrdonnance()"></td><td><select onchange="updateOrdonnance()"><option>Oral</option><option>IV</option><option>IM</option></select></td><td><input type="number" value="1" min="1" max="6" oninput="updateOrdonnance()"></td><td><input type="text" placeholder="Matin..." oninput="updateOrdonnance()"></td><td><input type="number" value="7" oninput="updateOrdonnance()"></td><td><input type="text" placeholder="Instructions" oninput="updateOrdonnance()"></td><td><button class="btn-row-del" type="button" onclick="delRow(this)">âœ•</button></td>';
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
  const consultValue = document.getElementById("oConsult")?.value || "";
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
  return {
    date: document.getElementById("oDate")?.value || "",
    consultation: document.getElementById("oConsult")?.value || "",
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
  return {
    type: document.querySelector("#certTypePills .dpill.sel")?.dataset.type || "apt",
    date: document.getElementById("cDate")?.value || "",
    consultation: document.getElementById("cConsult")?.value || "",
    destinataire: document.getElementById("cDest")?.value?.trim() || "",
    motif: document.getElementById("cMotif")?.value || "",
    restrictions: document.getElementById("cRestr")?.value?.trim() || "",
    debutArret: document.getElementById("arretD")?.value || "",
    finArret: document.getElementById("arretF")?.value || ""
  };
}

function collectConsultationData() {
  const patient = getSelectedPatient();
  if (!patient) return null;
  const taValue = document.getElementById("consult-ta")?.value?.trim() || "145/92";
  const [taSys, taDia] = taValue.split("/").map((part) => Number.parseInt(part?.trim() || "", 10));
  const temperature = Number.parseFloat(document.getElementById("consult-temperature")?.value || "38.7");
  const fc = Number.parseInt(document.getElementById("consult-fc")?.value || "96", 10);
  const spo2 = Number.parseInt(document.getElementById("consult-spo2")?.value || "97", 10);
  const symptomTextareas = document.querySelectorAll("#ct1 textarea");
  const diagnosticTextareas = document.querySelectorAll("#ct3 textarea");
  const treatmentTextareas = document.querySelectorAll("#ct4 textarea");

  return {
    id: createRecordId("consult"),
    patientId: patient.id,
    date: getTodayIsoDate(),
    heure: getCurrentTimeLabel(),
    titre: document.querySelector("#ct1 input[type='text']")?.value?.trim() || "Consultation medicale",
    etablissement: "MediBook",
    medecin: MEDECIN_SESSION.name,
    specialite: MEDECIN_SESSION.specialty,
    statut: "terminee",
    symptomes: symptomTextareas[0]?.value?.trim() || "Symptomes saisis pendant la consultation.",
    diagnostic: diagnosticTextareas[0]?.value?.trim() || "Diagnostic clinique enregistre.",
    traitement: treatmentTextareas[0]?.value?.trim() || "Traitement et suivi renseignes.",
    observations: diagnosticTextareas[1]?.value?.trim() || "",
    vitals: {
      taSys: Number.isFinite(taSys) ? taSys : 145,
      taDia: Number.isFinite(taDia) ? taDia : 92,
      temp: Number.isFinite(temperature) ? temperature : 38.7,
      fc: Number.isFinite(fc) ? fc : 96,
      spo2: Number.isFinite(spo2) ? spo2 : 97
    }
  };
}

function saveValidatedConsultation(payload) {
  appendSharedRecord("consultations", payload);
  appendSharedRecord("vitals", {
    id: `vital-${payload.id}`,
    patientId: payload.patientId,
    date: payload.date,
    heure: payload.heure,
    taSys: payload.vitals.taSys,
    taDia: payload.vitals.taDia,
    temp: payload.vitals.temp,
    fc: payload.vitals.fc,
    spo2: payload.vitals.spo2,
    poids: 0,
    taille: 0,
    glycemie: 0,
    fr: 0,
    source: "medecin",
    auteur: MEDECIN_SESSION.name
  });
  appendSharedRecord("timeline", {
    id: `timeline-${payload.id}`,
    patientId: payload.patientId,
    date: payload.date,
    titre: payload.titre,
    detail: payload.diagnostic,
    source: "medecin"
  });
}

function saveValidatedOrdonnance(payload) {
  const patient = getSelectedPatient();
  const ordonnance = {
    id: createRecordId("ordo").toUpperCase(),
    patientId: patient.id,
    date: payload.date || getTodayIsoDate(),
    statut: "active",
    medecin: MEDECIN_SESSION.name,
    specialite: MEDECIN_SESSION.specialty,
    medicaments: payload.rows.filter((row) => row.medicament).map((row) =>
      `${row.medicament} ${row.dosage} - ${row.prises}x/j - ${row.duree} jours${row.instructions ? ` - ${row.instructions}` : ""}`
    ),
    recommandations: payload.recommandations,
    consultation: payload.consultation
  };

  appendSharedRecord("ordonnances", ordonnance);
  appendSharedRecord("documents", {
    id: `doc-${ordonnance.id}`,
    patientId: patient.id,
    categorie: "ordonnance",
    nom: `Ordonnance ${ordonnance.id}`,
    date: ordonnance.date,
    source: MEDECIN_SESSION.name,
    format: "PDF"
  });
}

function saveValidatedCertificat(payload) {
  const patient = getSelectedPatient();
  appendSharedRecord("documents", {
    id: createRecordId("cert"),
    patientId: patient.id,
    categorie: "certificat",
    nom: `Certificat ${payload.type}`,
    date: payload.date || getTodayIsoDate(),
    source: MEDECIN_SESSION.name,
    format: "PDF",
    consultation: payload.consultation
  });
  appendSharedRecord("timeline", {
    id: createRecordId("timeline-cert"),
    patientId: patient.id,
    date: payload.date || getTodayIsoDate(),
    titre: "Certificat medical",
    detail: `${payload.type} - ${payload.motif || "Document valide"}`,
    source: "medecin"
  });
}

function renderDossierPatientRecords(patient = getSelectedPatient()) {
  const consultRoot = document.getElementById("dtab-consult");
  const ordonnanceRoot = document.getElementById("dtab-ordo");
  const vitalsRoot = document.getElementById("dtab-vit");
  if (!consultRoot && !ordonnanceRoot && !vitalsRoot) return;
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
  validateButton?.addEventListener("click", () => {
    const payload = collectOrdonnanceData();
    saveValidatedOrdonnance(payload);
    window.localStorage.setItem("lastValidatedOrdonnance", JSON.stringify(payload));
    window.alert("Ordonnance validee et prete a etre envoyee.");
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
  validateButton?.addEventListener("click", () => {
    const payload = collectCertificatData();
    saveValidatedCertificat(payload);
    window.localStorage.setItem("lastValidatedCertificat", JSON.stringify(payload));
    window.alert("Certificat valide et pret a etre transmis.");
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

  validateButton?.addEventListener("click", () => {
    const consultationData = collectConsultationData();
    if (!consultationData) {
      window.alert("Veuillez d'abord selectionner un patient.");
      return;
    }
    const payload = { ...consultationData, validatedAt: new Date().toISOString() };
    saveValidatedConsultation(payload);
    window.localStorage.setItem("lastValidatedConsultation", JSON.stringify(payload));
    saveWorkflowState({
      patientId: payload.patientId,
      action: "consultation",
      consultationSaved: true,
      lastConsultationId: payload.id
    });
    hydrateConsultationFollowUp();
    applyPatientData(getSelectedPatient());
    window.alert("Consultation enregistree. Vous pouvez maintenant creer un certificat ou une ordonnance.");
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

function initDashboardStats() {
  const cards = document.querySelector("[data-dashboard-stats]");
  if (!cards) return;
  const today = "2025-04-06";
  const todayConsultations = MEDECIN_CONSULTATIONS.filter((item) => item.date === today);
  const pendingConsultations = todayConsultations.filter((item) => item.status === "pending");
  fillText("[data-stat='patients']", String(MEDECIN_PATIENTS.length));
  fillText("[data-stat='consultations']", String(todayConsultations.length));
  fillText("[data-stat='ordonnances']", String(MEDECIN_ORDONNANCES.length));
  fillText("[data-stat='certificats']", String(MEDECIN_CERTIFICATS.length));
  fillText("[data-stat-trend='patients']", `${MEDECIN_PATIENTS.length} patients suivis`);
  fillText("[data-stat-trend='consultations']", `${pendingConsultations.length} en attente`);
  fillText("[data-stat-trend='ordonnances']", "Ce mois");
  fillText("[data-stat-trend='certificats']", "Ce mois");
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
  initPageIdentity();
  initMedecinSessionUi();
  initDashboardStats();
  initProfileForm();
  initPatientSearch();
  initPatientLookup();
  initWorkflowActions();
  initRoundBackButtons();
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
});

window.setCert = setCert;
window.updateCert = updateCert;
window.addRow = addRow;
window.delRow = delRow;
window.updateOrdonnance = updateOrdonnance;

