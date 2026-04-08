const DEFAULT_INFIRMIER_SESSION = {
  id: 3,
  nom: "Kone",
  prenom: "Marie",
  initiales: "KM",
  service: "Urgences",
  matricule: "MAT-INF-00087",
  role: "Infirmier",
  telephone: "+225 07 12 34 56",
  email: "marie.kone@medibook.ci",
  bio: "Infirmiere en charge du suivi des soins, des signes vitaux et de la coordination terrain.",
  avatar: ""
};

function getStoredInfirmierSession() {
  const raw = window.localStorage.getItem("infirmierSession");
  if (!raw) return { ...DEFAULT_INFIRMIER_SESSION };

  try {
    return { ...DEFAULT_INFIRMIER_SESSION, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_INFIRMIER_SESSION };
  }
}

let mockInfirmier = getStoredInfirmierSession();

function saveInfirmierSession(updates) {
  mockInfirmier = { ...mockInfirmier, ...updates };
  window.localStorage.setItem("infirmierSession", JSON.stringify(mockInfirmier));
}

const mockPatients = [
  {
    id: 1,
    nom: "Kouadio Jean Baptiste",
    initiales: "KJ",
    cmu: "CMU-2024-08821",
    age: 37,
    couleurAva: "linear-gradient(135deg,#0D8E94,#4DC6C8)",
    conditions: [
      { label: "⚠️ Allergie Pénicilline", classe: "badge-red" },
      { label: "💙 Hypertension",          classe: "badge-amber" }
    ],
    derniereMesure: "Il y a 2h",
    alerte: true,
    alerteMsg: "TA élevée : 145/92"
  },
  {
    id: 2,
    nom: "Assi Koffi Martial",
    initiales: "AK",
    cmu: "CMU-2023-04512",
    age: 52,
    couleurAva: "linear-gradient(135deg,#7c3aed,#a78bfa)",
    conditions: [{ label: "🍬 Diabète", classe: "badge-amber" }],
    derniereMesure: "Il y a 4h",
    alerte: true,
    alerteMsg: "Glycémie élevée : 8.2 mmol/L"
  },
  {
    id: 3,
    nom: "N'guessan Kouamé",
    initiales: "NK",
    cmu: "CMU-2024-11032",
    age: 28,
    couleurAva: "linear-gradient(135deg,#059669,#34d399)",
    conditions: [],
    derniereMesure: "Aujourd'hui 09h30",
    alerte: false,
    alerteMsg: ""
  }
];

const mockSoins = [
  { id: 1, heure: "10h00", date: "14 Mar 2025", patientNom: "Kouadio Jean Baptiste", patientId: 1, type: "Injection IM",       detail: "Artéméther 80mg – bras gauche", infirmier: "Koné M." },
  { id: 2, heure: "08h30", date: "14 Mar 2025", patientNom: "Kouadio Jean Baptiste", patientId: 1, type: "Pansement",           detail: "Plaie avant-bras droit – sterile", infirmier: "Koné M." },
  { id: 3, heure: "14h00", date: "13 Mar 2025", patientNom: "Assi Koffi Martial",    patientId: 2, type: "Prélèvement sanguin", detail: "Prise de sang – NFS + CRP",     infirmier: "Koné M." },
  { id: 4, heure: "11h00", date: "13 Mar 2025", patientNom: "N'guessan Kouamé",      patientId: 3, type: "Perfusion",           detail: "Sérum glucosé 500ml",           infirmier: "Koné M." }
];

const mockVitauxParPatient = {
  1: [
    { id: 1, date: "14 Mar 2025", heure: "09h30", taSys: 145, taDia: 92, temp: 37.1, fc: 78, poids: 82, taille: 175, spo2: 97, glycemie: 5.4, fr: 16, infirmier: "Koné M." },
    { id: 2, date: "12 Mar 2025", heure: "10h00", taSys: 130, taDia: 85, temp: 39.2, fc: 98, poids: 82, taille: 175, spo2: 96, glycemie: 5.1, fr: 18, infirmier: "Koné M." }
  ],
  2: [
    { id: 3, date: "13 Mar 2025", heure: "08h30", taSys: 125, taDia: 80, temp: 36.8, fc: 74, poids: 90, taille: 172, spo2: 98, glycemie: 8.2, fr: 15, infirmier: "Koné M." }
  ],
  3: [
    { id: 4, date: "14 Mar 2025", heure: "09h30", taSys: 118, taDia: 76, temp: 36.6, fc: 70, poids: 75, taille: 180, spo2: 99, glycemie: 5.0, fr: 14, infirmier: "Koné M." }
  ]
};

