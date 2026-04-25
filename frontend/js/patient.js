const API_BASE_URL = "http://localhost:8080/api";
const STORAGE_KEY = "medibook.patient.profile";
const SHARED_RECORDS_KEY = "medibook.shared.records";
const USER_STORAGE_KEY = "user";

const defaultPatientProfile = {
  id: "MB-2026-0042",
  backendId: null,
  avatar: "",
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

const defaultConsultations = [
  { id: 1, date: "2026-04-20", heure: "09:30", titre: "Consultation de suivi", etablissement: "Clinique Sainte Marie", medecin: "Dr. Ange Kouassi", specialite: "Medecine generale", statut: "avenir", symptomes: "Toux persistante et fatigue moderee.", diagnostic: "Controle post-bronchite.", traitement: "Poursuite de l'hydratation et bilan complementaire." },
  { id: 2, date: "2026-04-02", heure: "10:00", titre: "Bronchite aigue", etablissement: "CHU de Treichville", medecin: "Dr. Ange Kouassi", specialite: "Medecine generale", statut: "terminee", symptomes: "Toux, gene respiratoire, fievre legere.", diagnostic: "Bronchite aigue sans complication.", traitement: "Amoxicilline 500 mg, ibuprofene 400 mg, repos." },
  { id: 3, date: "2026-03-15", heure: "14:30", titre: "Controle annuel", etablissement: "Polyclinique Internationale", medecin: "Dr. Fatoumata Diallo", specialite: "Pediatrie", statut: "terminee", symptomes: "Bilan systematique.", diagnostic: "Etat general satisfaisant.", traitement: "Surveillance tensionnelle trimestrielle." }
];

const defaultOrdonnances = [
  { id: "ORD-2026-0021", date: "2026-04-02", statut: "active", medecin: "Dr. Ange Kouassi", specialite: "Medecine generale", medicaments: ["Amoxicilline 500 mg - 1 gelule matin et soir pendant 7 jours", "Ibuprofene 400 mg - 1 comprime le soir pendant 5 jours"] },
  { id: "ORD-2026-0018", date: "2026-03-15", statut: "expiree", medecin: "Dr. Fatoumata Diallo", specialite: "Pediatrie", medicaments: ["Paracetamol 500 mg - 1 comprime toutes les 8h pendant 5 jours"] }
];

const defaultDocuments = [
  { id: 1, categorie: "certificat", nom: "Certificat medical - Bronchite", date: "2026-04-02", source: "Dr. Ange Kouassi", format: "PDF" },
  { id: 2, categorie: "certificat", nom: "Certificat de bonne sante", date: "2026-03-15", source: "Dr. Fatoumata Diallo", format: "PDF" },
  { id: 3, categorie: "ordonnance", nom: "Ordonnance ORD-2026-0021", date: "2026-04-02", source: "Dr. Ange Kouassi", format: "PDF" },
  { id: 4, categorie: "ordonnance", nom: "Ordonnance ORD-2026-0018", date: "2026-03-15", source: "Dr. Fatoumata Diallo", format: "PDF" },
  { id: 5, categorie: "analyse", nom: "Bilan sanguin complet", date: "2026-03-10", source: "Laboratoire Central", format: "PDF" },
  { id: 6, categorie: "analyse", nom: "Radiographie thorax", date: "2026-02-02", source: "Imagerie Sainte Marie", format: "JPEG" }
];

const defaultRappels = [
  { id: 1, type: "medicament", titre: "Amoxicilline 500 mg", description: "1 gelule matin et soir.", moment: "Aujourd'hui a 08h00 et 20h00", urgence: "urgent", fait: false },
  { id: 2, type: "alerte", titre: "Renouveler ordonnance", description: "L'ordonnance ORD-2026-0021 expire dans 2 jours.", moment: "Dans 2 jours", urgence: "bientot", fait: false },
  { id: 3, type: "rdv", titre: "Rendez-vous de suivi", description: "Dr. Ange Kouassi - Consultation de suivi.", moment: "Lundi 20 Avril 2026 a 09h30", urgence: "confirme", fait: false },
  { id: 4, type: "medicament", titre: "Ibuprofene 400 mg", description: "1 comprime le soir.", moment: "Ce soir a 21h00", urgence: "soir", fait: false }
];

const defaultHistoriqueMedical = [
  { date: "2026-04", titre: "Bronchite aigue", detail: "Traitement antibiotique de 7 jours avec repos." },
  { date: "2026-03", titre: "Controle annuel", detail: "Bilan complet, surveillance tensionnelle recommandee." },
  { date: "2025-12", titre: "Grippe saisonniere", detail: "Traitement symptomatique et repos." },
  { date: "2025-06", titre: "Hypertension legere detectee", detail: "Suivi regulier et hygiene de vie." }
];

const patientGlobalSearchItems = [
  { href: "dashboard.html", title: "Tableau de bord", meta: "Vue generale de votre espace patient" },
  { href: "profil.html", title: "Mon profil", meta: "Consulter vos informations personnelles" },
  { href: "profil.html#edit-profile", title: "Modifier mon profil", meta: "Mettre a jour vos informations declaratives" },
  { href: "carnet-medical.html", title: "Carnet medical", meta: "Allergies, antecedents et constantes" },
  { href: "consultation.html", title: "Consultations", meta: "Historique et rendez-vous medicaux" },
  { href: "ordonnances.html", title: "Ordonnances", meta: "Prescriptions et traitements en cours" },
  { href: "documents.html", title: "Documents", meta: "Certificats, analyses et fichiers medicaux" },
  { href: "rappels.html", title: "Rappels", meta: "Medicaments, alertes et suivi" }
];

const state = {
  apiEnabled: false,
  profile: loadProfile(),
  carnetMedical: null,
  consultations: [...defaultConsultations],
  ordonnances: [...defaultOrdonnances],
  documents: [...defaultDocuments],
  rappels: [...defaultRappels],
  historiqueMedical: [...defaultHistoriqueMedical]
};

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

function loadProfile() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...defaultPatientProfile };
  try {
    const parsed = JSON.parse(raw);
    return { ...defaultPatientProfile, ...parsed, prenoms: parsed.prenoms || parsed.prenom || defaultPatientProfile.prenoms };
  } catch {
    return { ...defaultPatientProfile };
  }
}

