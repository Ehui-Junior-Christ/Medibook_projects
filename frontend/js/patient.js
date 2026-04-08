const STORAGE_KEY = "medibook.patient.profile";

const defaultPatientProfile = {
  id: "MB-2026-0042",
  nom: "Bie",
  prenoms: "Jacquy Sergine",
  dateNaissance: "2002-03-15",
  sexe: "Feminin",
  telephone: "+225 07 00 00 42",
  email: "sergine@medibook.ci",
  adresse: "Bingerville, Abidjan",
  profession: "Etudiante",
  situationFamiliale: "Celibataire",
  numeroUrgence: "+225 01 02 03 04",
  personneUrgence: "Bie Mireille",
  lienUrgence: "Mere",
  assurance: "CNAM / CMU",
  numeroAssure: "CMU-2024-08821",
  poids: 58,
  taille: 165,
  groupeSanguin: "O+",
  allergies: "Penicilline",
  antecedents: "Hypertension legere",
  maladiesChroniques: "Aucune",
  traitements: "Paracetamol si besoin",
  handicap: "Aucun",
  medecinTraitant: "Dr. Ange Kouassi",
  specialiteMedecin: "Medecine generale",
  telephoneMedecin: "+225 07 00 00 01",
  notesPatient: "Prefere les rendez-vous du matin."
};

const patientStats = { consultations: 12, ordonnances: 5, documents: 8, rappels: 3 };

const consultations = [
  { id: 1, date: "2026-04-20", heure: "09:30", titre: "Consultation de suivi", etablissement: "Clinique Sainte Marie", medecin: "Dr. Ange Kouassi", specialite: "Medecine generale", statut: "avenir", symptomes: "Toux persistante et fatigue moderee.", diagnostic: "Controle post-bronchite.", traitement: "Poursuite de l'hydratation et bilan complementaire." },
  { id: 2, date: "2026-04-02", heure: "10:00", titre: "Bronchite aigue", etablissement: "CHU de Treichville", medecin: "Dr. Ange Kouassi", specialite: "Medecine generale", statut: "terminee", symptomes: "Toux, gene respiratoire, fievre legere.", diagnostic: "Bronchite aigue sans complication.", traitement: "Amoxicilline 500 mg, ibuprofene 400 mg, repos." },
  { id: 3, date: "2026-03-15", heure: "14:30", titre: "Controle annuel", etablissement: "Polyclinique Internationale", medecin: "Dr. Fatoumata Diallo", specialite: "Pediatrie", statut: "terminee", symptomes: "Bilan systematique.", diagnostic: "Etat general satisfaisant.", traitement: "Surveillance tensionnelle trimestrielle." }
];

const ordonnances = [
  { id: "ORD-2026-0021", date: "2026-04-02", statut: "active", medecin: "Dr. Ange Kouassi", specialite: "Medecine generale", medicaments: ["Amoxicilline 500 mg - 1 gelule matin et soir pendant 7 jours", "Ibuprofene 400 mg - 1 comprime le soir pendant 5 jours"] },
  { id: "ORD-2026-0018", date: "2026-03-15", statut: "expiree", medecin: "Dr. Fatoumata Diallo", specialite: "Pediatrie", medicaments: ["Paracetamol 500 mg - 1 comprime toutes les 8h pendant 5 jours"] }
];

const documents = [
  { id: 1, categorie: "certificat", nom: "Certificat medical - Bronchite", date: "2026-04-02", source: "Dr. Ange Kouassi", format: "PDF" },
  { id: 2, categorie: "certificat", nom: "Certificat de bonne sante", date: "2026-03-15", source: "Dr. Fatoumata Diallo", format: "PDF" },
  { id: 3, categorie: "ordonnance", nom: "Ordonnance ORD-2026-0021", date: "2026-04-02", source: "Dr. Ange Kouassi", format: "PDF" },
  { id: 4, categorie: "ordonnance", nom: "Ordonnance ORD-2026-0018", date: "2026-03-15", source: "Dr. Fatoumata Diallo", format: "PDF" },
  { id: 5, categorie: "analyse", nom: "Bilan sanguin complet", date: "2026-03-10", source: "Laboratoire Central", format: "PDF" },
  { id: 6, categorie: "analyse", nom: "Radiographie thorax", date: "2026-02-02", source: "Imagerie Sainte Marie", format: "JPEG" }
];

