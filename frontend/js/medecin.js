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

function getStoredMedecinSession() {
  const raw = window.localStorage.getItem("medecinSession");
  if (!raw) {
    return { ...DEFAULT_MEDECIN_SESSION };
  }

  try {
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_MEDECIN_SESSION, ...parsed };
  } catch {
    return { ...DEFAULT_MEDECIN_SESSION };
  }
}

let MEDECIN_SESSION = getStoredMedecinSession();

function saveMedecinSession(updates) {
  MEDECIN_SESSION = { ...MEDECIN_SESSION, ...updates };
  window.localStorage.setItem("medecinSession", JSON.stringify(MEDECIN_SESSION));
}

const MEDECIN_PATIENTS = [
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
  { title: "Resultats biologiques", body: "Le bilan du patient Kouadio Jean Baptiste est disponible.", time: "Aujourd'hui · 08:15", tag: "laboratoire" },
  { title: "Consultation a valider", body: "La consultation d'Assi Koffi Martial attend votre validation.", time: "Aujourd'hui · 10:00", tag: "consultation" },
  { title: "Rappel de suivi", body: "Traore Awa Mariam doit etre revue cette semaine.", time: "Demain · 09:30", tag: "suivi" }
];

function getSelectedPatient() {
  const savedPatientId = window.localStorage.getItem("medecinSelectedPatientId");
  return MEDECIN_PATIENTS.find((patient) => patient.id === savedPatientId) || MEDECIN_PATIENTS[0];
}