const mockDocumentsUploades = [
  { id: 1, nom: "bilan-nfs.pdf",       patientNom: "Kouadio Jean Baptiste", type: "Analyse biologique", date: "14 Mar 2025", taille: "1.2 MB" },
  { id: 2, nom: "radio-thorax.jpg",    patientNom: "Kouadio Jean Baptiste", type: "Radiographie",       date: "12 Mar 2025", taille: "3.8 MB" },
  { id: 3, nom: "echo-abdomen.jpg",    patientNom: "Assi Koffi Martial",    type: "Échographie",        date: "13 Mar 2025", taille: "4.1 MB" }
];

/* ============================================================
   COULEURS PAR TYPE DE SOIN
   ============================================================ */

const COULEURS_SOINS = {
  "Injection IM":        "badge-teal",
  "Injection IV":        "badge-teal",
  "Injection SC":        "badge-teal",
  "Pansement":           "badge-amber",
  "Perfusion":           "badge-blue",
  "Prélèvement sanguin": "badge-slate",
  "Prélèvement urinaire":"badge-slate",
  "Soin d'hygiène":      "badge-green",
  "Surveillance post-op":"badge-red",
};

function badgeSoin(type) {
  const cls = COULEURS_SOINS[type] || "badge-slate";
  return `<span class="badge ${cls}">${type}</span>`;
}

/* ============================================================
   UTILITAIRES COMMUNS
   ============================================================ */

function logout() {
  localStorage.removeItem("medibook_token");
  localStorage.removeItem("medibook_user");
  window.location.href = "../../pages/login.html";
}

function initSidebar() {
  const av = document.getElementById("sb-avatar");
  const nm = document.getElementById("sb-name");
  if (av) {
    if (mockInfirmier.avatar) {
      av.style.backgroundImage = `url(${mockInfirmier.avatar})`;
      av.style.backgroundSize = "cover";
      av.style.backgroundPosition = "center";
      av.textContent = "";
    } else {
      av.style.backgroundImage = "";
      av.textContent = mockInfirmier.initiales;
    }
  }
  if (nm) nm.textContent = `${mockInfirmier.prenom} ${mockInfirmier.nom}`;
  document.querySelectorAll("[data-infirmier-name]").forEach((node) => {
    node.textContent = `${mockInfirmier.prenom} ${mockInfirmier.nom}`;
  });
  document.querySelectorAll("[data-infirmier-role]").forEach((node) => {
    node.textContent = `${mockInfirmier.role} · ${mockInfirmier.service}`;
  });
  document.querySelectorAll("[data-infirmier-initiales]").forEach((node) => {
    node.textContent = mockInfirmier.initiales;
  });
  document.querySelectorAll("[data-infirmier-service]").forEach((node) => {
    node.textContent = mockInfirmier.service;
  });
  document.querySelectorAll("[data-infirmier-matricule]").forEach((node) => {
    node.textContent = mockInfirmier.matricule;
  });
  document.querySelectorAll("[data-infirmier-phone]").forEach((node) => {
    node.textContent = mockInfirmier.telephone;
  });
  document.querySelectorAll("[data-infirmier-email]").forEach((node) => {
    node.textContent = mockInfirmier.email;
  });
  document.querySelectorAll("[data-infirmier-bio]").forEach((node) => {
    node.textContent = mockInfirmier.bio;
  });
  document.querySelectorAll("[data-infirmier-avatar]").forEach((node) => {
    if (mockInfirmier.avatar) {
      node.style.backgroundImage = `url(${mockInfirmier.avatar})`;
      node.style.backgroundSize = "cover";
      node.style.backgroundPosition = "center";
      node.textContent = "";
    } else {
      node.style.backgroundImage = "";
      node.textContent = mockInfirmier.initiales;
    }
  });
}

function initLogout() {
  const b1 = document.getElementById("btn-logout");
  const b2 = document.getElementById("btn-logout-top");
  if (b1) b1.addEventListener("click", logout);
  if (b2) b2.addEventListener("click", logout);
}

