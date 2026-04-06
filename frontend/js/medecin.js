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

function applyPatientData(patient) {
  if (!patient) {
    return;
  }

  fillText("[data-patient-name]", patient.fullName);
  fillText("[data-patient-cmu]", patient.cmu);
  fillText("[data-patient-age]", patient.age);
  fillText("[data-patient-phone]", patient.phone);
  fillText("[data-patient-birth]", patient.birthDate);
  fillText("[data-patient-initials]", patient.initials);
  fillText("[data-patient-allergy]", patient.allergy);
  fillText("[data-patient-condition]", patient.condition);
  fillText("[data-patient-blood]", patient.blood);
  fillText("[data-patient-summary]", patient.summary);
  fillText("[data-patient-last-consultation]", patient.lastConsultation);
  fillText("[data-search-selected]", `${patient.fullName} · ${patient.cmu}`);
  fillHtml("[data-patient-meta-short]", `${patient.cmu} · ${patient.age}`);
  fillHtml("[data-patient-meta-long]", `${patient.cmu} · Ne le ${patient.birthDate} · ${patient.phone}`);
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
    window.localStorage.setItem("lastValidatedCertificat", JSON.stringify(collectCertificatData()));
    window.alert("Certificat valide et pret a etre transmis.");
  });
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
  document.querySelectorAll("[data-action='notifications']").forEach((button) => {
    button.addEventListener("click", () => {
      window.alert("Notifications: 3 elements a consulter pour cet espace medecin.");
    });
  });

  document.querySelectorAll("[data-action='settings']").forEach((button) => {
    button.addEventListener("click", () => {
      window.alert("Parametres: profil, notifications et preferences d'affichage.");
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
  initTabs();
  initSelectableChips();
  initTopbarActions();
  initOrdonnanceActions();
  initCertificatActions();

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