function saveSelectedPatient(patientId) {
  window.localStorage.setItem("medecinSelectedPatientId", patientId);
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

function loadSharedRecords() {
  const fallback = {
    consultations: [],
    ordonnances: [],
    documents: [],
    vitals: [],
    timeline: []
  };
  const raw = window.localStorage.getItem(SHARED_RECORDS_KEY);
  if (!raw) {
    return fallback;
  }

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

function createRecordId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentTimeLabel() {
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date());
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

function applyPatientData(patient) {
  if (!patient) {
    return;
  }

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
  fillText("[data-search-selected]", patient.fullName + " · " + patient.cmu);
  fillHtml("[data-patient-meta-short]", patient.cmu + " · " + patient.age);
  fillHtml("[data-patient-meta-long]", patient.cmu + " · Ne le " + patient.birthDate + " · " + patient.phone);
  renderDossierPatientRecords(patient);
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
      <small>${patient.cmu} · ${patient.age}</small>
    </span>
  `;
  return item;
}

function filterPatients(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return MEDECIN_PATIENTS;
  }

  return MEDECIN_PATIENTS.filter((patient) => {
    return [
      patient.fullName,
      patient.cmu,
      patient.phone,
      patient.summary
    ].some((value) => value.toLowerCase().includes(normalized));
  });
}

function closeAllPatientSearches() {
  document.querySelectorAll(".patient-search-shell.open").forEach((shell) => {
    shell.classList.remove("open");
  });
}

function selectPatient(patient, input, selectedLabel) {
  if (!patient) {
    return;
  }

  saveSelectedPatient(patient.id);
  applyPatientData(patient);
  if (input) {
    input.value = patient.fullName;
  }
  if (selectedLabel) {
    selectedLabel.textContent = `${patient.fullName} Â· ${patient.cmu}`;
  }
  closeAllPatientSearches();
}

function initPatientSearch() {
  document.querySelectorAll(".patient-search-shell").forEach((shell) => {
    const input = shell.querySelector(".patient-search-input");
    const results = shell.querySelector(".patient-search-results");
    const selectedLabel = shell.querySelector(".patient-search-selected");

    if (!input || !results) {
      return;
    }

    const renderResults = (query = "") => {
      results.innerHTML = "";
      const patients = filterPatients(query).slice(0, 5);

      patients.forEach((patient) => {
        const item = createPatientSearchItem(patient);
        item.addEventListener("click", () => {
          saveSelectedPatient(patient.id);
          applyPatientData(patient);
          input.value = patient.fullName;
          if (selectedLabel) {
            selectedLabel.textContent = `${patient.fullName} · ${patient.cmu}`;
          }
          shell.classList.remove("open");
        });
        results.appendChild(item);
      });

      if (!patients.length) {
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

function initPatientPickerActions() {
  document.querySelectorAll(".patient-picker-card").forEach((card) => {
    const input = card.querySelector(".patient-picker-bar input");
    const button = card.querySelector(".patient-picker-bar .btn");
    const selectedLabel = document.querySelector("[data-search-selected]");

    if (!input || !button) {
      return;
    }

    const runSearch = () => {
      const [patient] = filterPatients(input.value);
      if (!patient) {
        window.alert("Aucun patient correspondant.");
        return;
      }
      selectPatient(patient, input, selectedLabel);
    };

    button.addEventListener("click", runSearch);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        runSearch();
      }
    });
  });
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
  const title = document.getElementById("cpTitle");
  const main = document.getElementById("cpMain");
  const restr = document.getElementById("cpRestr");
  const date = document.getElementById("cpDate");
  const consultPreview = document.getElementById("cpConsult");
  const destPreview = document.getElementById("cpDest");
  const titles = {
    apt: "Certificat d'aptitude au travail",
    arret: "Certificat d'arret de travail",
    dispense: "Certificat de dispense",
    general: "Certificat medical general"
  };

  if (title) {
    title.textContent = titles[type];
  }
  if (date) {
    date.textContent = dateValue ? new Date(dateValue).toLocaleDateString("fr-FR") : "...";
  }
  if (consultPreview) {
    consultPreview.textContent = consultation;
  }
  if (destPreview) {
    destPreview.textContent = destinataire;
  }
  if (main) {
    if (type === "arret") {
      const start = document.getElementById("arretD")?.value;
      const end = document.getElementById("arretF")?.value;
      const from = start ? new Date(start).toLocaleDateString("fr-FR") : "...";
      const to = end ? new Date(end).toLocaleDateString("fr-FR") : "...";
      main.innerHTML = `Prescrit un arret de travail du <strong>${from}</strong> au <strong>${to}</strong>, ${motif}, suite a la consultation <strong>${consultation}</strong>.`;
    } else if (type === "dispense") {
      main.innerHTML = `Delivre une dispense d'activite scolaire / sportive, ${motif}, pour le dossier issu de la consultation <strong>${consultation}</strong>.`;
    } else if (type === "general") {
      main.innerHTML = `Certifie avoir examine le patient ce jour (${motif}) dans le cadre de la consultation <strong>${consultation}</strong>.`;
    } else {
      main.innerHTML = `Et atteste que l'etat de sante de ce patient lui permet d'exercer son activite professionnelle sans restriction particuliere, apres evaluation lors de la consultation <strong>${consultation}</strong>.`;
    }
  }
  if (restr) {
    restr.innerHTML = restrictions ? `<em>Restrictions : ${restrictions}</em>` : "";
  }
}