const rappels = [
  { id: 1, type: "medicament", titre: "Amoxicilline 500 mg", description: "1 gelule matin et soir.", moment: "Aujourd'hui a 08h00 et 20h00", urgence: "urgent", fait: false },
  { id: 2, type: "alerte", titre: "Renouveler ordonnance", description: "L'ordonnance ORD-2026-0021 expire dans 2 jours.", moment: "Dans 2 jours", urgence: "bientot", fait: false },
  { id: 3, type: "rdv", titre: "Rendez-vous de suivi", description: "Dr. Ange Kouassi - Consultation de suivi.", moment: "Lundi 20 Avril 2026 a 09h30", urgence: "confirme", fait: false },
  { id: 4, type: "medicament", titre: "Ibuprofene 400 mg", description: "1 comprime le soir.", moment: "Ce soir a 21h00", urgence: "soir", fait: false }
];

const historiqueMedical = [
  { date: "2026-04", titre: "Bronchite aigue", detail: "Traitement antibiotique de 7 jours avec repos." },
  { date: "2026-03", titre: "Controle annuel", detail: "Bilan complet, surveillance tensionnelle recommandee." },
  { date: "2025-12", titre: "Grippe saisonniere", detail: "Traitement symptomatique et repos." },
  { date: "2025-06", titre: "Hypertension legere detectee", detail: "Suivi regulier et hygiene de vie." }
];

function loadProfile() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...defaultPatientProfile };
  try {
    return { ...defaultPatientProfile, ...JSON.parse(raw) };
  } catch {
    return { ...defaultPatientProfile };
  }
}

function saveProfile(profile) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function getInitials(profile) {
  return `${profile.nom.charAt(0)}${profile.prenoms.charAt(0)}`.toUpperCase();
}

function getAge(profile) {
  const birthDate = new Date(profile.dateNaissance);
  const now = new Date("2026-04-08T12:00:00");
  let age = now.getFullYear() - birthDate.getFullYear();
  const notBirthday =
    now.getMonth() < birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate());
  if (notBirthday) age -= 1;
  return age;
}

function getImc(profile) {
  const tailleM = Number(profile.taille) / 100;
  if (!tailleM || !Number(profile.poids)) return null;
  return (Number(profile.poids) / (tailleM * tailleM)).toFixed(1);
}

function formatShortDate(dateValue) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(new Date(dateValue));
}

function formatLongDate(dateValue) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(dateValue));
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value;
  });
}

function buildSidebar(profile, currentPage) {
  const navItems = [
    { href: "dashboard.html", label: "Tableau de bord", icon: "🏠", section: "Espace", key: "dashboard.html" },
    { href: "profil.html", label: "Mon profil", icon: "👤", section: "Espace", key: "profil.html" },
    { href: "carnet-medical.html", label: "Carnet medical", icon: "📋", section: "Sante", key: "carnet-medical.html" },
    { href: "consultation.html", label: "Consultations", icon: "🩺", section: "Sante", key: "consultation.html" },
    { href: "ordonnances.html", label: "Ordonnances", icon: "💊", section: "Documents", key: "ordonnances.html" },
    { href: "documents.html", label: "Documents", icon: "📄", section: "Documents", key: "documents.html" },
    { href: "rappels.html", label: "Rappels", icon: "🔔", section: "Suivi", key: "rappels.html" }
  ];

  const navRoot = document.querySelector("[data-patient-nav]");
  if (!navRoot) return;

  const grouped = navItems.reduce((acc, item) => {
    acc[item.section] = acc[item.section] || [];
    acc[item.section].push(item);
    return acc;
  }, {});

  navRoot.innerHTML = Object.entries(grouped).map(([section, items]) => {
    const links = items.map((item) => {
      const active = item.key === currentPage ? "active" : "";
      return `<a class="sb-item ${active}" href="${item.href}"><span class="sb-icon">${item.icon}</span><span>${item.label}</span></a>`;
    }).join("");
    return `<div class="sb-section"><span class="sb-section-label">${section}</span>${links}</div>`;
  }).join("");

  setText("[data-patient-name]", `${profile.nom} ${profile.prenoms}`);
  setText("[data-patient-role]", "Patient");
  setText("[data-patient-initials]", getInitials(profile));
  setText("[data-patient-id]", profile.id);
}