function initNotifications() {
  const topbarRight = document.querySelector(".topbar-right");
  if (!topbarRight) return;

  const notificationItems = [
    { title: "Soin programme", body: "Injection IM prevue pour Kouadio Jean Baptiste.", time: "Aujourd'hui � 10h00", tag: "soin" },
    { title: "Mesure a verifier", body: "La tension de Kouadio Jean Baptiste reste elevee.", time: "Aujourd'hui � 11h20", tag: "vital" },
    { title: "Document ajoute", body: "Un nouveau bilan biologique a ete envoye pour Assi Koffi Martial.", time: "Hier � 17h45", tag: "document" }
  ];

  let notifBtn = document.getElementById("btn-notif");
  if (!notifBtn) {
    notifBtn = document.createElement("div");
    notifBtn.id = "btn-notif";
    notifBtn.className = "icon-btn";
    notifBtn.textContent = String.fromCodePoint(128276);
    topbarRight.prepend(notifBtn);
  }

  notifBtn.classList.add("icon-btn-count");
  notifBtn.setAttribute("data-count", String(notificationItems.length));
  notifBtn.setAttribute("title", "Rappels et notifications");
  notifBtn.textContent = String.fromCodePoint(128276);

  if (!notifBtn.parentElement?.classList.contains("notif-shell")) {
    const shell = document.createElement("div");
    shell.className = "notif-shell";
    notifBtn.parentNode?.insertBefore(shell, notifBtn);
    shell.appendChild(notifBtn);
    const menu = document.createElement("div");
    menu.className = "notif-menu";
    menu.innerHTML = `
      <div class="notif-menu-head">
        <strong>Notifications infirmier</strong>
        <span>${notificationItems.length} element(s) a consulter</span>
      </div>
      <div class="notif-menu-list">
        ${notificationItems.map((item) => `
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
    shell.appendChild(menu);
  }

  notifBtn.addEventListener("click", () => {
    notifBtn.parentElement?.classList.toggle("open");
  });

  document.addEventListener("click", (event) => {
    document.querySelectorAll(".notif-shell").forEach((shell) => {
      if (!shell.contains(event.target)) {
        shell.classList.remove("open");
      }
    });
  });
}

function initProfileForm() {
  const form = document.getElementById("infirmierProfileForm");
  if (!form) return;

  const fields = {
    nomComplet: document.getElementById("ipName"),
    service: document.getElementById("ipService"),
    role: document.getElementById("ipRole"),
    matricule: document.getElementById("ipMatricule"),
    telephone: document.getElementById("ipPhone"),
    email: document.getElementById("ipEmail"),
    bio: document.getElementById("ipBio")
  };
  const avatarInput = document.getElementById("ipAvatar");
  const preview = document.getElementById("ipAvatarPreview");

  if (fields.nomComplet) fields.nomComplet.value = `${mockInfirmier.prenom} ${mockInfirmier.nom}`;
  if (fields.service) fields.service.value = mockInfirmier.service;
  if (fields.role) fields.role.value = mockInfirmier.role;
  if (fields.matricule) fields.matricule.value = mockInfirmier.matricule;
  if (fields.telephone) fields.telephone.value = mockInfirmier.telephone;
  if (fields.email) fields.email.value = mockInfirmier.email;
  if (fields.bio) fields.bio.value = mockInfirmier.bio;

  if (preview) {
    if (mockInfirmier.avatar) {
      preview.style.backgroundImage = `url(${mockInfirmier.avatar})`;
      preview.style.backgroundSize = "cover";
      preview.style.backgroundPosition = "center";
      preview.textContent = "";
    } else {
      preview.style.backgroundImage = "";
      preview.textContent = mockInfirmier.initiales;
    }
  }

  avatarInput?.addEventListener("change", () => {
    const file = avatarInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const avatar = typeof reader.result === "string" ? reader.result : "";
      saveInfirmierSession({ avatar });
      initSidebar();
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

    saveInfirmierSession({
      prenom: mockInfirmier.prenom,
      nom: mockInfirmier.nom,
      initiales: mockInfirmier.initiales,
      service: mockInfirmier.service,
      role: mockInfirmier.role,
      matricule: mockInfirmier.matricule,
      telephone: fields.telephone?.value?.trim() || DEFAULT_INFIRMIER_SESSION.telephone,
      email: fields.email?.value?.trim() || DEFAULT_INFIRMIER_SESSION.email,
      bio: fields.bio?.value?.trim() || DEFAULT_INFIRMIER_SESSION.bio
    });

    initSidebar();
    if (preview && !mockInfirmier.avatar) {
      preview.textContent = mockInfirmier.initiales;
    }
    alert("Profil infirmier mis a jour.");
  });
}

function getPatient(id) {
  return mockPatients.find(p => p.id === parseInt(id));
}

function formatDate() {
  return new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
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

/* ============================================================
   MODALS
   ============================================================ */

function ouvrirModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add("open");
}

function fermerModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove("open");
}

function fermerModalOverlay(event, id) {
  if (event.target === document.getElementById(id)) fermerModal(id);
}

/* ============================================================
   DASHBOARD – dashboard.html
   ============================================================ */

