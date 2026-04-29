const API_BASE_URL = "http://localhost:8080/api";
const STORAGE_KEY = "medibook.patient.profile";
const PATIENT_RUNTIME_KEY = "medibook.patient.runtime";
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

const defaultImagesMedicales = [
  { id: 1, nom: "Radiographie thorax", type: "radiographie", date: "2026-02-02", source: "Imagerie Sainte Marie", format: "JPEG", taille: "2.4 Mo", preview: "" },
  { id: 2, nom: "Scanner abdominal", type: "scanner", date: "2025-11-15", source: "CHU de Treichville", format: "DICOM", taille: "48 Mo", preview: "" },
  { id: 3, nom: "Echographie abdominale", type: "echographie", date: "2025-09-22", source: "Clinique Sainte Marie", format: "JPEG", taille: "1.8 Mo", preview: "" }
];

const defaultNotifications = [
  { id: "n1", type: "systeme", titre: "Bienvenue sur MediBook", message: "Votre espace patient est pret. Completez votre profil pour commencer.", date: "A votre inscription", lu: true },
  { id: "n2", type: "alerte", titre: "Ordonnance bientot expiree", message: "L'ordonnance ORD-2026-0021 expire dans 2 jours. Pensez a la renouveler.", date: "Il y a 1 jour", lu: false },
  { id: "n3", type: "rdv", titre: "Rappel de rendez-vous", message: "Consultation de suivi avec Dr. Ange Kouassi le 20 Avril 2026 a 09h30.", date: "Il y a 2 jours", lu: false },
  { id: "n4", type: "medicament", titre: "Prise de medicament", message: "N'oubliez pas votre prise d'Amoxicilline 500 mg ce soir a 20h00.", date: "Aujourd'hui", lu: false },
  { id: "n5", type: "systeme", titre: "Document disponible", message: "Un nouveau certificat medical a ete ajoute a votre dossier.", date: "Il y a 3 jours", lu: true }
];

const defaultHistoriqueMedical = [
  { date: "2026-04", titre: "Bronchite aigue", detail: "Traitement antibiotique de 7 jours avec repos." },
  { date: "2026-03", titre: "Controle annuel", detail: "Bilan complet, surveillance tensionnelle recommandee." },
  { date: "2025-12", titre: "Grippe saisonniere", detail: "Traitement symptomatique et repos." },
  { date: "2025-06", titre: "Hypertension legere detectee", detail: "Suivi regulier et hygiene de vie." }
];

const patientGlobalSearchItems = [
  { href: "dashboard.html", title: "Tableau de bord", meta: "Vue generale de votre espace patient" },
  { href: "profil.html", title: "Gerer mon profil", meta: "Coordonnees et informations personnelles" },
  { href: "profil.html#edit-profile", title: "Modifier mon profil", meta: "Mettre a jour vos informations" },
  { href: "carnet-medical.html", title: "Carnet medical", meta: "Antecedents, allergies et constantes" },
  { href: "documents.html", title: "Documents medicaux", meta: "Certificats, analyses et fichiers" },
  { href: "images-medicales.html", title: "Images medicales", meta: "Radiographies, scanners et IRM" },
  { href: "notifications.html", title: "Notifications", meta: "Alertes et suivi" },
  { href: "rappels.html", title: "Rappels", meta: "Medicaments et rendez-vous" }
];

const state = {
  apiEnabled: false,
  profile: loadProfile(),
  carnetMedical: loadPatientRuntime().carnetMedical,
  consultations: [...defaultConsultations],
  ordonnances: [...defaultOrdonnances],
  documents: [...defaultDocuments],
  rappels: loadPatientRuntime().rappels,
  historiqueMedical: loadPatientRuntime().historiqueMedical
};

function loadPatientRuntime() {
  const fallback = {
    carnetMedical: null,
    rappels: [...defaultRappels],
    historiqueMedical: [...defaultHistoriqueMedical]
  };

  const raw = window.localStorage.getItem(PATIENT_RUNTIME_KEY);
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw);
    return {
      carnetMedical: parsed.carnetMedical || null,
      rappels: normalizeRappels(Array.isArray(parsed.rappels) ? parsed.rappels : []),
      historiqueMedical: Array.isArray(parsed.historiqueMedical) && parsed.historiqueMedical.length
        ? parsed.historiqueMedical
        : [...defaultHistoriqueMedical]
    };
  } catch {
    return fallback;
  }
}