function saveProfile(profile) {
  state.profile = {
    ...defaultPatientProfile,
    ...profile,
    prenoms: profile.prenoms || profile.prenom || defaultPatientProfile.prenoms
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.profile));
}

function getStoredUser() {
  try {
    return JSON.parse(window.localStorage.getItem(USER_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function getCurrentPatientBackendId() {
  return state.profile.backendId || getStoredUser()?.id || null;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

function normalizePatientProfile(apiProfile = {}, carnet = null) {
  const antecedentsText = apiProfile.antecedents
    || carnet?.antecedents?.map((item) => item.details || item.libelle).filter(Boolean).join("\n")
    || defaultPatientProfile.antecedents;

  return {
    ...defaultPatientProfile,
    ...state.profile,
    avatar: state.profile.avatar || apiProfile.photoProfil || defaultPatientProfile.avatar,
    backendId: apiProfile.id || state.profile.backendId || getStoredUser()?.id || null,
    id: apiProfile.numeroAssure || state.profile.id,
    nom: apiProfile.nom || state.profile.nom,
    prenoms: apiProfile.prenom || apiProfile.prenoms || state.profile.prenoms,
    dateNaissance: apiProfile.dateNaissance || state.profile.dateNaissance,
    sexe: apiProfile.sexe || state.profile.sexe,
    telephone: apiProfile.telephone || state.profile.telephone,
    email: apiProfile.email || state.profile.email,
    adresse: apiProfile.adresse || state.profile.adresse,
    profession: apiProfile.profession || state.profile.profession,
    situationFamiliale: apiProfile.situationFamiliale || state.profile.situationFamiliale,
    numeroUrgence: apiProfile.numeroUrgence || state.profile.numeroUrgence,
    personneUrgence: apiProfile.personneUrgence || state.profile.personneUrgence,
    lienUrgence: apiProfile.lienUrgence || state.profile.lienUrgence,
    assurance: apiProfile.assurance || state.profile.assurance,
    numeroAssure: apiProfile.numeroAssure || state.profile.numeroAssure,
    poids: apiProfile.poids ?? state.profile.poids,
    taille: apiProfile.taille ?? state.profile.taille,
    groupeSanguin: apiProfile.groupeSanguin || state.profile.groupeSanguin,
    allergies: apiProfile.allergies || carnet?.allergies || state.profile.allergies,
    antecedents: antecedentsText,
    maladiesChroniques: apiProfile.maladiesChroniques || carnet?.maladiesChroniques || state.profile.maladiesChroniques,
    traitements: apiProfile.traitements || carnet?.traitementsEnCours || state.profile.traitements,
    handicap: apiProfile.handicap || state.profile.handicap,
    medecinTraitant: apiProfile.medecinTraitant || state.profile.medecinTraitant,
    specialiteMedecin: apiProfile.specialiteMedecin || state.profile.specialiteMedecin,
    telephoneMedecin: apiProfile.telephoneMedecin || state.profile.telephoneMedecin,
    notesPatient: apiProfile.notesPatient || state.profile.notesPatient
  };
}

function normalizeRappels(rappels = []) {
  if (!rappels.length) return [...defaultRappels];
  return rappels.map((item, index) => ({
    id: item.id ?? `r-${index + 1}`,
    type: item.type || "rappel",
    titre: item.titre || "Rappel patient",
    description: item.description || "",
    moment: item.dateHeure ? formatLongDateTime(item.dateHeure) : "A programmer",
    urgence: item.urgence || "bientot",
    fait: Boolean(item.fait),
    dateHeure: item.dateHeure || null
  }));
}

function normalizeHistoriqueFromCarnet(carnet) {
  const entries = [
    ...(carnet?.antecedents || []).map((item) => ({
      date: (item.dateDebut || "").slice(0, 7) || "Date inconnue",
      titre: item.libelle || "Antecedent medical",
      detail: item.details || "Aucun detail renseigne."
    })),
    ...(carnet?.conditions || []).map((item) => ({
      date: (item.dateDiagnostic || "").slice(0, 7) || "Date inconnue",
      titre: item.libelle || "Condition medicale",
      detail: item.traitement || item.details || "Aucun detail renseigne."
    }))
  ].filter((item) => item.titre);

  return entries.length ? entries : [...defaultHistoriqueMedical];
}

function buildPatientPayload(profile) {
  return {
    nom: profile.nom,
    prenom: profile.prenoms,
    email: profile.email,
    telephone: profile.telephone,
    numeroAssure: profile.numeroAssure,
    photoProfil: profile.avatar || "",
    dateNaissance: profile.dateNaissance || null,
    sexe: profile.sexe,
    adresse: profile.adresse,
    profession: profile.profession,
    situationFamiliale: profile.situationFamiliale,
    numeroUrgence: profile.numeroUrgence,
    personneUrgence: profile.personneUrgence,
    lienUrgence: profile.lienUrgence,
    assurance: profile.assurance,
    poids: profile.poids ? Number(profile.poids) : null,
    taille: profile.taille ? Number(profile.taille) : null,
    groupeSanguin: profile.groupeSanguin,
    handicap: profile.handicap,
    notesPatient: profile.notesPatient,
    medecinTraitant: profile.medecinTraitant,
    specialiteMedecin: profile.specialiteMedecin,
    telephoneMedecin: profile.telephoneMedecin,
    allergies: profile.allergies,
    antecedents: profile.antecedents,
    maladiesChroniques: profile.maladiesChroniques,
    traitements: profile.traitements
  };
}

function buildCarnetPayload(profile = state.profile) {
  return {
    id: state.carnetMedical?.id || null,
    allergies: profile.allergies || "",
    maladiesChroniques: profile.maladiesChroniques || "",
    traitementsEnCours: profile.traitements || "",
    antecedents: profile.antecedents
      ? [{ id: state.carnetMedical?.antecedents?.[0]?.id || null, libelle: "Antecedents medicaux", details: profile.antecedents, actif: true }]
      : [],
    conditions: Array.isArray(state.carnetMedical?.conditions) ? state.carnetMedical.conditions : [],
    rappels: state.rappels.map((item) => ({
      id: typeof item.id === "number" ? item.id : null,
      type: item.type,
      titre: item.titre,
      description: item.description,
      dateHeure: item.dateHeure || null,
      urgence: item.urgence,
      fait: Boolean(item.fait)
    }))
  };
}

function getCurrentPatientId(profile = state.profile) {
  return profile.numeroAssure || defaultPatientProfile.numeroAssure;
}

function getSharedPatientData(profile = state.profile) {
  const patientIds = new Set([
    String(getCurrentPatientId(profile) || ""),
    String(profile.backendId || ""),
    String(profile.id || "")
  ].filter(Boolean));
  const shared = loadSharedRecords();
  return {
    consultations: shared.consultations.filter((item) => patientIds.has(String(item.patientId))),
    ordonnances: shared.ordonnances.filter((item) => patientIds.has(String(item.patientId))),
    documents: shared.documents.filter((item) => patientIds.has(String(item.patientId))),
    vitals: shared.vitals.filter((item) => patientIds.has(String(item.patientId))),
    timeline: shared.timeline.filter((item) => patientIds.has(String(item.patientId)))
  };
}

function sortByDateDesc(items, getDateValue) {
  return items.slice().sort((a, b) => new Date(getDateValue(b)) - new Date(getDateValue(a)));
}

function getAllConsultations(profile = state.profile) {
  const shared = getSharedPatientData(profile).consultations;
  return sortByDateDesc([...shared, ...state.consultations], (item) => `${item.date}T${item.heure || "00:00"}`);
}

function getAllOrdonnances(profile = state.profile) {
  const shared = getSharedPatientData(profile).ordonnances;
  return sortByDateDesc([...shared, ...state.ordonnances], (item) => item.date);
}

function getAllDocuments(profile = state.profile) {
  const shared = getSharedPatientData(profile).documents;
  return sortByDateDesc([...shared, ...state.documents], (item) => item.date);
}

function getAllTimelineEntries(profile = state.profile) {
  const shared = getSharedPatientData(profile).timeline.map((item) => ({
    date: item.date.slice(0, 7),
    titre: item.titre,
    detail: item.detail
  }));
  return sortByDateDesc([...shared, ...state.historiqueMedical], (item) => `${item.date}-01`);
}

function getLatestVital(profile = state.profile) {
  return sortByDateDesc(getSharedPatientData(profile).vitals, (item) => `${item.date}T${item.heure || "00:00"}`)[0] || null;
}

function getInitials(profile) {
  const nom = profile.nom || "";
  const prenoms = profile.prenoms || "";
  return `${nom.charAt(0)}${prenoms.charAt(0)}`.toUpperCase() || "MB";
}

function applyPatientAvatar(profile = state.profile) {
  document.querySelectorAll("[data-patient-avatar], .sb-avatar[data-patient-initials], .profile-avatar-xl[data-patient-initials]").forEach((node) => {
    if (profile.avatar) {
      node.style.backgroundImage = `url(${profile.avatar})`;
      node.style.backgroundSize = "cover";
      node.style.backgroundPosition = "center";
      node.textContent = "";
      return;
    }
    node.style.backgroundImage = "";
    node.style.backgroundSize = "";
    node.style.backgroundPosition = "";
    node.textContent = getInitials(profile);
  });
}

async function persistPatientAvatar(avatar) {
  const nextProfile = { ...state.profile, avatar };
  try {
    if (state.apiEnabled) {
      await saveProfileToApi(nextProfile);
    } else {
      saveProfile(nextProfile);
    }
    applyPatientAvatar(state.profile);
    fillProfileSummary(state.profile);
    fillProfileForm(state.profile);
    buildSidebar(state.profile, window.location.pathname.split("/").pop() || "dashboard.html");
    setText("[data-profile-feedback]", "Photo de profil mise a jour.");
  } catch (error) {
    console.error(error);
    setText("[data-profile-feedback]", "Impossible d'enregistrer la photo pour le moment.");
  }
}

function initGlobalPatientPhotoShortcut() {
  const footer = document.querySelector(".sb-footer");
  if (!footer || footer.querySelector("[data-patient-photo-shortcut]")) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-secondary btn-sm sidebar-photo-btn";
  button.dataset.patientPhotoShortcut = "true";
  button.textContent = "Changer photo";

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.hidden = true;

  button.addEventListener("click", () => input.click());
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const avatar = typeof reader.result === "string" ? reader.result : "";
      if (!avatar) return;
      await persistPatientAvatar(avatar);
      input.value = "";
    };
    reader.readAsDataURL(file);
  });

  footer.appendChild(button);
  footer.appendChild(input);
}

function getAge(profile) {
  if (!profile.dateNaissance) return "--";
  const birthDate = new Date(profile.dateNaissance);
  const now = new Date();
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

function formatLongDateTime(dateValue) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(dateValue));
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value ?? "";
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

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

function openPreviewWindow(title, content) {
  const preview = window.open("", "_blank", "noopener,noreferrer,width=860,height=720");
  if (!preview) return;

  preview.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f4f7fb; margin:0; padding:32px; color:#10213a; }
    .sheet { max-width:780px; margin:0 auto; background:#fff; border-radius:20px; padding:32px; box-shadow:0 24px 70px rgba(16,33,58,.12); }
    h1 { margin:0 0 12px; font-size:28px; }
    .meta { color:#5b6b84; margin-bottom:24px; }
    ul { padding-left:20px; }
    li { margin-bottom:8px; }
    p { line-height:1.6; }
  </style>
</head>
<body>
  <div class="sheet">
    ${content}
  </div>
</body>
</html>`);
  preview.document.close();
}

function downloadPatientOrdonnance(ordonnanceId) {
  const ordonnance = getAllOrdonnances().find((item) => item.id === ordonnanceId);
  if (!ordonnance) return;

  const content = [
    "MediBook - Ordonnance",
    `Reference: ${ordonnance.id}`,
    `Date: ${formatLongDate(ordonnance.date)}`,
    `Statut: ${ordonnance.statut}`,
    `Medecin: ${ordonnance.medecin}`,
    `Specialite: ${ordonnance.specialite}`,
    "",
    "Medicaments:",
    ...ordonnance.medicaments.map((line, index) => `${index + 1}. ${line}`)
  ].join("\n");

  triggerFileDownload(`${sanitizeFilename(ordonnance.id)}.txt`, content);
}

function downloadPatientDocument(documentId) {
  const documentItem = getAllDocuments().find((item) => String(item.id) === String(documentId));
  if (!documentItem) return;

  const content = [
    "MediBook - Document medical",
    `Nom: ${documentItem.nom}`,
    `Categorie: ${documentItem.categorie}`,
    `Date: ${formatLongDate(documentItem.date)}`,
    `Source: ${documentItem.source}`,
    `Format indique: ${documentItem.format}`
  ];

  if (documentItem.categorie === "certificat") {
    content.push(
      `Type: ${documentItem.type || "medical"}`,
      `Destinataire: ${documentItem.destinataire || "A qui de droit"}`,
      `Motif: ${documentItem.motif || "Non renseigne"}`,
      `Restrictions: ${documentItem.restrictions || "Aucune"}`
    );
    if (documentItem.debutArret || documentItem.finArret) {
      content.push(`Periode: ${documentItem.debutArret || "--"} au ${documentItem.finArret || "--"}`);
    }
  } else if (documentItem.categorie === "ordonnance") {
    content.push("", "Medicaments:");
    (documentItem.medicaments || []).forEach((line, index) => {
      content.push(`${index + 1}. ${line}`);
    });
    if (documentItem.recommandations) {
      content.push("", `Recommandations: ${documentItem.recommandations}`);
    }
  } else {
    content.push("", "Export de demonstration du document selectionne.");
  }

  triggerFileDownload(`${sanitizeFilename(documentItem.nom)}.txt`, content.join("\n"));
}

function viewPatientOrdonnance(ordonnanceId) {
  const ordonnance = getAllOrdonnances().find((item) => item.id === ordonnanceId);
  if (!ordonnance) return;

  const medicines = ordonnance.medicaments.map((line) => `<li>${line}</li>`).join("");
  openPreviewWindow(
    `Ordonnance ${ordonnance.id}`,
    `
      <h1>Ordonnance ${ordonnance.id}</h1>
      <div class="meta">Emise le ${formatLongDate(ordonnance.date)} · ${ordonnance.medecin} · ${ordonnance.specialite}</div>
      <p><strong>Statut :</strong> ${ordonnance.statut}</p>
      <h2>Prescription</h2>
      <ul>${medicines}</ul>
    `
  );
}

function viewPatientDocument(documentId) {
  const documentItem = getAllDocuments().find((item) => String(item.id) === String(documentId));
  if (!documentItem) return;

  if (documentItem.categorie === "certificat") {
    const arret = documentItem.debutArret || documentItem.finArret
      ? `<p><strong>Periode :</strong> ${escapeHtml(documentItem.debutArret || "--")} au ${escapeHtml(documentItem.finArret || "--")}</p>`
      : "";
    openPreviewWindow(
      documentItem.nom,
      `
        <h1>${escapeHtml(documentItem.nom)}</h1>
        <div class="meta">${escapeHtml(documentItem.source || "Medecin")} · ${formatLongDate(documentItem.date)} · ${escapeHtml(documentItem.format || "PDF")}</div>
        <p><strong>Type :</strong> ${escapeHtml(documentItem.type || "medical")}</p>
        <p><strong>Destinataire :</strong> ${escapeHtml(documentItem.destinataire || "A qui de droit")}</p>
        <p><strong>Motif :</strong> ${escapeHtml(documentItem.motif || "Non renseigne")}</p>
        <p><strong>Restrictions :</strong> ${escapeHtml(documentItem.restrictions || "Aucune restriction renseignee")}</p>
        ${arret}
      `
    );
    return;
  }

  if (documentItem.categorie === "ordonnance") {
    const medicines = (documentItem.medicaments || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("");
    openPreviewWindow(
      documentItem.nom,
      `
        <h1>${escapeHtml(documentItem.nom)}</h1>
        <div class="meta">${escapeHtml(documentItem.source || "Medecin")} · ${formatLongDate(documentItem.date)} · ${escapeHtml(documentItem.format || "PDF")}</div>
        <p><strong>Medecin :</strong> ${escapeHtml(documentItem.medecin || documentItem.source || "Non renseigne")} · ${escapeHtml(documentItem.specialite || "Specialite non renseignee")}</p>
        <h2>Prescription</h2>
        <ul>${medicines || "<li>Aucun medicament renseigne.</li>"}</ul>
        <p><strong>Recommandations :</strong> ${escapeHtml(documentItem.recommandations || "Aucune recommandation complementaire")}</p>
      `
    );
    return;
  }

  openPreviewWindow(
    documentItem.nom,
    `
      <h1>${documentItem.nom}</h1>
      <div class="meta">${documentItem.source} · ${formatLongDate(documentItem.date)} · ${documentItem.format}</div>
      <p><strong>Categorie :</strong> ${documentItem.categorie}</p>
      <p>Visualisation de demonstration du document selectionne depuis l'espace patient.</p>
    `
  );
}

function getPendingRappelsCount() {
  return state.rappels.filter((item) => !item.fait).length;
}

function getPatientNotificationItems() {
  return state.rappels.map((item) => ({
    title: item.titre,
    body: item.description,
    time: item.moment,
    tag: item.type,
    status: item.fait ? "Traite" : "A suivre"
  }));
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
      const badge = item.key === "rappels.html" && getPendingRappelsCount() > 0
        ? `<span class="sb-badge">${getPendingRappelsCount()}</span>`
        : "";
      return `<a class="sb-item ${active}" href="${item.href}"><span class="sb-icon">${item.icon}</span><span>${item.label}</span>${badge}</a>`;
    }).join("");
    return `<div class="sb-section"><span class="sb-section-label">${section}</span>${links}</div>`;
  }).join("");

  setText("[data-patient-name]", `${profile.nom} ${profile.prenoms}`);
  setText("[data-patient-role]", "Patient");
  setText("[data-patient-initials]", getInitials(profile));
  setText("[data-patient-id]", profile.numeroAssure || profile.id);
  applyPatientAvatar(profile);
}

function renderTopbar(profile, currentPage) {
  const topbarRight = document.querySelector(".topbar-right");
  if (!topbarRight) return;

  const pendingRappels = getPendingRappelsCount();
  const currentLabel = patientGlobalSearchItems.find((item) => item.href === currentPage)?.title || "ce dossier";

  topbarRight.innerHTML = `
    <div class="patient-search-shell topbar-search-shell" data-patient-global-search>
      <label class="searchbar" aria-label="Recherche globale">
        <span>🔎</span>
        <input
          class="patient-global-search-input"
          type="search"
          placeholder="Rechercher dans ${currentLabel.toLowerCase()}..."
          autocomplete="off"
        >
      </label>
      <div class="patient-search-results" data-patient-global-results></div>
    </div>
    <div class="notif-shell" data-notif-shell>
      <button class="icon-btn icon-btn-count" type="button" title="Notifications et rappels" aria-label="Notifications et rappels" data-count="${pendingRappels}" data-patient-notifications>
        🔔
      </button>
      <div class="notif-menu" data-notif-menu></div>
    </div>
    <a class="icon-btn logout" href="../login.html" title="Deconnexion" aria-label="Deconnexion">🚪</a>
  `;
}

function renderPatientGlobalSearchResults(query) {
  const resultsRoot = document.querySelector("[data-patient-global-results]");
  const searchShell = document.querySelector("[data-patient-global-search]");
  if (!resultsRoot || !searchShell) return;

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    resultsRoot.innerHTML = "";
    searchShell.classList.remove("open");
    return;
  }

  const matches = patientGlobalSearchItems.filter((item) => {
    return `${item.title} ${item.meta}`.toLowerCase().includes(normalizedQuery);
  }).slice(0, 6);

  if (!matches.length) {
    resultsRoot.innerHTML = `<div class="patient-search-empty">Aucun resultat trouve.</div>`;
    searchShell.classList.add("open");
    return;
  }

  resultsRoot.innerHTML = matches.map((item) => {
    return `<a class="patient-search-item" href="${item.href}"><span class="patient-search-avatar">MB</span><span class="patient-search-copy"><strong>${item.title}</strong><small>${item.meta}</small></span></a>`;
  }).join("");
  searchShell.classList.add("open");
}

function bindPatientGlobalSearch() {
  const searchShell = document.querySelector("[data-patient-global-search]");
  const input = document.querySelector(".patient-global-search-input");
  if (!searchShell || !input) return;

  input.addEventListener("input", () => {
    renderPatientGlobalSearchResults(input.value);
  });

  input.addEventListener("focus", () => {
    renderPatientGlobalSearchResults(input.value);
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-patient-global-search]")) {
      searchShell.classList.remove("open");
    }
  });
}

function renderPatientNotificationsMenu() {
  const menu = document.querySelector("[data-notif-menu]");
  if (!menu) return;

  const items = getPatientNotificationItems();
  menu.innerHTML = `
    <div class="notif-menu-head">
      <strong>Notifications patient</strong>
      <span>${items.length} element(s) disponibles</span>
    </div>
    <div class="notif-menu-list">
      ${items.length ? items.map((item) => `
        <article class="notif-item">
          <div class="notif-item-head">
            <div class="notif-item-title">${item.title}</div>
            <div class="notif-item-time">${item.time}</div>
          </div>
          <div class="notif-item-copy">${item.body}</div>
          <div class="notif-item-meta">
            <span class="notif-item-tag">${item.tag}</span>
            <span class="badge ${item.status === "Traite" ? "badge-green" : "badge-amber"}">${item.status}</span>
          </div>
        </article>
      `).join("") : `<div class="notif-empty">Aucune notification pour le moment.</div>`}
    </div>
  `;
}

function bindPatientNotifications() {
  const shell = document.querySelector("[data-notif-shell]");
  const button = document.querySelector("[data-patient-notifications]");
  if (!shell || !button) return;

  renderPatientNotificationsMenu();

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    renderPatientNotificationsMenu();
    shell.classList.toggle("open");
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-notif-shell]")) {
      shell.classList.remove("open");
    }
  });
}

function renderDashboard(profile) {
  const consultationItems = getAllConsultations(profile);
  const ordonnanceItems = getAllOrdonnances(profile);
  const documentItems = getAllDocuments(profile);

  const statsRoot = document.querySelector("[data-patient-stats]");
  if (statsRoot) {
    statsRoot.innerHTML = `
      <div class="stat-card" data-emoji="🩺"><div class="stat-accent" style="background:var(--teal-500)"></div><div class="stat-val">${consultationItems.length}</div><div class="stat-label">Consultations</div><div class="stat-trend trend-up">Historique complet</div></div>
      <div class="stat-card" data-emoji="💊"><div class="stat-accent" style="background:var(--green)"></div><div class="stat-val">${ordonnanceItems.filter((item) => item.statut === "active").length}</div><div class="stat-label">Ordonnances actives</div><div class="stat-trend trend-up">Suivi a jour</div></div>
      <div class="stat-card" data-emoji="📄"><div class="stat-accent" style="background:var(--blue)"></div><div class="stat-val">${documentItems.length}</div><div class="stat-label">Documents disponibles</div><div class="stat-trend">Mises a jour automatiques</div></div>
      <div class="stat-card" data-emoji="🔔"><div class="stat-accent" style="background:var(--amber)"></div><div class="stat-val">${getPendingRappelsCount()}</div><div class="stat-label">Rappels actifs</div><div class="stat-trend trend-amber">Suivi du carnet medical</div></div>
    `;
  }

  const consultationsRoot = document.querySelector("[data-dashboard-consultations]");
  if (consultationsRoot) {
    consultationsRoot.innerHTML = consultationItems.slice(0, 3).map((item) => {
      const [day, month] = formatShortDate(item.date).split(" ");
      const badgeClass = item.statut === "avenir" ? "badge-amber" : "badge-green";
      const badgeLabel = item.statut === "avenir" ? "A venir" : "Terminee";
      return `<div class="consult-item"><div class="consult-date-box"><div class="consult-date-d">${day}</div><div class="consult-date-m">${month}</div></div><div class="flex-1"><div class="consult-title">${item.titre}</div><div class="consult-sub">${item.medecin} · ${item.specialite} · ${item.heure}</div></div><span class="badge ${badgeClass}">${badgeLabel}</span></div>`;
    }).join("");
  }

  const medsRoot = document.querySelector("[data-dashboard-ordonnances]");
  if (medsRoot) {
    medsRoot.innerHTML = ordonnanceItems.filter((item) => item.statut === "active").map((item) => {
      return `<div class="medoc-item"><div class="patient-ava sm">💊</div><div class="flex-1"><div class="medoc-name">${item.id}</div><div class="medoc-detail">${item.medicaments.join(" · ")}</div></div></div>`;
    }).join("");
  }

  const nextAppointment = consultationItems.find((item) => item.statut === "avenir");
  if (nextAppointment) {
    setText("[data-next-appointment-date]", formatLongDate(nextAppointment.date));
    setText("[data-next-appointment-copy]", `${nextAppointment.medecin} · ${nextAppointment.heure} · ${nextAppointment.specialite}`);
  } else {
    setText("[data-next-appointment-date]", "Aucun rendez-vous programme");
    setText("[data-next-appointment-copy]", "Votre prochain rendez-vous apparaitra ici.");
  }

  setText("[data-dashboard-greeting]", `Bonjour, ${(profile.prenoms || "").split(" ")[0] || "Patient"}`);
  setText("[data-profile-age]", `${getAge(profile)} ans`);
  setText("[data-profile-groupe]", profile.groupeSanguin || "--");
}

function renderConsultations() {
  const listRoot = document.querySelector("[data-consultation-list]");
  if (!listRoot) return;

  const query = (document.querySelector("[data-consultation-search]")?.value || "").toLowerCase();
  const activeFilter = document.querySelector(".chip.sel")?.dataset.filter || "toutes";
  const items = getAllConsultations().filter((item) => {
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

  root.innerHTML = getAllOrdonnances().map((item) => {
    const badgeClass = item.statut === "active" ? "badge-green" : "badge-amber";
    const badgeLabel = item.statut === "active" ? "Active" : "Expiree";
    const meds = item.medicaments.map((medicament) => `<li>${medicament}</li>`).join("");
    return `<article class="card ordonnance-card"><div class="card-header"><div><div class="card-title">${item.id}</div><div class="consult-sub">Emise le ${formatLongDate(item.date)}</div></div><span class="badge ${badgeClass}">${badgeLabel}</span></div><div class="ordo-doctor-line">${item.medecin} · ${item.specialite}</div><ul class="ordonnance-list">${meds}</ul><div class="card-actions"><button class="btn btn-primary btn-sm" type="button" data-download-ordonnance="${item.id}">Telecharger</button><button class="btn btn-secondary btn-sm" type="button" data-view-ordonnance="${item.id}">Voir</button></div></article>`;
  }).join("");
}

function renderDocuments() {
  const root = document.querySelector("[data-documents-list]");
  if (!root) return;
  const activeFilter = document.querySelector(".dpill.sel")?.dataset.category || "tous";
  const items = getAllDocuments().filter((item) => activeFilter === "tous" || item.categorie === activeFilter);

  root.innerHTML = items.map((item) => {
    const icon = item.categorie === "analyse" ? "🧪" : item.categorie === "ordonnance" ? "💊" : "📋";
    return `<article class="card document-card"><div class="document-icon">${icon}</div><div class="document-name">${item.nom}</div><div class="document-meta">${item.source} · ${formatLongDate(item.date)} · ${item.format}</div><div class="card-actions"><button class="btn btn-primary btn-sm" type="button" data-download-document="${item.id}">Telecharger</button><button class="btn btn-secondary btn-sm" type="button" data-view-document="${item.id}">Voir</button></div></article>`;
  }).join("");
}

function renderRappels() {
  const root = document.querySelector("[data-rappels-list]");
  if (!root) return;
  root.innerHTML = state.rappels.map((item) => {
    const badgeClass = item.urgence === "urgent" ? "badge-red" : item.urgence === "confirme" ? "badge-green" : "badge-amber";
    const badgeLabel = item.urgence === "urgent" ? "Urgent" : item.urgence === "confirme" ? "Confirme" : "A suivre";
    const icon = item.type === "medicament" ? "💊" : item.type === "rdv" ? "🗓️" : "🔔";
    return `<div class="rappel-item"><div class="rappel-icon-box ${item.urgence === "urgent" ? "amber" : ""}">${icon}</div><div class="flex-1"><div class="consult-title">${item.titre}</div><div class="consult-sub">${item.description}</div><div class="patient-meta">${item.moment}</div></div><span class="badge ${badgeClass}">${badgeLabel}</span>${item.type === "medicament" ? `<button class="btn btn-secondary btn-sm" type="button" data-rappel-done="${item.id}">${item.fait ? "Pris" : "Marquer pris"}</button>` : ""}</div>`;
  }).join("");
}

function renderCarnet(profile) {
  const latestVital = getLatestVital(profile);
  const effectivePoids = latestVital?.poids || profile.poids;
  const effectiveTaille = latestVital?.taille || profile.taille;
  const effectiveProfile = { ...profile, poids: effectivePoids, taille: effectiveTaille };
  const vitalsRoot = document.querySelector("[data-carnet-vitals]");
  if (vitalsRoot) {
    const imc = getImc(effectiveProfile);
    const extraCards = latestVital
      ? `<div class="vital-card"><div class="vital-icon">🌡️</div><div class="vital-val">${latestVital.temp}°C</div><div class="vital-lbl">Temperature</div></div><div class="vital-card"><div class="vital-icon">❤️</div><div class="vital-val">${latestVital.fc} bpm</div><div class="vital-lbl">Frequence cardiaque</div></div><div class="vital-card"><div class="vital-icon">🫁</div><div class="vital-val">${latestVital.spo2}%</div><div class="vital-lbl">SpO2</div></div><div class="vital-card"><div class="vital-icon">🩺</div><div class="vital-val">${latestVital.taSys}/${latestVital.taDia}</div><div class="vital-lbl">Tension</div></div>`
      : "";
    vitalsRoot.innerHTML = `<div class="vital-card"><div class="vital-icon">📏</div><div class="vital-val">${effectiveTaille || "--"} cm</div><div class="vital-lbl">Taille</div></div><div class="vital-card"><div class="vital-icon">⚖️</div><div class="vital-val">${effectivePoids || "--"} kg</div><div class="vital-lbl">Poids</div></div><div class="vital-card"><div class="vital-icon">🫀</div><div class="vital-val">${imc || "--"}</div><div class="vital-lbl">IMC</div></div><div class="vital-card"><div class="vital-icon">🩸</div><div class="vital-val">${profile.groupeSanguin || "--"}</div><div class="vital-lbl">Groupe sanguin</div></div>${extraCards}`;
  }

  const allergiesRoot = document.querySelector("[data-carnet-allergies]");
  if (allergiesRoot) allergiesRoot.innerHTML = `<span class="badge badge-red">${profile.allergies || "Aucune allergie declaree"}</span>`;

  const antecedentsRoot = document.querySelector("[data-carnet-antecedents]");
  if (antecedentsRoot) antecedentsRoot.innerHTML = `<div class="info-stack"><div><strong>Antecedents</strong><p>${profile.antecedents || "Aucun antecedent declare."}</p></div><div><strong>Maladies chroniques</strong><p>${profile.maladiesChroniques || "Aucune maladie chronique declaree."}</p></div><div><strong>Traitements en cours</strong><p>${profile.traitements || "Aucun traitement renseigne."}</p></div></div>`;

  const historyRoot = document.querySelector("[data-carnet-history]");
  if (historyRoot) historyRoot.innerHTML = getAllTimelineEntries(profile).map((item) => `<div class="timeline-entry"><div class="timeline-date">${item.date}</div><div class="timeline-title">${item.titre}</div><div class="consult-sub">${item.detail}</div></div>`).join("");
}

function fillProfileSummary(profile) {
  setText("[data-profile-fullname]", `${profile.nom} ${profile.prenoms}`);
  setText("[data-profile-profession]", profile.profession || "Profession non renseignee");
  setText("[data-profile-assurance]", `${profile.assurance || "Assurance non renseignee"} · ${profile.numeroAssure || "--"}`);
  setText("[data-profile-age]", `${getAge(profile)} ans`);
  setText("[data-profile-groupe]", profile.groupeSanguin || "--");
  setText("[data-profile-doctor]", `${profile.medecinTraitant || "Medecin non renseigne"} · ${profile.specialiteMedecin || "Specialite non renseignee"}`);
  setText("[data-profile-doctor-phone]", profile.telephoneMedecin || "Non renseigne");
  applyPatientAvatar(profile);
}

function fillProfileForm(profile) {
  const form = document.querySelector("[data-profile-form]");
  if (!form) return;
  Object.entries(profile).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (field) field.value = value ?? "";
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

function syncProfileStateWithHash() {
  applyProfileState(window.location.hash === "#edit-profile");
}

function renderProfile(profile) {
  fillProfileSummary(profile);
  fillProfileForm(profile);
  syncProfileStateWithHash();
}

async function saveProfileToApi(profile) {
  const backendId = getCurrentPatientBackendId();
  if (!backendId) return false;

  const updated = await apiRequest(`/patients/${backendId}`, {
    method: "PUT",
    body: JSON.stringify(buildPatientPayload(profile))
  });

  let carnet = state.carnetMedical;
  try {
    carnet = await apiRequest(`/patients/${backendId}/carnet-medical`);
  } catch {
    carnet = state.carnetMedical;
  }

  state.apiEnabled = true;
  state.carnetMedical = carnet;
  state.profile = normalizePatientProfile(updated, carnet);
  state.rappels = normalizeRappels(carnet?.rappels || []);
  state.historiqueMedical = normalizeHistoriqueFromCarnet(carnet);
  saveProfile(state.profile);
  return true;
}

function bindProfileForm(profile) {
  const form = document.querySelector("[data-profile-form]");
  if (!form) return;
  const photoInput = document.getElementById("profilePhotoInput");

  document.querySelectorAll("[data-enable-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      applyProfileState(true);
      history.replaceState(null, "", "#edit-profile");
      form.querySelector("input:not([disabled]), textarea:not([disabled]), select:not([disabled])")?.focus();
    });
  });

  document.querySelectorAll("[data-cancel-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      fillProfileForm(state.profile);
      applyPatientAvatar(state.profile);
      if (photoInput) {
        photoInput.value = "";
      }
      applyProfileState(false);
      history.replaceState(null, "", "profil.html");
    });
  });

  photoInput?.addEventListener("change", () => {
    const file = photoInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const avatar = typeof reader.result === "string" ? reader.result : "";
      state.profile = { ...state.profile, avatar };
      applyPatientAvatar(state.profile);
      setText("[data-profile-feedback]", "Nouvelle photo prete a etre enregistree.");
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;
    if (target.name === "poids" || target.name === "taille") {
      const draft = {
        ...state.profile,
        poids: Number(form.elements.namedItem("poids").value),
        taille: Number(form.elements.namedItem("taille").value)
      };
      const imc = getImc(draft);
      setText("[data-profile-imc]", imc ? `${imc} IMC` : "IMC indisponible");
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nextProfile = { ...state.profile };
    Array.from(form.elements).forEach((element) => {
      if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
        if (element.name) nextProfile[element.name] = element.value;
      }
    });
    nextProfile.poids = nextProfile.poids ? Number(nextProfile.poids) : null;
    nextProfile.taille = nextProfile.taille ? Number(nextProfile.taille) : null;

    try {
      if (state.apiEnabled) {
        await saveProfileToApi(nextProfile);
      } else {
        saveProfile(nextProfile);
      }

      fillProfileSummary(state.profile);
      fillProfileForm(state.profile);
      buildSidebar(state.profile, "profil.html");
      renderPatientNotificationsMenu();
      applyPatientAvatar(state.profile);
      applyProfileState(false);
      history.replaceState(null, "", "profil.html");
      setText("[data-profile-feedback]", "Profil mis a jour avec succes.");
    } catch (error) {
      console.error(error);
      setText("[data-profile-feedback]", "Impossible de sauvegarder le profil pour le moment.");
    }
  });

  window.addEventListener("hashchange", () => {
    syncProfileStateWithHash();
    if (window.location.hash === "#edit-profile") {
      form.querySelector("input:not([disabled]), textarea:not([disabled]), select:not([disabled])")?.focus();
    }
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

function getDocumentsLinkedToConsultation(consultationId) {
  const shared = getSharedPatientData();
  return shared.documents.filter((item) => String(item.consultationId || "") === String(consultationId || ""));
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
    const consultation = getAllConsultations().find((item) => String(item.id) === button.dataset.openConsultation);
    if (!consultation) return;
    setText("[data-modal-title]", consultation.titre);
    setText("[data-modal-date]", `${formatLongDate(consultation.date)} a ${consultation.heure}`);
    setText("[data-modal-medecin]", `${consultation.medecin} · ${consultation.specialite}`);
    setText("[data-modal-symptomes]", consultation.symptomes);
    setText("[data-modal-diagnostic]", consultation.diagnostic);
    setText("[data-modal-traitement]", consultation.traitement);
    setText("[data-modal-observations]", consultation.observations || "Aucune observation complementaire.");
    const linkedDocuments = getDocumentsLinkedToConsultation(consultation.id);
    setText(
      "[data-modal-documents]",
      linkedDocuments.length
        ? linkedDocuments.map((item) => `${item.nom} (${item.categorie})`).join(" · ")
        : "Aucun document lie a cette consultation."
    );
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

async function persistRappelsIfPossible() {
  if (!state.apiEnabled || !getCurrentPatientBackendId()) return;
  try {
    const carnet = await apiRequest(`/patients/${getCurrentPatientBackendId()}/carnet-medical`, {
      method: "PUT",
      body: JSON.stringify(buildCarnetPayload())
    });
    state.carnetMedical = carnet;
    state.rappels = normalizeRappels(carnet?.rappels || []);
  } catch (error) {
    console.error(error);
  }
}

function bindRappels() {
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-rappel-done]");
    if (!button) return;
    const rappel = state.rappels.find((item) => String(item.id) === button.dataset.rappelDone);
    if (!rappel) return;
    rappel.fait = !rappel.fait;
    renderRappels();
    buildSidebar(state.profile, "rappels.html");
    document.querySelector("[data-patient-notifications]")?.setAttribute("data-count", String(getPendingRappelsCount()));
    renderPatientNotificationsMenu();
    await persistRappelsIfPossible();
  });
}

function bindPatientDownloads() {
  document.addEventListener("click", (event) => {
    const ordonnanceButton = event.target.closest("[data-download-ordonnance]");
    if (ordonnanceButton) {
      downloadPatientOrdonnance(ordonnanceButton.dataset.downloadOrdonnance);
      return;
    }

    const documentButton = event.target.closest("[data-download-document]");
    if (documentButton) {
      downloadPatientDocument(documentButton.dataset.downloadDocument);
    }
  });
}

function bindPatientViews() {
  document.addEventListener("click", (event) => {
    const ordonnanceButton = event.target.closest("[data-view-ordonnance]");
    if (ordonnanceButton) {
      viewPatientOrdonnance(ordonnanceButton.dataset.viewOrdonnance);
      return;
    }

    const documentButton = event.target.closest("[data-view-document]");
    if (documentButton) {
      viewPatientDocument(documentButton.dataset.viewDocument);
    }
  });
}

async function hydratePatientStateFromApi() {
  const backendId = getCurrentPatientBackendId();
  if (!backendId) return;

  try {
    const [apiProfile, carnet] = await Promise.all([
      apiRequest(`/patients/${backendId}`),
      apiRequest(`/patients/${backendId}/carnet-medical`).catch(() => null)
    ]);

    state.apiEnabled = true;
    state.carnetMedical = carnet;
    state.profile = normalizePatientProfile(apiProfile, carnet);
    state.rappels = normalizeRappels(carnet?.rappels || []);
    state.historiqueMedical = normalizeHistoriqueFromCarnet(carnet);
    saveProfile(state.profile);
  } catch (error) {
    console.error("Chargement backend patient impossible, fallback local conserve.", error);
    state.apiEnabled = false;
  }
}

function rerenderCurrentPage(currentPage) {
  fillProfileSummary(state.profile);
  buildSidebar(state.profile, currentPage);
  document.querySelector("[data-patient-notifications]")?.setAttribute("data-count", String(getPendingRappelsCount()));
  renderPatientNotificationsMenu();

  if (currentPage === "dashboard.html") renderDashboard(state.profile);
  if (currentPage === "consultation.html") renderConsultations();
  if (currentPage === "ordonnances.html") renderOrdonnances();
  if (currentPage === "documents.html") renderDocuments();
  if (currentPage === "rappels.html") renderRappels();
  if (currentPage === "carnet-medical.html") renderCarnet(state.profile);
  if (currentPage === "profil.html") renderProfile(state.profile);
}

document.addEventListener("DOMContentLoaded", async () => {
  const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";

  await hydratePatientStateFromApi();
  buildSidebar(state.profile, currentPage);
  initGlobalPatientPhotoShortcut();
  renderTopbar(state.profile, currentPage);
  bindPatientGlobalSearch();
  bindPatientNotifications();
  bindPatientDownloads();
  bindPatientViews();

  rerenderCurrentPage(currentPage);

  if (currentPage === "consultation.html") bindConsultationFilters();
  if (currentPage === "documents.html") bindDocumentsFilters();
  if (currentPage === "rappels.html") bindRappels();
  if (currentPage === "profil.html") bindProfileForm(state.profile);

  window.addEventListener("storage", async (event) => {
    if (event.key !== SHARED_RECORDS_KEY && event.key !== STORAGE_KEY) return;
    state.profile = loadProfile();
    if (state.apiEnabled) {
      await hydratePatientStateFromApi();
    }
    rerenderCurrentPage(currentPage);
  });
});