function initDashboard() {
  if (!document.getElementById("stat-patients")) return;

  /* Stats */
  document.getElementById("stat-patients").textContent  = mockPatients.length;
  document.getElementById("stat-vitaux").textContent    = 5;
  document.getElementById("stat-soins").textContent     = mockSoins.filter(s => s.date === "14 Mar 2025").length;
  document.getElementById("stat-documents").textContent = mockDocumentsUploades.length;

  /* Date du jour */
  const dateEl = document.getElementById("date-today");
  if (dateEl) dateEl.textContent = formatDate();

  /* Soins du jour */
  const soinsEl = document.getElementById("liste-soins-jour");
  if (soinsEl) {
    const soinsJour = mockSoins.filter(s => s.date === "14 Mar 2025");
    soinsEl.innerHTML = "";
    soinsJour.forEach(s => {
      soinsEl.innerHTML += `
        <div class="soin-item">
          <div class="soin-heure">${s.heure}</div>
          <div class="soin-type-badge">${badgeSoin(s.type)}</div>
          <div class="soin-detail">${s.detail}</div>
          <div class="soin-patient">${s.patientNom.split(" ")[0]}</div>
        </div>
      `;
    });
    if (soinsJour.length === 0) {
      soinsEl.innerHTML = `<div class="empty-state" style="padding:24px"><div class="empty-icon">🩹</div><div class="empty-txt">Aucun soin enregistré aujourd'hui</div></div>`;
    }
  }

  /* Mesures récentes */
  const mesEl = document.getElementById("liste-mesures-recentes");
  if (mesEl) {
    mesEl.innerHTML = "";
    mockPatients.slice(0, 3).forEach(p => {
      mesEl.innerHTML += `
        <div class="soin-item">
          <div class="patient-ava sm" style="background:${p.couleurAva}">${p.initiales}</div>
          <div class="soin-detail"><strong>${p.nom}</strong></div>
          <div class="soin-patient">${p.derniereMesure}</div>
        </div>
      `;
    });
  }

  /* Alertes */
  const alertesEl = document.getElementById("liste-alertes");
  const alertes = mockPatients.filter(p => p.alerte);
  const badgeAlertes = document.getElementById("badge-alertes");
  if (badgeAlertes) badgeAlertes.textContent = alertes.length;

  if (alertesEl) {
    alertesEl.innerHTML = "";
    alertes.forEach(p => {
      alertesEl.innerHTML += `
        <div class="alerte-item">
          <div class="alerte-dot red"></div>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:600">${p.nom}</div>
            <div style="font-size:11.5px;color:var(--slate-500)">${p.alerteMsg}</div>
          </div>
          <a href="signes-vitaux.html" class="btn btn-secondary btn-sm">Voir</a>
        </div>
      `;
    });
    if (alertes.length === 0) {
      alertesEl.innerHTML = `<div style="font-size:13px;color:var(--slate-400);text-align:center;padding:16px">Aucune alerte</div>`;
    }
  }

  /* Soin rapide depuis le dashboard */
  const inpDate = document.getElementById("soin-date");
  const inpHeure = document.getElementById("soin-heure");
  if (inpDate)  inpDate.value  = new Date().toISOString().split("T")[0];
  if (inpHeure) inpHeure.value = new Date().toTimeString().slice(0, 5);
}

function enregistrerSoin() {
  const patientId = document.getElementById("soin-patient")?.value;
  const type      = document.getElementById("soin-type")?.value;
  const detail    = document.getElementById("soin-detail")?.value;

  if (!patientId || !type) {
    alert("Veuillez sélectionner un patient et un type de soin.");
    return;
  }

  /* Quand backend prêt :
     InfirmierAPI.enregistrerSoin({ patientId, typeSoin: type, description: detail, ... })
       .then(() => { fermerModal('modal-soin'); initDashboard(); }); */

  alert("Soin enregistré ✅ (mock)");
  fermerModal("modal-soin");
}

/* ============================================================
   LISTE PATIENTS – liste-patients.html
   ============================================================ */