function savePatientRuntime() {
  window.localStorage.setItem(PATIENT_RUNTIME_KEY, JSON.stringify({
    carnetMedical: state.carnetMedical,
    rappels: state.rappels,
    historiqueMedical: state.historiqueMedical
  }));
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

function buildRappelsPayload() {
  return state.rappels.map((item) => ({
    id: typeof item.id === "number" ? item.id : null,
    type: item.type,
    titre: item.titre,
    description: item.description,
    dateHeure: item.dateHeure || null,
    urgence: item.urgence,
    fait: Boolean(item.fait)
  }));
}

function syncRappelsFromBackend(rappels = []) {
  const backendRappels = Array.isArray(rappels) ? rappels : [];
  state.rappels = normalizeRappels(backendRappels);
  state.carnetMedical = {
    ...(state.carnetMedical || {}),
    rappels: backendRappels
  };
  savePatientRuntime();
}

function hasPersistedRappel(rappel) {
  return Array.isArray(state.carnetMedical?.rappels)
    && state.carnetMedical.rappels.some((item) => String(item.id) === String(rappel.id));
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
  const backend = (state.backendConsultations || []).map(c => ({
    id: `api-${c.id}`,
    date: c.dateConsultation,
    heure: c.heureConsultation?.slice(0, 5) || "00:00",
    titre: c.motifPrincipal || "Consultation",
    etablissement: "Clinique/Hopital",
    medecin: c.medecinNom || "Medecin",
    specialite: "Medecine",
    statut: new Date(c.dateConsultation) > new Date() ? "avenir" : "terminee",
    symptomes: c.symptomes,
    diagnostic: c.diagnostic,
    traitement: c.traitement
  }));
  return sortByDateDesc([...shared, ...state.consultations, ...backend], (item) => `${item.date}T${item.heure || "00:00"}`);
}

function getAllOrdonnances(profile = state.profile) {
  const shared = getSharedPatientData(profile).ordonnances;
  const backend = (state.backendOrdonnances || []).map(o => ({
    id: `ORD-API-${o.id}`,
    date: o.dateEmission,
    statut: new Date(o.dateValidite || o.dateEmission) >= new Date() ? "active" : "expiree",
    medecin: o.medecinNom || "Medecin",
    specialite: "Medecine",
    medicaments: o.medicaments ? o.medicaments.map(m => `${m.nom} - ${m.posologie} pendant ${m.duree || '-'}`) : []
  }));
  return sortByDateDesc([...shared, ...state.ordonnances, ...backend], (item) => item.date);
}

function getAllDocuments(profile = state.profile) {
  const shared = getSharedPatientData(profile).documents;
  const backend = (state.backendCertificats || []).map(c => ({
    id: `api-cert-${c.id}`,
    nom: c.typeCertificat || "Certificat medical",
    categorie: "certificat",
    source: c.medecinNom || "Medecin",
    format: "PDF",
    date: c.dateEmission
  }));
  return sortByDateDesc([...shared, ...state.documents, ...backend], (item) => item.date);
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

function downloadPatientImage(imageId) {
  const img = defaultImagesMedicales.find((item) => String(item.id) === String(imageId));
  if (!img) return;

  if (img.preview && img.preview.startsWith("data:")) {
    const link = document.createElement("a");
    link.href = img.preview;
    link.download = sanitizeFilename(img.nom) + "." + (img.format.toLowerCase() === "image" ? "jpeg" : img.format.toLowerCase());
    document.body.appendChild(link);
    link.click();
    link.remove();
  } else {
    const content = [
      "MediBook - Image medicale",
      `Nom: ${img.nom}`,
      `Type: ${img.type}`,
      `Date: ${formatLongDate(img.date)}`,
      `Source: ${img.source}`,
      `Format indique: ${img.format}`,
      `Taille: ${img.taille}`
    ].join("\n");
    triggerFileDownload(`${sanitizeFilename(img.nom)}.txt`, content);
  }
}

function viewPatientImage(imageId) {
  const img = defaultImagesMedicales.find((item) => String(item.id) === String(imageId));
  if (!img) return;

  if (img.preview) {
    openPreviewWindow(
      img.nom,
      `
        <h1>${escapeHtml(img.nom)}</h1>
        <div class="meta">${escapeHtml(img.source)} · ${formatLongDate(img.date)} · ${escapeHtml(img.taille)}</div>
        <div style="text-align: center; margin-top: 20px;">
          <img src="${img.preview}" alt="${escapeHtml(img.nom)}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
        </div>
      `
    );
  } else {
    openPreviewWindow(
      img.nom,
      `
        <h1>${escapeHtml(img.nom)}</h1>
        <div class="meta">${escapeHtml(img.source)} · ${formatLongDate(img.date)} · ${escapeHtml(img.taille)}</div>
        <p>Apercu non disponible pour cette image.</p>
      `
    );
  }
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
    { href: "profil.html", label: "Gerer mon profil", icon: "👤", section: "Espace", key: "profil.html" },
    { href: "carnet-medical.html", label: "Carnet medical", icon: "📋", section: "Sante", key: "carnet-medical.html" },
    { href: "documents.html", label: "Documents medicaux", icon: "📄", section: "Documents", key: "documents.html" },
    { href: "images-medicales.html", label: "Images medicales", icon: "🖼️", section: "Documents", key: "images-medicales.html" },
    { href: "notifications.html", label: "Notifications", icon: "🔔", section: "Suivi", key: "notifications.html" },
    { href: "rappels.html", label: "Rappels", icon: "⏰", section: "Suivi", key: "rappels.html" }
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
      const notifCount = getUnreadNotificationsCount();
      let badge = "";
      if (item.key === "rappels.html" && getPendingRappelsCount() > 0) {
        badge = `<span class="sb-badge">${getPendingRappelsCount()}</span>`;
      } else if (item.key === "notifications.html" && notifCount > 0) {
        badge = `<span class="sb-badge">${notifCount}</span>`;
      }
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

function getUnreadNotificationsCount() {
  return defaultNotifications.filter((n) => !n.lu).length + state.rappels.filter((r) => !r.fait).length;
}

function renderDashboard(profile) {
  const documentItems = getAllDocuments(profile);
  const unreadNotifs = getUnreadNotificationsCount();

  const statsRoot = document.querySelector("[data-patient-stats]");
  if (statsRoot) {
    statsRoot.innerHTML = `
      <div class="stat-card" data-emoji="👤"><div class="stat-accent" style="background:var(--teal-500)"></div><div class="stat-val">1</div><div class="stat-label">Mon profil</div><div class="stat-trend trend-up">A jour</div></div>
      <div class="stat-card" data-emoji="📋"><div class="stat-accent" style="background:var(--blue)"></div><div class="stat-val">${getAllTimelineEntries(profile).length}</div><div class="stat-label">Carnet medical</div><div class="stat-trend">Historique complet</div></div>
      <div class="stat-card" data-emoji="📄"><div class="stat-accent" style="background:var(--green)"></div><div class="stat-val">${documentItems.length}</div><div class="stat-label">Documents</div><div class="stat-trend">Disponibles</div></div>
      <div class="stat-card" data-emoji="🔔"><div class="stat-accent" style="background:var(--amber)"></div><div class="stat-val">${unreadNotifs}</div><div class="stat-label">Notifications</div><div class="stat-trend trend-amber">Non lues</div></div>
    `;
  }

  const notifBadge = document.querySelector("[data-dashboard-notif-count]");
  if (notifBadge) {
    notifBadge.textContent = unreadNotifs > 0 ? `${unreadNotifs} non lue(s)` : "";
  }

  const nextAppointment = getAllConsultations(profile).find((item) => item.statut === "avenir");
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
  if (historyRoot) historyRoot.innerHTML = getAllTimelineEntries(profile).map((item) => `<div class="timeline-entry"><div class="timeline-date">${item.date}</div><div class="timeline-title">${item.titre}</div><div class="consult-sub" style="margin-top: 8px; font-size: 13px; line-height: 1.6; color: var(--slate-700);">${item.detail}</div></div>`).join("");
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
    carnet = await apiRequest(`/patients/carnets-medicaux/patient/${backendId}`);
  } catch {
    carnet = state.carnetMedical;
  }

  state.apiEnabled = true;
  state.carnetMedical = carnet;
  state.profile = normalizePatientProfile(updated, carnet);
  state.rappels = normalizeRappels(carnet?.rappels || []);
  state.historiqueMedical = normalizeHistoriqueFromCarnet(carnet);
  saveProfile(state.profile);
  savePatientRuntime();
  return true;
}

function bindProfileForm(profile) {
  const form = document.querySelector("[data-profile-form]");
  if (!form) return;
  const photoInput = document.getElementById("profilePhotoInput");
  const photoTrigger = document.querySelector("[data-profile-photo-trigger]");

  const enableEditMode = () => {
    applyProfileState(true);
    history.replaceState(null, "", "#edit-profile");
  };

  document.querySelectorAll("[data-enable-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      enableEditMode();
      form.querySelector("input:not([disabled]), textarea:not([disabled]), select:not([disabled])")?.focus();
    });
  });

  photoTrigger?.addEventListener("click", () => {
    enableEditMode();
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
      enableEditMode();
      applyPatientAvatar(state.profile);
      setText("[data-profile-feedback]", "Nouvelle photo prete. Enregistrez les modifications pour la valider.");
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
  if (!state.apiEnabled || !getCurrentPatientBackendId()) {
    savePatientRuntime();
    return;
  }
  try {
    const rappels = await apiRequest(`/patients/rappels/patient/${getCurrentPatientBackendId()}`, {
      method: "PUT",
      body: JSON.stringify(buildRappelsPayload())
    });
    syncRappelsFromBackend(rappels);
  } catch (error) {
    console.error(error);
  }
}

async function persistSingleRappelIfPossible(rappel) {
  if (!state.apiEnabled || !getCurrentPatientBackendId()) {
    savePatientRuntime();
    return;
  }

  if (!hasPersistedRappel(rappel)) {
    await persistRappelsIfPossible();
    return;
  }

  try {
    const updated = await apiRequest(`/patients/rappels/${rappel.id}/patient/${getCurrentPatientBackendId()}/statut`, {
      method: "PATCH",
      body: JSON.stringify({ fait: Boolean(rappel.fait) })
    });

    const nextRappels = (state.carnetMedical?.rappels || []).map((item) =>
      String(item.id) === String(updated.id) ? { ...item, ...updated } : item
    );
    syncRappelsFromBackend(nextRappels);
  } catch (error) {
    console.error(error);
    await persistRappelsIfPossible();
  }
}

function bindRappels() {
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-rappel-done]");
    if (!button) return;
    const rappel = state.rappels.find((item) => String(item.id) === button.dataset.rappelDone);
    if (!rappel) return;
    rappel.fait = !rappel.fait;
    savePatientRuntime();
    renderRappels();
    buildSidebar(state.profile, "rappels.html");
    document.querySelector("[data-patient-notifications]")?.setAttribute("data-count", String(getPendingRappelsCount()));
    renderPatientNotificationsMenu();
    await persistSingleRappelIfPossible(rappel);
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
      return;
    }

    const imageButton = event.target.closest("[data-download-image]");
    if (imageButton) {
      downloadPatientImage(imageButton.dataset.downloadImage);
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
      return;
    }

    const imageButton = event.target.closest("[data-view-image]");
    if (imageButton) {
      viewPatientImage(imageButton.dataset.viewImage);
    }
  });
}

