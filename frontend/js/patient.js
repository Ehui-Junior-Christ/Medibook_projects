/* ============================================================
   MediBook – patient.js
   Logique complète du module Patient
   Auteur : Bie Jacquy Sergine

   Pages gérées :
     - dashboard.html
     - profil.html
     - carnet-medical.html
     - consultations.html
     - ordonnances.html
     - documents.html
     - rappels.html
   ============================================================ */

/* ============================================================
   DONNÉES MOCK
   Remplacer par PatientAPI.xxx() quand le backend est prêt
   ============================================================ */

const mockPatient = {
  id: 1,
  nom: "Kouadio",
  prenom: "Jean Baptiste",
  cmu: "CMU-2024-08821",
  dateNaissance: "14/03/1987",
  age: 37,
  sexe: "Masculin",
  telephone: "+225 07 12 34 56",
  email: "jb.kouadio@email.ci",
  initiales: "KJ",
  conditions: [
    { label: "🩸 O+ Rhésus+",           classe: "badge-teal"  },
    { label: "⚠️ Allergie Pénicilline",  classe: "badge-red"   },
    { label: "💙 Hypertension",          classe: "badge-amber" }
  ],
  etablissements: [
    "🏥 CHU de Treichville",
    "🏥 Clinique Sainte Marie",
    "🏥 Polyclinique Internationale"
  ]
};

const mockStats = {
  consultations: 12,
  ordonnances: 5,
  documents: 8,
  rdv: 1
};

const mockConsultations = [
  {
    id: 1,
    jour: "12", mois: "Mar", annee: "2025",
    titre: "Fièvre persistante",
    detail: "Paludisme P. falciparum · CHU Treichville",
    medecin: "Dr. Bamba A.",
    ta: "130/85", temp: "39.2°C", fc: "98 bpm"
  },
  {
    id: 2,
    jour: "02", mois: "Fév", annee: "2025",
    titre: "Bilan cardiologique",
    detail: "Contrôle HTA · Clinique Sainte Marie",
    medecin: "Dr. Koné M.",
    ta: "145/92", temp: "37.0°C", fc: "78 bpm"
  },
  {
    id: 3,
    jour: "15", mois: "Jan", annee: "2025",
    titre: "Bilan annuel de routine",
    detail: "Polyclinique Internationale d'Abidjan",
    medecin: "Dr. Traoré S.",
    ta: "128/82", temp: "36.8°C", fc: "74 bpm"
  }
];

const mockOrdonnances = [
  {
    id: 1,
    jour: "12", mois: "Mar",
    titre: "Artéméther/Luméfantrine + Paracétamol",
    medecin: "Dr. Bamba A.",
    nbMedicaments: 2,
    validite: "valide 30 jours",
    statut: "active"
  },
  {
    id: 2,
    jour: "02", mois: "Fév",
    titre: "Amlodipine 5mg + Losartan 50mg",
    medecin: "Dr. Koné M.",
    nbMedicaments: 2,
    validite: "renouvelable",
    statut: "active"
  }
];

const mockDocuments = [
  { id: 1, icone: "🧪", nom: "Bilan sanguin NFS", date: "12 Mar 2025", type: "analyse",      format: "PDF"  },
  { id: 2, icone: "🩻", nom: "Radiographie thorax", date: "02 Fév 2025", type: "image",       format: "JPEG" },
  { id: 3, icone: "📋", nom: "Compte-rendu cardio",  date: "02 Fév 2025", type: "compte-rendu", format: "PDF"  }
];

const mockRappelsMedicaments = [
  { heure: "08h00", icone: "💊", classeIcone: "",      nom: "Amlodipine 5mg",  detail: "1 comprimé · matin · tous les jours",   warning: false },
  { heure: "20h00", icone: "💊", classeIcone: "",      nom: "Losartan 50mg",   detail: "1 comprimé · soir · tous les jours",    warning: false }
];

const mockRappelsRdv = [
  { heure: "28 Mar", icone: "📅", classeIcone: "amber", nom: "Cardiologie – Dr. Koné M.", detail: "10h30 · Clinique Sainte Marie", warning: true }
];

const mockCarnet = {
  antecedentsPerso: [
    { annee: "2020", label: "Paludisme à P. falciparum",  type: "passee"   },
    { annee: "2018", label: "Fièvre typhoïde",            type: "passee"   },
    { annee: null,   label: "Hypertension artérielle",    type: "chronique"}
  ],
  antecedentsFamiliaux: [
    { parent: "👨 Père", maladie: "Diabète type 2" },
    { parent: "👩 Mère", maladie: "Hypertension"   }
  ],
  allergies: [
    { nom: "Pénicilline", detail: "Réaction allergique sévère", classe: "badge-red"   },
    { nom: "AINS",        detail: "Intolérance digestive",      classe: "badge-amber" }
  ],
  armoire: [
    { nom: "Amlodipine 5mg",  detail: "1x/j matin · en cours" },
    { nom: "Losartan 50mg",   detail: "1x/j soir · en cours"  }
  ]
};