function addRow() {
  const table = document.getElementById("ordoRows");
  if (!table) {
    return;
  }
  const row = document.createElement("tr");
  row.innerHTML = '<td><input type="text" placeholder="Medicament" oninput="updateOrdonnance()"></td><td><input type="text" placeholder="Dosage" oninput="updateOrdonnance()"></td><td><select onchange="updateOrdonnance()"><option>Oral</option><option>IV</option><option>IM</option></select></td><td><input type="number" value="1" min="1" max="6" oninput="updateOrdonnance()"></td><td><input type="text" placeholder="Matin..." oninput="updateOrdonnance()"></td><td><input type="number" value="7" oninput="updateOrdonnance()"></td><td><input type="text" placeholder="Instructions" oninput="updateOrdonnance()"></td><td><button class="btn-row-del" type="button" onclick="delRow(this)">✕</button></td>';
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
  const previewDate = document.getElementById("opDate");
  const signatureDate = document.getElementById("opSignatureDate");
  const previewConsult = document.getElementById("opConsult");
  const previewRenew = document.getElementById("opRenew");
  const previewValidity = document.getElementById("opValidity");
  const previewReco = document.getElementById("opReco");
  const previewLines = document.getElementById("opLines");

  const dateValue = document.getElementById("oDate")?.value || "";
  const consultValue = document.getElementById("oConsult")?.value || "";
  const renewValue = document.getElementById("oRenew")?.value || "";
  const validityValue = document.getElementById("oValidity")?.value || "";
  const recoValue = document.getElementById("oReco")?.value?.trim() || "Repos complet, hydratation abondante...";

  if (previewDate) {
    previewDate.textContent = dateValue ? new Date(dateValue).toLocaleDateString("fr-FR") : "...";
  }
  if (signatureDate) {
    signatureDate.textContent = dateValue ? new Date(dateValue).toLocaleDateString("fr-FR") : "...";
  }
  if (previewConsult) {
    previewConsult.textContent = consultValue || "...";
  }
  if (previewRenew) {
    previewRenew.textContent = renewValue || "...";
  }
  if (previewValidity) {
    previewValidity.textContent = validityValue || "...";
  }
  if (previewReco) {
    previewReco.innerHTML = `<strong>Recommandations :</strong> ${recoValue}`;
  }

  if (previewLines) {
    const rows = Array.from(document.querySelectorAll("#ordoRows tr"));
    const lines = rows.map((row, index) => {
      const cells = row.querySelectorAll("td");
      const medicament = cells[0]?.querySelector("input")?.value?.trim() || "Medicament";
      const dosage = cells[1]?.querySelector("input")?.value?.trim() || "Dosage";
      const voie = cells[2]?.querySelector("select")?.value || "Oral";
      const prises = cells[3]?.querySelector("input")?.value || "1";
      const moments = cells[4]?.querySelector("input")?.value?.trim() || "Moments";
      const duree = cells[5]?.querySelector("input")?.value || "1";
      const instructions = cells[6]?.querySelector("input")?.value?.trim() || "";
      const marker = index + 1 === 1 ? "①" : index + 1 === 2 ? "②" : `${index + 1}.`;
      return `<p>${marker} ${medicament} ${dosage} - ${voie} - ${prises} prises/j (${moments}) - ${duree} jours${instructions ? ` - ${instructions}` : ""}</p>`;
    });

    previewLines.innerHTML = lines.join("") || "<p>Aucun médicament saisi.</p>";
  }
}

function collectOrdonnanceData() {
  const rows = Array.from(document.querySelectorAll("#ordoRows tr")).map((row) => {
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
  });

  return {
    date: document.getElementById("oDate")?.value || "",
    consultation: document.getElementById("oConsult")?.value || "",
    renouvellement: document.getElementById("oRenew")?.value || "",
    validite: document.getElementById("oValidity")?.value || "",
    recommandations: document.getElementById("oReco")?.value?.trim() || "",
    rows
  };
}