async function hydratePatientStateFromApi() {
  const backendId = getCurrentPatientBackendId();
  if (!backendId) return;

  try {
    const [apiProfile, carnet, rappels, consultations, ordonnances, certificats, imagesMedicales] = await Promise.all([
      apiRequest(`/patients/${backendId}`),
      apiRequest(`/patients/carnets-medicaux/patient/${backendId}`).catch(() => null),
      apiRequest(`/patients/rappels/patient/${backendId}`).catch(() => null),
      apiRequest(`/medecins/consultations/patient/${backendId}`).catch(() => []),
      apiRequest(`/medecins/ordonnances/patient/${backendId}`).catch(() => []),
      apiRequest(`/medecins/certificats/patient/${backendId}`).catch(() => []),
      apiRequest(`/patients/images-medicales/patient/${backendId}`).catch(() => [])
    ]);

    const backendRappels = Array.isArray(rappels) ? rappels : (carnet?.rappels || []);
    
    // Mettre a jour les images medicales
    if (Array.isArray(imagesMedicales) && imagesMedicales.length > 0) {
        defaultImagesMedicales.length = 0; // Vider le mock
        imagesMedicales.forEach(img => {
            defaultImagesMedicales.push({
                id: img.id,
                nom: img.nom,
                type: img.type,
                date: img.dateImage,
                source: img.source,
                format: img.format,
                taille: img.taille,
                preview: img.donnees
            });
        });
    }
    state.apiEnabled = true;
    state.carnetMedical = carnet ? { ...carnet, rappels: backendRappels } : { ...(state.carnetMedical || {}), rappels: backendRappels };
    state.profile = normalizePatientProfile(apiProfile, state.carnetMedical);
    state.rappels = normalizeRappels(backendRappels);
    
    // Convertir les consultations du medecin en historique medical et consultations
    const medecinHistorique = Array.isArray(consultations) ? consultations.map(c => ({
      date: c.dateConsultation ? c.dateConsultation.slice(0, 7) : "Date inconnue",
      titre: `Consultation - ${c.motifPrincipal || 'Motif non renseigne'}`,
      detail: `<strong>Médecin:</strong> ${c.medecinNom || 'Non spécifié'}<br>
               <strong>Symptômes:</strong> ${c.symptomes || 'Non précisés'}<br>
               <strong>Diagnostic:</strong> ${c.diagnostic || 'Non précisé'}<br>
               <strong>Traitement:</strong> ${c.traitement || 'Non précisé'}<br>
               <strong>Observations:</strong> ${c.observations || 'Aucune'}`
    })) : [];
    
    state.historiqueMedical = [...normalizeHistoriqueFromCarnet(state.carnetMedical), ...medecinHistorique];
    
    state.backendConsultations = Array.isArray(consultations) ? consultations : [];
    state.backendOrdonnances = Array.isArray(ordonnances) ? ordonnances : [];
    state.backendCertificats = Array.isArray(certificats) ? certificats : [];
    
    saveProfile(state.profile);
    savePatientRuntime();
  } catch (error) {
    console.error("Chargement backend patient impossible, fallback local conserve.", error);
    state.apiEnabled = false;
  }
}