function initListePatients() {
  const tbody = document.getElementById("tbody-patients");
  if (!tbody) return;

  function render(liste) {
    tbody.innerHTML = "";
    const empty = document.getElementById("empty-patients");
    if (liste.length === 0) {
      if (empty) empty.style.display = "block";
      return;
    }
    if (empty) empty.style.display = "none";

    liste.forEach(p => {
      const conds = p.conditions.map(c => `<span class="badge ${c.classe}" style="margin-right:3px">${c.label}</span>`).join("") || `<span class="badge badge-slate">Aucune</span>`;
      tbody.innerHTML += `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div class="patient-ava sm" style="background:${p.couleurAva}">${p.initiales}</div>
              <div>
                <div style="font-weight:600">${p.nom}</div>
                <div style="font-size:11.5px;color:var(--slate-500)">${p.cmu}</div>
              </div>
            </div>
          </td>
          <td style="font-family:monospace;font-size:12px">${p.cmu}</td>
          <td>${p.age} ans</td>
          <td>${conds}</td>
          <td style="font-size:12px;color:var(--slate-500)">${p.derniereMesure}</td>
          <td>
            <div style="display:flex;gap:6px">
              <a href="signes-vitaux.html" class="btn btn-primary btn-sm">❤️ Vitaux</a>
              <a href="soins-infirmiers.html" class="btn btn-secondary btn-sm">🩹 Soins</a>
            </div>
          </td>
        </tr>
      `;
    });
  }

  render(mockPatients);

  /* Recherche */
  const search = document.getElementById("search-input");
  if (search) {
    search.addEventListener("input", function () {
      const q = this.value.toLowerCase();
      const filtrés = mockPatients.filter(p =>
        (p.nom + p.cmu).toLowerCase().includes(q)
      );
      render(filtrés);
    });
  }
}

/* ============================================================
   SIGNES VITAUX – signes-vitaux.html
   ============================================================ */

let patientVitauxActif = null;

function chargerPatientVitaux(patientId) {
  const banner   = document.getElementById("patient-banner-vitaux");
  const section  = document.getElementById("section-vitaux");
  const emptyEl  = document.getElementById("vitaux-empty");
  const btnNouvelle = document.getElementById("btn-nouvelle-mesure");

  if (!patientId) {
    if (banner)  banner.style.display  = "none";
    if (section) section.style.display = "none";
    if (emptyEl) emptyEl.style.display = "block";
    if (btnNouvelle) btnNouvelle.disabled = true;
    return;
  }

  patientVitauxActif = parseInt(patientId);
  const p = getPatient(patientId);
  if (!p) return;

  /* Bannière */
  if (banner) {
    banner.style.display = "flex";
    document.getElementById("vit-ava").textContent  = p.initiales;
    document.getElementById("vit-ava").style.background = p.couleurAva;
    document.getElementById("vit-nom").textContent  = p.nom;
    document.getElementById("vit-meta").textContent = p.cmu;
    const alertesEl = document.getElementById("vit-alertes");
    if (alertesEl) {
      alertesEl.innerHTML = p.conditions.map(c => `<span class="badge ${c.classe}" style="margin-left:4px">${c.label}</span>`).join("");
    }
  }

  if (section) section.style.display = "block";
  if (emptyEl) emptyEl.style.display = "none";
  if (btnNouvelle) btnNouvelle.disabled = false;

  /* Pré-remplir nom dans modal */
  const modalNom = document.getElementById("modal-vit-nom");
  if (modalNom) modalNom.textContent = p.nom;

  /* Afficher dernières mesures */
  const vitaux = mockVitauxParPatient[patientId] || [];
  const titre = document.getElementById("titre-derniere-mesure");
  if (titre && vitaux.length > 0) {
    titre.textContent = `Dernières mesures — ${vitaux[0].date} à ${vitaux[0].heure}`;
  }

  renderVitauxCards(vitaux[0]);
  renderHistoriqueVitaux(vitaux);
}

function renderVitauxCards(v) {
  const g1 = document.getElementById("vitaux-display");
  const g2 = document.getElementById("vitaux-display-2");
  if (!g1 || !g2 || !v) return;

  const warnTA = v.taSys > 140 || v.taDia > 90;
  g1.innerHTML = `
    <div class="vital-card ${warnTA ? 'warning' : ''}">
      <div class="vital-icon">🩸</div>
      <div class="vital-val">${v.taSys}/${v.taDia}</div>
      <div class="vital-lbl">Tension (mmHg)${warnTA ? ' ⚠️' : ''}</div>
    </div>
    <div class="vital-card ${v.temp > 38 ? 'warning' : ''}">
      <div class="vital-icon">🌡️</div>
      <div class="vital-val">${v.temp}°C</div>
      <div class="vital-lbl">Température</div>
    </div>
    <div class="vital-card">
      <div class="vital-icon">❤️</div>
      <div class="vital-val">${v.fc} bpm</div>
      <div class="vital-lbl">Fréq. cardiaque</div>
    </div>
    <div class="vital-card ${v.poids ? '' : ''}">
      <div class="vital-icon">⚖️</div>
      <div class="vital-val">${v.poids} kg</div>
      <div class="vital-lbl">Poids / IMC: ${calcIMC(v.poids, v.taille)}</div>
    </div>
  `;

  g2.innerHTML = `
    <div class="vital-card ${v.spo2 < 95 ? 'danger' : ''}">
      <div class="vital-icon">💨</div>
      <div class="vital-val">${v.spo2}%</div>
      <div class="vital-lbl">SpO₂</div>
    </div>
    <div class="vital-card ${v.glycemie > 7 ? 'warning' : ''}">
      <div class="vital-icon">🍬</div>
      <div class="vital-val">${v.glycemie} mmol/L</div>
      <div class="vital-lbl">Glycémie${v.glycemie > 7 ? ' ⚠️' : ''}</div>
    </div>
    <div class="vital-card">
      <div class="vital-icon">🌬️</div>
      <div class="vital-val">${v.fr} /min</div>
      <div class="vital-lbl">Fréq. respiratoire</div>
    </div>
    <div class="vital-card">
      <div class="vital-icon">📊</div>
      <div class="vital-val">${calcIMC(v.poids, v.taille)}</div>
      <div class="vital-lbl">IMC</div>
    </div>
  `;
}