function initOrdonnanceActions() {
  const draftButton = document.getElementById("ordoDraftBtn");
  const pdfButton = document.getElementById("ordoPdfBtn");
  const printButton = document.getElementById("ordoPrintBtn");
  const validateButton = document.getElementById("ordoValidateBtn");

  if (!draftButton && !pdfButton && !printButton && !validateButton) {
    return;
  }

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

  pdfButton?.addEventListener("click", () => {
    window.localStorage.setItem("ordonnancePdfSource", document.getElementById("ordoPreviewBody")?.innerHTML || "");
    printOnlyPreview();
  });

  printButton?.addEventListener("click", () => {
    printOnlyPreview();
  });

  validateButton?.addEventListener("click", () => {
    const payload = collectOrdonnanceData();
    window.localStorage.setItem("lastValidatedOrdonnance", JSON.stringify(payload));
    saveValidatedOrdonnance(payload);
    window.alert("Ordonnance validee et prete a etre envoyee.");
  });
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
  const symptomTextareas = document.querySelectorAll("#ct1 textarea");
  const diagnosticTextareas = document.querySelectorAll("#ct3 textarea");
  const treatmentTextareas = document.querySelectorAll("#ct4 textarea");
  const taValue = document.getElementById("consult-ta")?.value?.trim() || "145/92";
  const [taSys, taDia] = taValue.split("/").map((part) => Number.parseInt(part?.trim() || "", 10));
  const temperature = Number.parseFloat(document.getElementById("consult-temperature")?.value || "38.7");
  const fc = Number.parseInt(document.getElementById("consult-fc")?.value || "96", 10);
  const spo2 = Number.parseInt(document.getElementById("consult-spo2")?.value || "97", 10);
  const date = getTodayIsoDate();

  return {
    id: createRecordId("consult"),
    patientId: patient.id,
    date,
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
    medicaments: payload.rows
      .filter((row) => row.medicament)
      .map((row) => `${row.medicament} ${row.dosage} - ${row.prises}x/j - ${row.duree} jours${row.instructions ? ` - ${row.instructions}` : ""}`),
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

function initCertificatActions() {
  const draftButton = document.getElementById("certDraftBtn");
  const pdfButton = document.getElementById("certPdfBtn");
  const printButton = document.getElementById("certPrintBtn");
  const validateButton = document.getElementById("certValidateBtn");

  if (!draftButton && !pdfButton && !printButton && !validateButton) {
    return;
  }

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

  pdfButton?.addEventListener("click", () => {
    window.localStorage.setItem("certificatPdfSource", document.getElementById("cpBody")?.innerHTML || "");
    printOnlyPreview();
  });

  printButton?.addEventListener("click", () => {
    printOnlyPreview();
  });

  validateButton?.addEventListener("click", () => {
    const payload = collectCertificatData();
    window.localStorage.setItem("lastValidatedCertificat", JSON.stringify(payload));
    saveValidatedCertificat(payload);
    window.alert("Certificat valide et pret a etre transmis.");
  });
}

function initConsultationActions() {
  const consultationDraftButton = Array.from(document.querySelectorAll("#ct4 .actions-right .btn"))
    .find((button) => button.textContent.includes("Brouillon"));
  const consultationValidateButton = Array.from(document.querySelectorAll("#ct4 .actions-right .btn"))
    .find((button) => button.textContent.includes("Valider consultation"));
  const dossierPdfButton = Array.from(document.querySelectorAll("#dtab-ordo .btn"))
    .find((button) => button.textContent.includes("PDF"));

  consultationDraftButton?.addEventListener("click", () => {
    const payload = {
      patientId: getSelectedPatient().id,
      motif: document.querySelector("#ct1 input[type='text']")?.value || "",
      diagnostic: document.querySelector("#ct3 textarea")?.value || "",
      traitement: document.querySelector("#ct4 textarea")?.value || ""
    };
    window.localStorage.setItem("consultationDraft", JSON.stringify(payload));
    window.alert("Brouillon de consultation enregistre.");
  });

  consultationValidateButton?.addEventListener("click", () => {
    const payload = {
      ...collectConsultationData(),
      validatedAt: new Date().toISOString()
    };
    window.localStorage.setItem("lastValidatedConsultation", JSON.stringify(payload));
    saveValidatedConsultation(payload);
    window.alert("Consultation validee et prete a etre ajoutee au dossier.");
  });

  dossierPdfButton?.addEventListener("click", () => {
    const patient = getSelectedPatient();
    const content = [
      "MediBook - Ordonnance du dossier patient",
      `Patient: ${patient.fullName}`,
      `CMU: ${patient.cmu}`,
      `Derniere consultation: ${patient.lastConsultation}`,
      "",
      "Medicaments:",
      "1. Artemether/Lumefantrine - 80/480mg - 2x/j - 3 jours",
      "2. Paracetamol - 1000mg - 3x/j - 5 jours"
    ].join("\n");

    triggerFileDownload(`${sanitizeFilename(`ordonnance-${patient.fullName}`)}.txt`, content);
  });
}

function renderDossierPatientRecords(patient = getSelectedPatient()) {
  const consultRoot = document.getElementById("dtab-consult");
  const ordonnanceRoot = document.getElementById("dtab-ordo");
  const vitalsRoot = document.getElementById("dtab-vit");
  if (!consultRoot && !ordonnanceRoot && !vitalsRoot) {
    return;
  }

  const shared = getSharedPatientRecords(patient.id);
  const consultationItems = shared.consultations.length
    ? shared.consultations
    : [{
        id: "fallback-consultation",
        date: "2025-03-12",
        titre: `${patient.summary} - Suivi`,
        diagnostic: "Consultation precedente du dossier.",
        vitals: { taSys: 130, taDia: 85, temp: 39.2, fc: 98, spo2: 97 }
      }];
  const latestVital = shared.vitals[0] || consultationItems[0]?.vitals;
  const ordonnanceItems = shared.ordonnances.length
    ? shared.ordonnances
    : [{
        id: "ORD-STATIC",
        date: "2025-03-12",
        medicaments: [
          "Artemether/Lumefantrine - 80/480mg - 2x/j - 3 jours",
          "Paracetamol - 1000mg - 3x/j - 5 jours"
        ],
        medecin: MEDECIN_SESSION.name,
        specialite: MEDECIN_SESSION.specialty
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
            <div class="consult-sub">TA: ${vitals.taSys || "--"}/${vitals.taDia || "--"} · T°: ${vitals.temp || "--"}°C · FC: ${vitals.fc || "--"} bpm</div>
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
            <thead>
              <tr>
                <th>Médicament</th>
                <th>Détail</th>
              </tr>
            </thead>
            <tbody>
              ${latestOrdonnance.medicaments.map((line) => `<tr><td>${line.split(" - ")[0]}</td><td>${line.split(" - ").slice(1).join(" - ")}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
        <div class="mt-8">
          <button class="btn btn-secondary btn-sm" type="button">PDF</button>
        </div>
      </div>
    `;
  }

  if (vitalsRoot) {
    const vital = latestVital || { taSys: 145, taDia: 92, temp: 37.1, fc: 78, spo2: 97 };
    const warnTA = Number(vital.taSys) > 140 || Number(vital.taDia) > 90;
    vitalsRoot.innerHTML = `
      <div class="vital-grid">
        <div class="vital-card ${warnTA ? "warning" : ""}">
          <div class="vital-icon">🩸</div>
          <div class="vital-val">${vital.taSys}/${vital.taDia}</div>
          <div class="vital-lbl">Tension (mmHg)</div>
        </div>
        <div class="vital-card">
          <div class="vital-icon">🌡️</div>
          <div class="vital-val">${vital.temp}°C</div>
          <div class="vital-lbl">Température</div>
        </div>
        <div class="vital-card">
          <div class="vital-icon">❤️</div>
          <div class="vital-val">${vital.fc} bpm</div>
          <div class="vital-lbl">Fréq. cardiaque</div>
        </div>
        <div class="vital-card">
          <div class="vital-icon">🫁</div>
          <div class="vital-val">${vital.spo2}%</div>
          <div class="vital-lbl">SpO₂</div>
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

  if (!taInput || !temperatureInput || !fcInput || !spo2Input) {
    return;
  }

  const tensionValue = document.querySelector("[data-consult-vital='tension']");
  const tensionLabel = document.querySelector("[data-consult-vital-label='tension']");
  const tensionCard = document.querySelector("[data-vital-card='tension']");
  const temperatureValue = document.querySelector("[data-consult-vital='temperature']");
  const temperatureCard = document.querySelector("[data-vital-card='temperature']");
  const fcValue = document.querySelector("[data-consult-vital='fc']");
  const fcCard = document.querySelector("[data-vital-card='fc']");
  const spo2Value = document.querySelector("[data-consult-vital='spo2']");
  const spo2Card = document.querySelector("[data-vital-card='spo2']");

  const updateVitalsPreview = () => {
    const taValue = taInput.value.trim() || taInput.placeholder || "--/--";
    const temperature = temperatureInput.value.trim() || temperatureInput.placeholder || "--.-";
    const fc = fcInput.value.trim() || fcInput.placeholder || "--";
    const spo2 = spo2Input.value.trim() || spo2Input.placeholder || "--";

    if (tensionValue) {
      tensionValue.textContent = taValue;
    }
    if (temperatureValue) {
      temperatureValue.textContent = `${temperature}°C`;
    }
    if (fcValue) {
      fcValue.textContent = `${fc} bpm`;
    }
    if (spo2Value) {
      spo2Value.textContent = `${spo2}%`;
    }

    const [taSys, taDia] = taValue.split("/").map((part) => Number.parseInt(part?.trim() || "", 10));
    const tensionWarning = Number.isFinite(taSys) && Number.isFinite(taDia) && (taSys > 140 || taDia > 90);
    tensionCard?.classList.toggle("warning", tensionWarning);
    if (tensionLabel) {
      tensionLabel.textContent = tensionWarning ? "Tension ⚠️" : "Tension";
    }

    const temperatureWarning = Number.parseFloat(temperature) >= 38;
    temperatureCard?.classList.toggle("warning", temperatureWarning);

    const fcWarning = Number.parseInt(fc, 10) > 100;
    fcCard?.classList.toggle("warning", fcWarning);

    const spo2Warning = Number.parseInt(spo2, 10) < 95;
    spo2Card?.classList.toggle("warning", spo2Warning);
  };

  [taInput, temperatureInput, fcInput, spo2Input].forEach((input) => {
    input.addEventListener("input", updateVitalsPreview);
    input.addEventListener("change", updateVitalsPreview);
  });

  updateVitalsPreview();
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
    const currentStep = Number(step);
    const dot = item.querySelector(".step-dot");

    item.classList.remove("active", "done");
    if (itemStep < currentStep) {
      item.classList.add("done");
      if (dot) {
        dot.textContent = "✓";
      }
      return;
    }
    if (itemStep === currentStep) {
      item.classList.add("active");
    }
    if (dot) {
      dot.textContent = String(itemStep);
    }
  });
}

function initTabs() {
  document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const wrapper = button.closest("[data-tabs]") || button.closest("section[data-tabs]");
      if (!wrapper) {
        return;
      }

      const targetId = button.dataset.target;
      const hasStepFlow = Boolean(button.dataset.step);

      if (hasStepFlow) {
        activateConsultationStep(wrapper, button.dataset.step || "1");
        return;
      }

      wrapper.querySelectorAll(".tab-btn").forEach((node) => node.classList.remove("active"));
      wrapper.querySelectorAll(".tab-content").forEach((node) => node.classList.remove("active"));
      button.classList.add("active");
      const target = wrapper.querySelector(`#${targetId}`);
      if (target) {
        target.classList.add("active");
      }
    });
  });

  document.querySelectorAll(".consult-nav").forEach((button) => {
    button.addEventListener("click", () => {
      const wrapper = button.closest("[data-tabs]");
      const activeButton = wrapper?.querySelector(".tab-btn.active[data-step]");
      if (!wrapper || !activeButton) {
        return;
      }

      const currentStep = Number(activeButton.dataset.step || "1");
      const direction = button.dataset.direction === "prev" ? -1 : 1;
      const nextStep = Math.min(4, Math.max(1, currentStep + direction));
      activateConsultationStep(wrapper, nextStep);
    });
  });
}

function initSelectableChips() {
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => chip.classList.toggle("sel"));
  });

  document.querySelectorAll("#ct3 .dpill, #certTypePills .dpill").forEach((pill) => {
    if (pill.closest("#certTypePills")) {
      return;
    }
    pill.addEventListener("click", () => {
      pill.parentElement?.querySelectorAll(".dpill").forEach((node) => node.classList.remove("sel"));
      pill.classList.add("sel");
    });
  });
}