function renderTopbar() {}

function renderDashboard(profile) {
  const statsRoot = document.querySelector("[data-patient-stats]");
  if (statsRoot) {
    statsRoot.innerHTML = `
      <div class="stat-card" data-emoji="🩺"><div class="stat-accent" style="background:var(--teal-500)"></div><div class="stat-val">${patientStats.consultations}</div><div class="stat-label">Consultations</div><div class="stat-trend trend-up">Historique complet</div></div>
      <div class="stat-card" data-emoji="💊"><div class="stat-accent" style="background:var(--green)"></div><div class="stat-val">${patientStats.ordonnances}</div><div class="stat-label">Ordonnances actives</div><div class="stat-trend trend-up">Suivi a jour</div></div>
      <div class="stat-card" data-emoji="📄"><div class="stat-accent" style="background:var(--blue)"></div><div class="stat-val">${patientStats.documents}</div><div class="stat-label">Documents disponibles</div><div class="stat-trend">Derniere mise a jour 02 avril</div></div>
      <div class="stat-card" data-emoji="🔔"><div class="stat-accent" style="background:var(--amber)"></div><div class="stat-val">${patientStats.rappels}</div><div class="stat-label">Rappels actifs</div><div class="stat-trend trend-amber">2 a traiter aujourd'hui</div></div>
    `;
  }

  const consultationsRoot = document.querySelector("[data-dashboard-consultations]");
  if (consultationsRoot) {
    consultationsRoot.innerHTML = consultations.slice(0, 3).map((item) => {
      const [day, month] = formatShortDate(item.date).split(" ");
      const badgeClass = item.statut === "avenir" ? "badge-amber" : "badge-green";
      const badgeLabel = item.statut === "avenir" ? "A venir" : "Terminee";
      return `<div class="consult-item"><div class="consult-date-box"><div class="consult-date-d">${day}</div><div class="consult-date-m">${month}</div></div><div class="flex-1"><div class="consult-title">${item.titre}</div><div class="consult-sub">${item.medecin} · ${item.specialite} · ${item.heure}</div></div><span class="badge ${badgeClass}">${badgeLabel}</span></div>`;
    }).join("");
  }

  const medsRoot = document.querySelector("[data-dashboard-ordonnances]");
  if (medsRoot) {
    medsRoot.innerHTML = ordonnances.filter((item) => item.statut === "active").map((item) => {
      return `<div class="medoc-item"><div class="patient-ava sm">💊</div><div class="flex-1"><div class="medoc-name">${item.id}</div><div class="medoc-detail">${item.medicaments.join(" · ")}</div></div></div>`;
    }).join("");
  }

  const nextAppointment = consultations.find((item) => item.statut === "avenir");
  if (nextAppointment) {
    setText("[data-next-appointment-date]", formatLongDate(nextAppointment.date));
    setText("[data-next-appointment-copy]", `${nextAppointment.medecin} · ${nextAppointment.heure} · ${nextAppointment.specialite}`);
  }

  setText("[data-dashboard-greeting]", `Bonjour, ${profile.prenoms.split(" ")[0]}`);
  setText("[data-profile-age]", `${getAge(profile)} ans`);
  setText("[data-profile-groupe]", profile.groupeSanguin);
}