function renderHistoriqueVitaux(liste) {
  const tbody = document.getElementById("tbody-historique-vitaux");
  const badge = document.getElementById("badge-nb-mesures");
  if (!tbody) return;

  if (badge) badge.textContent = liste.length + " mesure" + (liste.length > 1 ? "s" : "");

  tbody.innerHTML = "";
  liste.forEach(v => {
    const warnTA = v.taSys > 140;
    tbody.innerHTML += `
      <tr>
        <td style="font-size:12px;color:var(--slate-500)">${v.date} · ${v.heure}</td>
        <td style="${warnTA ? 'color:var(--amber-dark);font-weight:600' : ''}">${v.taSys}/${v.taDia}</td>
        <td style="${v.temp > 38 ? 'color:var(--amber-dark);font-weight:600' : ''}">${v.temp}</td>
        <td>${v.fc}</td>
        <td>${v.spo2}</td>
        <td>${v.poids}</td>
        <td style="${v.glycemie > 7 ? 'color:var(--amber-dark);font-weight:600' : ''}">${v.glycemie}</td>
        <td style="font-size:12px;color:var(--slate-500)">${v.infirmier}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="supprimerMesure(${v.id})">✕</button>
        </td>
      </tr>
    `;
  });
}

function calcIMC(poids, taille) {
  if (!poids || !taille) return "—";
  return (poids / ((taille / 100) ** 2)).toFixed(1);
}

function enregistrerVitaux() {
  if (!patientVitauxActif) {
    alert("Veuillez d'abord sélectionner un patient.");
    return;
  }

  const nouvelleMesure = {
    taSys:    parseInt(document.getElementById("vit-ta-sys")?.value)  || 0,
    taDia:    parseInt(document.getElementById("vit-ta-dia")?.value)  || 0,
    temp:     parseFloat(document.getElementById("vit-temp")?.value)  || 0,
    fc:       parseInt(document.getElementById("vit-fc")?.value)      || 0,
    poids:    parseFloat(document.getElementById("vit-poids")?.value) || 0,
    taille:   parseInt(document.getElementById("vit-taille")?.value)  || 0,
    spo2:     parseFloat(document.getElementById("vit-spo2")?.value)  || 0,
    glycemie: parseFloat(document.getElementById("vit-glycemie")?.value) || 0,
    fr:       parseInt(document.getElementById("vit-fr")?.value)      || 0
  };

  if (!nouvelleMesure.taSys || !nouvelleMesure.temp) {
    alert("Veuillez remplir au minimum la tension artérielle et la température.");
    return;
  }

  /* Quand backend prêt :
     InfirmierAPI.enregistrerVitaux({ patientId: patientVitauxActif, ...nouvelleMesure })
       .then(() => { fermerModal('modal-vitaux'); chargerPatientVitaux(patientVitauxActif); }); */

  alert("Signes vitaux enregistrés ✅ (mock)");
  fermerModal("modal-vitaux");
}

function supprimerMesure(id) {
  if (confirm("Supprimer cette mesure ?")) {
    /* Quand backend prêt :
       InfirmierAPI.supprimerMesure(id).then(() => chargerPatientVitaux(patientVitauxActif)); */
    alert("Mesure #" + id + " supprimée (mock)");
  }
}

/* Calcul IMC en temps réel dans le modal */
function initCalculIMC() {
  const inpPoids  = document.getElementById("vit-poids");
  const inpTaille = document.getElementById("vit-taille");
  const imcVal    = document.getElementById("imc-val");
  if (!inpPoids || !inpTaille || !imcVal) return;

  function maj() {
    const imc = calcIMC(parseFloat(inpPoids.value), parseInt(inpTaille.value));
    imcVal.textContent = imc;
  }

  inpPoids.addEventListener("input",  maj);
  inpTaille.addEventListener("input", maj);
}