function initTopbarActions() {
  document.querySelectorAll("[data-action='settings']").forEach((button) => {
    button.remove();
  });

  document.querySelectorAll("[data-action='notifications']").forEach((button) => {
    button.classList.remove("icon-btn-badge");
    button.classList.add("icon-btn-count");
    button.setAttribute("data-count", String(MEDECIN_NOTIFICATION_COUNT));
    button.setAttribute("title", "Rappels et notifications");
    button.textContent = "🔔";
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
      const shouldLogout = window.confirm("Voulez-vous vous deconnecter ?");
      if (shouldLogout) {
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
  fillText("[data-medecin-bio]", MEDECIN_SESSION.bio);

  document.querySelectorAll("[data-medecin-avatar]").forEach((node) => {
    if (MEDECIN_SESSION.avatar) {
      node.style.backgroundImage = `url(${MEDECIN_SESSION.avatar})`;
      node.style.backgroundSize = "cover";
      node.style.backgroundPosition = "center";
      node.textContent = "";
      return;
    }

    node.style.backgroundImage = "";
    node.textContent = MEDECIN_SESSION.initials;
  });
}

function initDashboardStats() {
  const cards = document.querySelector("[data-dashboard-stats]");
  if (!cards) {
    return;
  }

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
  if (!form) {
    return;
  }

  const fields = {
    name: document.getElementById("mpName"),
    specialty: document.getElementById("mpSpecialty"),
    role: document.getElementById("mpRole"),
    matricule: document.getElementById("mpMatricule"),
    phone: document.getElementById("mpPhone"),
    email: document.getElementById("mpEmail"),
    bio: document.getElementById("mpBio")
  };
  const avatarInput = document.getElementById("mpAvatar");
  const preview = document.getElementById("mpAvatarPreview");

  Object.entries(fields).forEach(([key, input]) => {
    if (input) {
      input.value = MEDECIN_SESSION[key] || "";
    }
  });

  if (preview) {
    if (MEDECIN_SESSION.avatar) {
      preview.style.backgroundImage = `url(${MEDECIN_SESSION.avatar})`;
      preview.style.backgroundSize = "cover";
      preview.style.backgroundPosition = "center";
      preview.textContent = "";
    } else {
      preview.style.backgroundImage = "";
      preview.textContent = MEDECIN_SESSION.initials;
    }
  }

  avatarInput?.addEventListener("change", () => {
    const file = avatarInput.files?.[0];
    if (!file) {
      return;
    }
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
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const updates = {
      name: MEDECIN_SESSION.name,
      specialty: MEDECIN_SESSION.specialty,
      role: MEDECIN_SESSION.role,
      matricule: MEDECIN_SESSION.matricule,
      phone: fields.phone?.value?.trim() || DEFAULT_MEDECIN_SESSION.phone,
      email: fields.email?.value?.trim() || DEFAULT_MEDECIN_SESSION.email,
      bio: fields.bio?.value?.trim() || DEFAULT_MEDECIN_SESSION.bio
    };
    updates.initials = MEDECIN_SESSION.initials;

    saveMedecinSession(updates);
    initMedecinSessionUi();
    window.alert("Profil mis a jour.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMedecinSessionUi();
  applyPatientData(getSelectedPatient());
  initDashboardStats();
  initProfileForm();
  initPatientSearch();
  initPatientPickerActions();
  initTabs();
  initSelectableChips();
  initTopbarActions();
  initOrdonnanceActions();
  initCertificatActions();
  initConsultationActions();
  initConsultationVitalsSync();

  if (document.getElementById("certTypePills")) {
    updateCert();
  }
  if (document.getElementById("ordoRows")) {
    updateOrdonnance();
  }

  const consultationTabs = document.querySelector("[data-tabs]");
  if (consultationTabs?.querySelector(".tab-btn[data-step='1']")) {
    activateConsultationStep(consultationTabs, 1);
  }
});