function renderConsultations() {
  const listRoot = document.querySelector("[data-consultation-list]");
  if (!listRoot) return;

  const query = (document.querySelector("[data-consultation-search]")?.value || "").toLowerCase();
  const activeFilter = document.querySelector(".chip.sel")?.dataset.filter || "toutes";
  const items = consultations.filter((item) => {
    const matchFilter = activeFilter === "toutes" || item.statut === activeFilter;
    const haystack = `${item.titre} ${item.medecin} ${item.specialite} ${item.etablissement}`.toLowerCase();
    return matchFilter && haystack.includes(query);
  });

  listRoot.innerHTML = items.map((item) => {
    const [day, month] = formatShortDate(item.date).split(" ");
    const badgeClass = item.statut === "avenir" ? "badge-amber" : "badge-green";
    const badgeLabel = item.statut === "avenir" ? "A venir" : "Terminee";
    return `<article class="consult-item consult-card-wide" data-consultation-id="${item.id}"><div class="consult-date-box"><div class="consult-date-d">${day}</div><div class="consult-date-m">${month}</div></div><div class="flex-1"><div class="consult-title">${item.titre}</div><div class="consult-sub">${item.medecin} · ${item.specialite} · ${item.etablissement}</div><div class="consult-sub">${formatLongDate(item.date)} · ${item.heure}</div></div><span class="badge ${badgeClass}">${badgeLabel}</span><button class="btn btn-secondary btn-sm" type="button" data-open-consultation="${item.id}">Details</button></article>`;
  }).join("");

  setText("[data-consultation-count]", `${items.length} consultation(s)`);
}

function renderOrdonnances() {
  const root = document.querySelector("[data-ordonnances-list]");
  if (!root) return;

  root.innerHTML = ordonnances.map((item) => {
    const badgeClass = item.statut === "active" ? "badge-green" : "badge-amber";
    const badgeLabel = item.statut === "active" ? "Active" : "Expiree";
    const meds = item.medicaments.map((medicament) => `<li>${medicament}</li>`).join("");
    return `<article class="card ordonnance-card"><div class="card-header"><div><div class="card-title">${item.id}</div><div class="consult-sub">Emise le ${formatLongDate(item.date)}</div></div><span class="badge ${badgeClass}">${badgeLabel}</span></div><div class="ordo-doctor-line">${item.medecin} · ${item.specialite}</div><ul class="ordonnance-list">${meds}</ul><div class="card-actions"><button class="btn btn-primary btn-sm" type="button">Telecharger</button><button class="btn btn-secondary btn-sm" type="button">Voir</button></div></article>`;
  }).join("");
}

function renderDocuments() {
  const root = document.querySelector("[data-documents-list]");
  if (!root) return;
  const activeFilter = document.querySelector(".dpill.sel")?.dataset.category || "tous";
  const items = documents.filter((item) => activeFilter === "tous" || item.categorie === activeFilter);

  root.innerHTML = items.map((item) => {
    const icon = item.categorie === "analyse" ? "🧪" : item.categorie === "ordonnance" ? "💊" : "📋";
    return `<article class="card document-card"><div class="document-icon">${icon}</div><div class="document-name">${item.nom}</div><div class="document-meta">${item.source} · ${formatLongDate(item.date)} · ${item.format}</div><div class="card-actions"><button class="btn btn-primary btn-sm" type="button">Telecharger</button><button class="btn btn-secondary btn-sm" type="button">Voir</button></div></article>`;
  }).join("");
}