/* ============================================================
   UTILITAIRES COMMUNS
   ============================================================ */

function logout() {
  localStorage.removeItem("medibook_token");
  localStorage.removeItem("medibook_user");
  window.location.href = "../../pages/login.html";
}

function initLogout() {
  const b1 = document.getElementById("btn-logout");
  const b2 = document.getElementById("btn-logout-top");
  if (b1) b1.addEventListener("click", logout);
  if (b2) b2.addEventListener("click", logout);
}

function initSidebar() {
  const av = document.getElementById("sb-avatar");
  const nm = document.getElementById("sb-name");
  if (av) av.textContent = mockPatient.initiales;
  if (nm) nm.textContent = mockPatient.prenom + " " + mockPatient.nom.charAt(0) + ".";
}

function renderBadges(containerId, conditions) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = "";
  conditions.forEach(c => {
    el.innerHTML += `<span class="badge ${c.classe}">${c.label}</span>`;
  });
}

/* ============================================================
   DASHBOARD – dashboard.html
   ============================================================ */

function initDashboard() {
  if (!document.getElementById("stat-consultations")) return;

  /* Stats */
  document.getElementById("stat-consultations").textContent = mockStats.consultations;
  document.getElementById("stat-ordonnances").textContent   = mockStats.ordonnances;
  document.getElementById("stat-documents").textContent     = mockStats.documents;
  document.getElementById("stat-rdv").textContent           = mockStats.rdv;

  /* Conditions */
  renderBadges("conditions-badges", mockPatient.conditions);

  /* Consultations récentes */
  const listeCo = document.getElementById("liste-consultations");
  if (listeCo) {
    listeCo.innerHTML = "";
    mockConsultations.slice(0, 3).forEach(c => {
      listeCo.innerHTML += buildConsultItem(c);
    });
  }

  /* Rappels */
  const listeRa = document.getElementById("liste-rappels");
  if (listeRa) {
    listeRa.innerHTML = "";
    [...mockRappelsMedicaments, ...mockRappelsRdv].forEach(r => {
      listeRa.innerHTML += buildRappelItem(r);
    });
    const cnt = document.getElementById("rappels-count");
    if (cnt) cnt.textContent = mockRappelsMedicaments.length + mockRappelsRdv.length;
  }

  /* Recherche */
  const search = document.getElementById("search-input");
  if (search) {
    search.addEventListener("input", function () {
      const q = this.value.toLowerCase();
      document.querySelectorAll(".consult-item").forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(q) ? "" : "none";
      });
    });
  }
}

/* ============================================================
   PROFIL – profil.html
   ============================================================ */

function initProfil() {
  if (!document.getElementById("profil-ava")) return;

  /* Remplir les champs */
  document.getElementById("profil-ava").textContent  = mockPatient.initiales;
  document.getElementById("profil-nom").textContent  = mockPatient.prenom + " " + mockPatient.nom;
  document.getElementById("profil-cmu").textContent  = mockPatient.cmu;

  document.getElementById("inp-nom").value      = mockPatient.nom;
  document.getElementById("inp-prenom").value   = mockPatient.prenom;
  document.getElementById("inp-tel").value      = mockPatient.telephone;
  document.getElementById("inp-email").value    = mockPatient.email;
  document.getElementById("inp-cmu").value      = mockPatient.cmu;

  /* Conditions */
  renderBadges("conditions-list", mockPatient.conditions);

  /* Établissements */
  const etEl = document.getElementById("etablissements-list");
  if (etEl) {
    etEl.innerHTML = "";
    mockPatient.etablissements.forEach(e => {
      etEl.innerHTML += `<div style="font-size:13px">${e}</div>`;
    });
  }

  /* Modifier / Annuler / Sauvegarder */
  const btnEdit      = document.getElementById("btn-edit");
  const btnAnnuler   = document.getElementById("btn-annuler");
  const btnSave      = document.getElementById("btn-sauvegarder");
  const actionsBar   = document.getElementById("actions-profil");
  const inputs       = document.querySelectorAll("#form-profil input:not([readonly])");

  if (btnEdit) {
    btnEdit.addEventListener("click", function () {
      inputs.forEach(i => i.disabled = false);
      actionsBar.style.display = "flex";
      btnEdit.style.display    = "none";
    });
  }

  if (btnAnnuler) {
    btnAnnuler.addEventListener("click", function () {
      inputs.forEach(i => i.disabled = true);
      actionsBar.style.display = "none";
      btnEdit.style.display    = "";
    });
  }

  if (btnSave) {
    btnSave.addEventListener("click", function () {
      /* Quand backend prêt :
         const payload = { nom: ..., prenom: ..., telephone: ..., email: ... };
         PatientAPI.updateProfil(mockPatient.id, payload).then(...); */
      alert("Profil enregistré ✅ (mock)");
      inputs.forEach(i => i.disabled = true);
      actionsBar.style.display = "none";
      btnEdit.style.display    = "";
    });
  }
}