function initSignesVitaux() {
  if (!document.getElementById("select-patient-vitaux")) return;
  initCalculIMC();

  /* Pré-remplir date/heure modal */
  const inpDate  = document.getElementById("soin-date");
  const inpHeure = document.getElementById("soin-heure");
  if (inpDate)  inpDate.value  = new Date().toISOString().split("T")[0];
  if (inpHeure) inpHeure.value = new Date().toTimeString().slice(0, 5);
}

/* ============================================================
   SOINS INFIRMIERS – soins-infirmiers.html
   ============================================================ */

let soinASupprimer = null;

function initSoins() {
  const tbody = document.getElementById("tbody-soins");
  if (!tbody) return;

  const total = document.getElementById("total-soins");
  if (total) total.textContent = mockSoins.length + " soins enregistrés";

  function render(liste) {
    tbody.innerHTML = "";
    const empty = document.getElementById("empty-soins");
    if (liste.length === 0) {
      if (empty) empty.style.display = "block";
      return;
    }
    if (empty) empty.style.display = "none";

    liste.forEach(s => {
      tbody.innerHTML += `
        <tr>
          <td style="font-size:12px;color:var(--slate-500)">${s.date} · ${s.heure}</td>
          <td style="font-weight:600">${s.patientNom}</td>
          <td>${badgeSoin(s.type)}</td>
          <td style="font-size:12.5px;color:var(--slate-600)">${s.detail}</td>
          <td style="font-size:12px;color:var(--slate-500)">${s.infirmier}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="demanderSuppression(${s.id})">🗑️</button>
          </td>
        </tr>
      `;
    });
  }

  render(mockSoins);

  /* Filtre type */
  const filtre = document.getElementById("filtre-type-soin");
  if (filtre) {
    filtre.addEventListener("change", function () {
      const type = this.value;
      const filtrés = type ? mockSoins.filter(s => s.type === type) : mockSoins;
      render(filtrés);
    });
  }

  /* Recherche */
  const search = document.getElementById("search-input");
  if (search) {
    search.addEventListener("input", function () {
      const q = this.value.toLowerCase();
      const filtrés = mockSoins.filter(s =>
        (s.patientNom + s.type + s.detail).toLowerCase().includes(q)
      );
      render(filtrés);
    });
  }

  /* Pré-remplir date/heure */
  const sf_date  = document.getElementById("sf-date");
  const sf_heure = document.getElementById("sf-heure");
  if (sf_date)  sf_date.value  = new Date().toISOString().split("T")[0];
  if (sf_heure) sf_heure.value = new Date().toTimeString().slice(0, 5);
}

function soumettreNouveauSoin() {
  const patientId = document.getElementById("sf-patient")?.value;
  const type      = document.getElementById("sf-type")?.value;
  const detail    = document.getElementById("sf-detail")?.value;

  if (!patientId || !type) {
    alert("Veuillez sélectionner un patient et un type de soin.");
    return;
  }

  /* Quand backend prêt :
     InfirmierAPI.enregistrerSoin({ patientId, typeSoin: type, description: detail })
       .then(() => { fermerModal('modal-soin-form'); initSoins(); }); */

  alert("Soin enregistré ✅ (mock)");
  fermerModal("modal-soin-form");
}

function demanderSuppression(id) {
  soinASupprimer = id;
  ouvrirModal("modal-confirm-suppr");
}

function confirmerSuppression() {
  /* Quand backend prêt :
     InfirmierAPI.supprimerSoin(soinASupprimer).then(() => initSoins()); */
  alert("Soin #" + soinASupprimer + " supprimé (mock)");
  fermerModal("modal-confirm-suppr");
  soinASupprimer = null;
}

/* ============================================================
   UPLOAD DOCUMENTS – upload-documents.html
   ============================================================ */

let fichierEnAttente = null;

function initUpload() {
  if (!document.getElementById("upload-zone")) return;
  renderTableDocuments();
}

function dragOver(event) {
  event.preventDefault();
  document.getElementById("upload-zone").classList.add("dragover");
}

function dragLeave(event) {
  document.getElementById("upload-zone").classList.remove("dragover");
}

function dropFichier(event) {
  event.preventDefault();
  document.getElementById("upload-zone").classList.remove("dragover");
  const fichier = event.dataTransfer?.files[0];
  if (fichier) fichierSelectionne(fichier);
}