function renderRappels() {
  const root = document.querySelector("[data-rappels-list]");
  if (!root) return;
  root.innerHTML = rappels.map((item) => {
    const badgeClass = item.urgence === "urgent" ? "badge-red" : item.urgence === "confirme" ? "badge-green" : "badge-amber";
    const badgeLabel = item.urgence === "urgent" ? "Urgent" : item.urgence === "confirme" ? "Confirme" : "A suivre";
    const icon = item.type === "medicament" ? "💊" : item.type === "rdv" ? "🗓️" : "🔔";
    return `<div class="rappel-item"><div class="rappel-icon-box ${item.urgence === "urgent" ? "amber" : ""}">${icon}</div><div class="flex-1"><div class="consult-title">${item.titre}</div><div class="consult-sub">${item.description}</div><div class="patient-meta">${item.moment}</div></div><span class="badge ${badgeClass}">${badgeLabel}</span>${item.type === "medicament" ? `<button class="btn btn-secondary btn-sm" type="button" data-rappel-done="${item.id}">${item.fait ? "Pris" : "Marquer pris"}</button>` : ""}</div>`;
  }).join("");
}

function renderCarnet(profile) {
  const vitalsRoot = document.querySelector("[data-carnet-vitals]");
  if (vitalsRoot) {
    const imc = getImc(profile);
    vitalsRoot.innerHTML = `<div class="vital-card"><div class="vital-icon">📏</div><div class="vital-val">${profile.taille} cm</div><div class="vital-lbl">Taille</div></div><div class="vital-card"><div class="vital-icon">⚖️</div><div class="vital-val">${profile.poids} kg</div><div class="vital-lbl">Poids</div></div><div class="vital-card"><div class="vital-icon">🫀</div><div class="vital-val">${imc || "--"}</div><div class="vital-lbl">IMC</div></div><div class="vital-card"><div class="vital-icon">🩸</div><div class="vital-val">${profile.groupeSanguin}</div><div class="vital-lbl">Groupe sanguin</div></div>`;
  }

  const allergiesRoot = document.querySelector("[data-carnet-allergies]");
  if (allergiesRoot) allergiesRoot.innerHTML = `<span class="badge badge-red">${profile.allergies || "Aucune allergie declaree"}</span>`;

  const antecedentsRoot = document.querySelector("[data-carnet-antecedents]");
  if (antecedentsRoot) antecedentsRoot.innerHTML = `<div class="info-stack"><div><strong>Antecedents</strong><p>${profile.antecedents}</p></div><div><strong>Maladies chroniques</strong><p>${profile.maladiesChroniques}</p></div><div><strong>Traitements en cours</strong><p>${profile.traitements}</p></div></div>`;

  const historyRoot = document.querySelector("[data-carnet-history]");
  if (historyRoot) historyRoot.innerHTML = historiqueMedical.map((item) => `<div class="timeline-entry"><div class="timeline-date">${item.date}</div><div class="timeline-title">${item.titre}</div><div class="consult-sub">${item.detail}</div></div>`).join("");
}

function fillProfileSummary(profile) {
  setText("[data-profile-fullname]", `${profile.nom} ${profile.prenoms}`);
  setText("[data-profile-profession]", profile.profession);
  setText("[data-profile-assurance]", `${profile.assurance} · ${profile.numeroAssure}`);
  setText("[data-profile-age]", `${getAge(profile)} ans`);
  setText("[data-profile-groupe]", profile.groupeSanguin);
  setText("[data-profile-doctor]", `${profile.medecinTraitant} · ${profile.specialiteMedecin}`);
}

function fillProfileForm(profile) {
  const form = document.querySelector("[data-profile-form]");
  if (!form) return;
  Object.entries(profile).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (field) field.value = value;
  });
  const imc = getImc(profile);
  setText("[data-profile-imc]", imc ? `${imc} IMC` : "IMC indisponible");
}

function applyProfileState(editing) {
  const form = document.querySelector("[data-profile-form]");
  if (!form) return;
  Array.from(form.elements).forEach((element) => {
    if (element instanceof HTMLElement && element.name) element.disabled = !editing;
  });
  document.querySelectorAll("[data-edit-only]").forEach((node) => { node.hidden = !editing; });
  document.querySelectorAll("[data-view-only]").forEach((node) => { node.hidden = editing; });
}