/* ============================================================
   CARNET MÉDICAL – carnet-medical.html
   ============================================================ */

function initCarnet() {
  if (!document.getElementById("antecedents-perso")) return;

  /* Bannière */
  const banAva  = document.getElementById("banner-ava");
  const banNom  = document.getElementById("banner-nom");
  const banMeta = document.getElementById("banner-meta");
  if (banAva)  banAva.textContent  = mockPatient.initiales;
  if (banNom)  banNom.textContent  = mockPatient.prenom + " " + mockPatient.nom;
  if (banMeta) banMeta.textContent =
    mockPatient.cmu + " · Né le " + mockPatient.dateNaissance +
    " · " + mockPatient.age + " ans · " + mockPatient.sexe;

  renderBadges("banner-badges", mockPatient.conditions);

  /* Antécédents personnels */
  const apEl = document.getElementById("antecedents-perso");
  if (apEl) {
    apEl.innerHTML = "";
    mockCarnet.antecedentsPerso.forEach(a => {
      const badge = a.type === "chronique"
        ? `<span class="badge badge-amber">Chronique</span>`
        : `<span class="badge badge-slate">${a.annee}</span>`;
      apEl.innerHTML +=
        `<div style="display:flex;align-items:center;gap:8px">${badge}<span>${a.label}</span></div>`;
    });
  }

  /* Antécédents familiaux */
  const afEl = document.getElementById("antecedents-familiaux");
  if (afEl) {
    afEl.innerHTML = "";
    mockCarnet.antecedentsFamiliaux.forEach(a => {
      afEl.innerHTML += `<div>${a.parent} – ${a.maladie}</div>`;
    });
  }

  /* Allergies */
  const alEl = document.getElementById("allergies-list");
  if (alEl) {
    alEl.innerHTML = "";
    mockCarnet.allergies.forEach(a => {
      alEl.innerHTML +=
        `<div style="display:flex;align-items:center;gap:8px">
           <span class="badge ${a.classe}">${a.nom}</span>
           <span>${a.detail}</span>
         </div>`;
    });
  }

  /* Armoire */
  const arEl = document.getElementById("armoire-list");
  if (arEl) {
    arEl.innerHTML = "";
    mockCarnet.armoire.forEach(m => {
      arEl.innerHTML +=
        `<div class="medoc-item">
           <span>💊</span>
           <div>
             <div class="medoc-name">${m.nom}</div>
             <div class="medoc-detail">${m.detail}</div>
           </div>
         </div>`;
    });
  }
}

/* ============================================================
   CONSULTATIONS – consultations.html
   ============================================================ */

function initConsultations() {
  const container = document.getElementById("liste-consultations-full");
  if (!container) return;

  const total = document.getElementById("total-consultations");
  if (total) total.textContent = mockConsultations.length + " consultations";

  function render(liste) {
    container.innerHTML = "";
    const empty = document.getElementById("empty-state");
    if (liste.length === 0) {
      if (empty) empty.style.display = "block";
      return;
    }
    if (empty) empty.style.display = "none";
    liste.forEach(c => { container.innerHTML += buildConsultItem(c, true); });
  }

  render(mockConsultations);

  /* Recherche */
  const search = document.getElementById("search-input");
  if (search) {
    search.addEventListener("input", function () {
      const q = this.value.toLowerCase();
      const filtrés = mockConsultations.filter(c =>
        (c.titre + c.detail + c.medecin).toLowerCase().includes(q)
      );
      render(filtrés);
    });
  }

  /* Filtre année */
  const filtreAnnee = document.getElementById("filtre-annee");
  if (filtreAnnee) {
    filtreAnnee.addEventListener("change", function () {
      const annee = this.value;
      const filtrés = annee
        ? mockConsultations.filter(c => c.annee === annee)
        : mockConsultations;
      render(filtrés);
    });
  }
}

/* ============================================================
   ORDONNANCES – ordonnances.html
   ============================================================ */

function initOrdonnances() {
  const container = document.getElementById("liste-ordonnances");
  if (!container) return;

  const actives = mockOrdonnances.filter(o => o.statut === "active");
  const badge = document.getElementById("badge-actives");
  if (badge) badge.textContent = actives.length + " actives";

  container.innerHTML = "";
  mockOrdonnances.forEach(o => {
    container.innerHTML += `
      <div class="consult-item">
        <div class="consult-date-box">
          <div class="consult-date-d">${o.jour}</div>
          <div class="consult-date-m">${o.mois}</div>
        </div>
        <div class="consult-info">
          <div class="consult-title">${o.titre}</div>
          <div class="consult-sub">${o.medecin} · ${o.nbMedicaments} médicaments · ${o.validite}</div>
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          <span class="badge badge-green">Active</span>
          <button class="btn btn-secondary btn-sm" onclick="telechargerPDF(${o.id})">📄 PDF</button>
        </div>
      </div>
    `;
  });
}