function renderNotificationsPage() {
  const root = document.querySelector("[data-notif-page-list]");
  if (!root) return;
  const activeFilter = document.querySelector(".dpill.sel[data-notif-filter]")?.dataset.notifFilter || "toutes";
  const allNotifs = [
    ...defaultNotifications,
    ...state.rappels.map((r) => ({ id: `r-${r.id}`, type: r.type, titre: r.titre, message: r.description, date: r.moment, lu: r.fait }))
  ];
  const filtered = allNotifs.filter((n) => {
    if (activeFilter === "non-lues") return !n.lu;
    if (activeFilter === "lues") return n.lu;
    return true;
  });
  setText("[data-notif-page-count]", `${filtered.length} notification(s)`);
  if (!filtered.length) {
    root.innerHTML = `<div class="notif-page-empty"><div class="notif-page-empty-icon">🔔</div><p>Aucune notification pour le moment.</p></div>`;
    return;
  }
  root.innerHTML = filtered.map((n) => {
    const icon = n.type === "medicament" ? "💊" : n.type === "rdv" ? "🗓️" : n.type === "alerte" ? "⚠️" : "🔔";
    const unreadClass = n.lu ? "" : "unread";
    const badgeClass = n.lu ? "badge-green" : "badge-amber";
    const badgeLabel = n.lu ? "Lu" : "Non lu";
    return `<div class="notif-page-item ${unreadClass}"><div class="notif-page-icon ${n.type}">${icon}</div><div class="notif-page-body"><div class="notif-page-title">${n.titre}</div><div class="notif-page-msg">${n.message}</div><div class="notif-page-time">${n.date}</div></div><div class="notif-page-right"><span class="badge ${badgeClass}">${badgeLabel}</span></div></div>`;
  }).join("");
}