function renderProfile(profile) {
  fillProfileSummary(profile);
  fillProfileForm(profile);
  applyProfileState(window.location.hash === "#edit-profile");
}

function bindProfileForm(profile) {
  const form = document.querySelector("[data-profile-form]");
  if (!form) return;

  document.querySelectorAll("[data-enable-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      applyProfileState(true);
      history.replaceState(null, "", "#edit-profile");
      form.querySelector("input:not([disabled]), textarea:not([disabled]), select:not([disabled])")?.focus();
    });
  });

  document.querySelectorAll("[data-cancel-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      fillProfileForm(profile);
      applyProfileState(false);
      history.replaceState(null, "", "profil.html");
    });
  });

  form.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;
    if (target.name === "poids" || target.name === "taille") {
      const draft = { ...profile, poids: Number(form.elements.namedItem("poids").value), taille: Number(form.elements.namedItem("taille").value) };
      const imc = getImc(draft);
      setText("[data-profile-imc]", imc ? `${imc} IMC` : "IMC indisponible");
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nextProfile = { ...profile };
    Array.from(form.elements).forEach((element) => {
      if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
        if (element.name) nextProfile[element.name] = element.value;
      }
    });
    nextProfile.poids = Number(nextProfile.poids);
    nextProfile.taille = Number(nextProfile.taille);
    saveProfile(nextProfile);
    Object.assign(profile, nextProfile);
    fillProfileSummary(profile);
    fillProfileForm(profile);
    buildSidebar(profile, "profil.html");
    applyProfileState(false);
    history.replaceState(null, "", "profil.html");
    setText("[data-profile-feedback]", "Profil mis a jour avec succes.");
  });
}

function bindDocumentsFilters() {
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-category]").forEach((node) => node.classList.remove("sel"));
      button.classList.add("sel");
      renderDocuments();
    });
  });
}

function bindConsultationFilters() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((node) => node.classList.remove("sel"));
      button.classList.add("sel");
      renderConsultations();
    });
  });

  document.querySelector("[data-consultation-search]")?.addEventListener("input", renderConsultations);

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-consultation]");
    if (!button) return;
    const consultation = consultations.find((item) => String(item.id) === button.dataset.openConsultation);
    if (!consultation) return;
    setText("[data-modal-title]", consultation.titre);
    setText("[data-modal-date]", `${formatLongDate(consultation.date)} a ${consultation.heure}`);
    setText("[data-modal-medecin]", `${consultation.medecin} · ${consultation.specialite}`);
    setText("[data-modal-symptomes]", consultation.symptomes);
    setText("[data-modal-diagnostic]", consultation.diagnostic);
    setText("[data-modal-traitement]", consultation.traitement);
    document.querySelector("[data-consultation-modal]")?.classList.add("open");
  });

  document.querySelectorAll("[data-close-consultation-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("[data-consultation-modal]")?.classList.remove("open");
    });
  });

  document.querySelector("[data-consultation-modal]")?.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) event.currentTarget.classList.remove("open");
  });
}

function bindRappels() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-rappel-done]");
    if (!button) return;
    const rappel = rappels.find((item) => String(item.id) === button.dataset.rappelDone);
    if (!rappel) return;
    rappel.fait = !rappel.fait;
    renderRappels();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const profile = loadProfile();
  const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";
  buildSidebar(profile, currentPage);
  renderTopbar(profile);
  fillProfileSummary(profile);

  if (currentPage === "dashboard.html") renderDashboard(profile);
  if (currentPage === "consultation.html") { renderConsultations(); bindConsultationFilters(); }
  if (currentPage === "ordonnances.html") renderOrdonnances();
  if (currentPage === "documents.html") { renderDocuments(); bindDocumentsFilters(); }
  if (currentPage === "rappels.html") { renderRappels(); bindRappels(); }
  if (currentPage === "carnet-medical.html") renderCarnet(profile);
  if (currentPage === "profil.html") { renderProfile(profile); bindProfileForm(profile); }
});