/* ============================================================
   DOCUMENTS – documents.html
   ============================================================ */

function initDocuments() {
  const container = document.getElementById("liste-documents");
  if (!container) return;

  function render(liste) {
    container.innerHTML = "";
    liste.forEach(d => {
      container.innerHTML += `
        <div class="card doc-card" onclick="telechargerDoc(${d.id})">
          <div class="doc-icon">${d.icone}</div>
          <div class="doc-name">${d.nom}</div>
          <div class="doc-meta">${d.date} · ${d.format}</div>
          <button class="btn btn-secondary btn-sm" style="margin-top:10px">⬇️ Télécharger</button>
        </div>
      `;
    });
  }

  render(mockDocuments);

  /* Filtre par type */
  const filtre = document.getElementById("filtre-type");
  if (filtre) {
    filtre.addEventListener("change", function () {
      const type = this.value;
      const filtrés = type
        ? mockDocuments.filter(d => d.type === type)
        : mockDocuments;
      render(filtrés);
    });
  }
}

/* ============================================================
   RAPPELS – rappels.html
   ============================================================ */

function initRappels() {
  const listeMed = document.getElementById("liste-rappels-medicaments");
  const listeRdv = document.getElementById("liste-rappels-rdv");
  if (!listeMed && !listeRdv) return;

  if (listeMed) {
    listeMed.innerHTML = "";
    mockRappelsMedicaments.forEach(r => {
      listeMed.innerHTML += buildRappelItem(r);
    });
    const cnt = document.getElementById("count-medicaments");
    if (cnt) cnt.textContent = mockRappelsMedicaments.length;
  }

  if (listeRdv) {
    listeRdv.innerHTML = "";
    mockRappelsRdv.forEach(r => {
      listeRdv.innerHTML += buildRappelItem(r);
    });
    const cnt = document.getElementById("count-rdv");
    if (cnt) cnt.textContent = mockRappelsRdv.length;
  }
}

/* ============================================================
   CONSTRUCTEURS HTML RÉUTILISABLES
   ============================================================ */

function buildConsultItem(c, avecDetails = false) {
  const details = avecDetails
    ? `<div class="consult-sub">TA: ${c.ta} · T°: ${c.temp} · FC: ${c.fc}</div>`
    : `<div class="consult-sub">${c.detail}</div>`;

  return `
    <div class="consult-item">
      <div class="consult-date-box">
        <div class="consult-date-d">${c.jour}</div>
        <div class="consult-date-m">${c.mois}</div>
      </div>
      <div class="consult-info">
        <div class="consult-title">${c.titre}</div>
        ${avecDetails
          ? `<div class="consult-sub">${c.detail}</div>
             <div class="consult-sub" style="margin-top:2px">TA: ${c.ta} · T°: ${c.temp} · FC: ${c.fc}</div>`
          : `<div class="consult-sub">${c.detail}</div>`
        }
      </div>
      <div class="consult-doctor">${c.medecin}</div>
    </div>
  `;
}

function buildRappelItem(r) {
  return `
    <div class="rappel-item ${r.warning ? 'warning' : ''}">
      <div class="rappel-time ${r.warning ? 'warning' : ''}">${r.heure}</div>
      <div class="rappel-icon-box ${r.classeIcone}">${r.icone}</div>
      <div>
        <div class="rappel-name">${r.nom}</div>
        <div class="rappel-detail">${r.detail}</div>
      </div>
    </div>
  `;
}

/* ============================================================
   ACTIONS FICHIERS (mock)
   ============================================================ */

function telechargerPDF(id) {
  /* Quand backend prêt :
     window.open(BASE_URL + "/ordonnances/" + id + "/pdf"); */
  alert("Téléchargement de l'ordonnance #" + id + " (mock)");
}

function telechargerDoc(id) {
  /* Quand backend prêt :
     window.open(BASE_URL + "/documents/" + id + "/download"); */
  alert("Téléchargement du document #" + id + " (mock)");
}

/* ============================================================
   INITIALISATION GLOBALE
   Détecte automatiquement la page active et lance le bon init
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  initSidebar();
  initLogout();

  /* Chaque fonction vérifie si son élément clé existe
     → une seule page sera initialisée par chargement */
  initDashboard();
  initProfil();
  initCarnet();
  initConsultations();
  initOrdonnances();
  initDocuments();
  initRappels();
});