function fichierSelectionne(fichier) {
  if (!fichier) return;

  const MAX = 20 * 1024 * 1024;
  if (fichier.size > MAX) {
    alert("Le fichier dépasse 20 MB.");
    return;
  }

  fichierEnAttente = fichier;

  const ext = fichier.name.split(".").pop().toLowerCase();
  const icones = { pdf: "📄", jpg: "🖼️", jpeg: "🖼️", png: "🖼️" };
  const icone  = icones[ext] || "📁";
  const taille = fichier.size < 1024 * 1024
    ? (fichier.size / 1024).toFixed(0) + " KB"
    : (fichier.size / (1024 * 1024)).toFixed(1) + " MB";

  document.getElementById("fichier-icone").textContent   = icone;
  document.getElementById("fichier-nom").textContent     = fichier.name;
  document.getElementById("fichier-taille").textContent  = taille;
  document.getElementById("fichier-selectionne").style.display = "flex";
  document.getElementById("upload-zone").style.display   = "none";
}

function retirerFichier() {
  fichierEnAttente = null;
  document.getElementById("fichier-selectionne").style.display = "none";
  document.getElementById("upload-zone").style.display         = "";
  document.getElementById("file-input").value = "";
}

async function soumettreFichier() {
  const patientId = document.getElementById("up-patient")?.value;
  const type      = document.getElementById("up-type")?.value;
  const desc      = document.getElementById("up-description")?.value;

  if (!patientId) { alert("Veuillez sélectionner un patient."); return; }
  if (!type)      { alert("Veuillez choisir un type de document."); return; }
  if (!fichierEnAttente) { alert("Veuillez sélectionner un fichier."); return; }

  /* Afficher la barre de progression */
  const prog = document.getElementById("upload-progress");
  const fill = document.getElementById("progress-fill");
  if (prog) prog.style.display = "block";

  /* Simulation progression (mock) */
  let pct = 0;
  const interval = setInterval(() => {
    pct += 20;
    if (fill) fill.style.width = pct + "%";
    if (pct >= 100) {
      clearInterval(interval);
      if (prog) prog.style.display = "none";
      afficherFeedback("Document uploadé avec succès ✅", "success");
      resetUpload();
      renderTableDocuments();
    }
  }, 200);

  /* Quand backend prêt :
     const formData = new FormData();
     formData.append("file", fichierEnAttente);
     formData.append("patientId", patientId);
     formData.append("typeDocument", type);
     formData.append("description", desc);
     InfirmierAPI.uploaderDocument(formData).then(() => { ... }); */
}

function afficherFeedback(msg, type) {
  const el = document.getElementById("upload-msg");
  if (!el) return;
  el.textContent  = msg;
  el.className    = "upload-feedback " + type;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 4000);
}

function resetUpload() {
  retirerFichier();
  ["up-patient", "up-consultation", "up-type", "up-description"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

function renderTableDocuments() {
  const tbody = document.getElementById("tbody-documents");
  const badge = document.getElementById("badge-total-docs");
  if (!tbody) return;

  if (badge) badge.textContent = mockDocumentsUploades.length + " documents";

  tbody.innerHTML = "";
  mockDocumentsUploades.forEach(d => {
    tbody.innerHTML += `
      <tr>
        <td style="font-weight:600">${d.nom}</td>
        <td>${d.patientNom}</td>
        <td><span class="badge badge-slate">${d.type}</span></td>
        <td style="font-size:12px;color:var(--slate-500)">${d.date}</td>
        <td style="font-size:12px;color:var(--slate-500)">${d.taille}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="telechargerDoc(${d.id})">⬇️</button>
          <button class="btn btn-danger btn-sm" onclick="supprimerDoc(${d.id})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

function telechargerDoc(id) {
  const documentItem = mockDocumentsUploades.find((item) => item.id === id);
  if (!documentItem) return;

  const content = [
    "MediBook - Document infirmier",
    `Nom: ${documentItem.nom}`,
    `Patient: ${documentItem.patientNom}`,
    `Type: ${documentItem.type}`,
    `Date: ${documentItem.date}`,
    `Taille: ${documentItem.taille}`,
    "",
    "Export de demonstration genere depuis l'espace infirmier."
  ].join("\n");

  triggerFileDownload(`${sanitizeFilename(documentItem.nom)}.txt`, content);
}

function supprimerDoc(id) {
  if (confirm("Supprimer ce document ?")) {
    alert("Document #" + id + " supprimé (mock)");
  }
}

/* ============================================================
   INITIALISATION GLOBALE
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  initSidebar();
  initLogout();
  initNotifications();
  initProfileForm();

  initDashboard();
  initListePatients();
  initSignesVitaux();
  initSoins();
  initUpload();
});