function renderImagesMedicales() {
  const root = document.querySelector("[data-images-list]");
  if (!root) return;
  const activeFilter = document.querySelector(".dpill.sel[data-img-filter]")?.dataset.imgFilter || "toutes";
  const items = defaultImagesMedicales.filter((img) => activeFilter === "toutes" || img.type === activeFilter);
  setText("[data-images-count]", `${items.length} image(s)`);
  root.innerHTML = items.map((img) => {
    const typeIcon = img.type === "radiographie" ? "🩻" : img.type === "scanner" ? "🔬" : img.type === "irm" ? "🧲" : "📷";
    return `<article class="image-card"><div class="image-card-preview">${typeIcon}</div><div class="image-card-body"><div class="image-card-name">${img.nom}</div><div class="image-card-meta">${img.source} · ${formatLongDate(img.date)} · ${img.taille}</div><div class="image-card-actions"><button class="btn btn-primary btn-sm" type="button" data-download-image="${img.id}">Telecharger</button><button class="btn btn-secondary btn-sm" type="button" data-view-image="${img.id}">Voir</button></div></div></article>`;
  }).join("");
}

function bindNotifFilters() {
  document.querySelectorAll("[data-notif-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-notif-filter]").forEach((b) => b.classList.remove("sel"));
      btn.classList.add("sel");
      renderNotificationsPage();
    });
  });
}

function bindImageFilters() {
  document.querySelectorAll("[data-img-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-img-filter]").forEach((b) => b.classList.remove("sel"));
      btn.classList.add("sel");
      renderImagesMedicales();
    });
  });
}

function bindUploadZone() {
  const zone = document.querySelector("[data-upload-zone]");
  const input = document.querySelector("[data-image-upload-input]");
  if (!zone || !input) return;
  zone.addEventListener("click", () => input.click());
  zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("drag-over"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", (e) => { e.preventDefault(); zone.classList.remove("drag-over"); handleImageFiles(e.dataTransfer.files); });
  input.addEventListener("change", () => handleImageFiles(input.files));
}

function handleImageFiles(files) {
  if (!files || !files.length) return;
  const backendId = getCurrentPatientBackendId();
  
  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const fileData = typeof reader.result === "string" ? reader.result : "";
      const newImg = {
        nom: file.name.replace(/\.[^.]+$/, ""),
        type: "radiographie",
        dateImage: new Date().toISOString().slice(0, 10),
        source: "Telecharge par le patient",
        format: file.type.split("/")[1]?.toUpperCase() || "IMAGE",
        taille: (file.size / (1024 * 1024)).toFixed(1) + " Mo",
        donnees: fileData
      };
      
      try {
        if (state.apiEnabled && backendId) {
          const savedImg = await apiRequest(`/patients/images-medicales/patient/${backendId}`, {
            method: "POST",
            body: JSON.stringify(newImg)
          });
          newImg.id = savedImg.id;
          newImg.date = savedImg.dateImage;
          newImg.preview = savedImg.donnees;
        } else {
          newImg.id = Date.now() + Math.random();
          newImg.date = newImg.dateImage;
          newImg.preview = newImg.donnees;
        }
        
        defaultImagesMedicales.unshift(newImg);
        renderImagesMedicales();
        alert("Image importée avec succès !");
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'image:", error);
        alert("Erreur lors de l'enregistrement de l'image.");
      }
    };
    reader.readAsDataURL(file);
  });
}

function rerenderCurrentPage(currentPage) {
  fillProfileSummary(state.profile);
  buildSidebar(state.profile, currentPage);
  document.querySelector("[data-patient-notifications]")?.setAttribute("data-count", String(getUnreadNotificationsCount()));
  renderPatientNotificationsMenu();

  if (currentPage === "dashboard.html") renderDashboard(state.profile);
  if (currentPage === "consultation.html") renderConsultations();
  if (currentPage === "ordonnances.html") renderOrdonnances();
  if (currentPage === "documents.html") renderDocuments();
  if (currentPage === "rappels.html") renderRappels();
  if (currentPage === "carnet-medical.html") renderCarnet(state.profile);
  if (currentPage === "profil.html") renderProfile(state.profile);
  if (currentPage === "notifications.html") renderNotificationsPage();
  if (currentPage === "images-medicales.html") renderImagesMedicales();
}

document.addEventListener("DOMContentLoaded", async () => {
  const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";

  await hydratePatientStateFromApi();
  buildSidebar(state.profile, currentPage);
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
  if (currentPage === "notifications.html") bindNotifFilters();
  if (currentPage === "images-medicales.html") { bindImageFilters(); bindUploadZone(); }

  window.addEventListener("storage", async (event) => {
    if (event.key !== SHARED_RECORDS_KEY && event.key !== STORAGE_KEY && event.key !== PATIENT_RUNTIME_KEY) return;
    state.profile = loadProfile();
    const runtime = loadPatientRuntime();
    state.carnetMedical = runtime.carnetMedical;
    state.rappels = runtime.rappels;
    state.historiqueMedical = runtime.historiqueMedical;
    if (state.apiEnabled) {
      await hydratePatientStateFromApi();
    }
    rerenderCurrentPage(currentPage);
  });
});
