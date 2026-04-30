// ========== SESSION INFIRMIER ========== //
const DEFAULT_INFIRMIER_SESSION = {
    id: 2,
    nom: "Kone",
    prenom: "Marie",
    initiales: "KM",
    service: "Urgences",
    matricule: "MAT-INF-00087",
    role: "Infirmier",
    telephone: "+225 07 12 34 56",
    email: "marie.kone@medibook.ci",
    bio: "Infirmière en charge des soins",
    avatar: ""
};

function getStoredInfirmierSession() {
    const raw = localStorage.getItem("infirmierSession");
    if (!raw) return { ...DEFAULT_INFIRMIER_SESSION };
    try { return { ...DEFAULT_INFIRMIER_SESSION, ...JSON.parse(raw) }; }
    catch { return { ...DEFAULT_INFIRMIER_SESSION }; }
}

let mockInfirmier = getStoredInfirmierSession();


function saveInfirmierSession(updates) {
    mockInfirmier = { ...mockInfirmier, ...updates };
    localStorage.setItem("infirmierSession", JSON.stringify(mockInfirmier));
}

// ========== PATIENTS MOCK ==========
const mockPatients = [
    { id: 1, nom: "Kouadio Jean Baptiste", cmu: "CMU-2024-08821" },
    { id: 2, nom: "Assi Koffi Martial", cmu: "CMU-2023-04512" },
    { id: 3, nom: "N'guessan Kouamé", cmu: "CMU-2024-11032" }
];

let mockDocumentsUploades = [];

function getPatientById(id) {
    return mockPatients.find(p => String(p.id) === String(id));
}

let soinsPatientSelection = null;
let dashboardPatientSelection = null;
let vitauxPatientSelection = null;
let uploadPatientSelection = null;
const patientSearchCache = new Map();

function mapApiPatient(patient) {
    return {
        id: patient.id,
        nom: patient.nomComplet || [patient.nom, patient.prenom].filter(Boolean).join(" "),
        cmu: patient.numeroAssure || ""
    };
}

function getPatientInitiales(patient) {
    return (patient.nom || "")
        .split(" ")
        .filter(Boolean)
        .map(part => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

async function searchPatientsFromBackend(term) {
    const normalized = term.trim().toLowerCase();
    if (normalized.length < 2) {
        return [];
    }

    if (patientSearchCache.has(normalized)) {
        return patientSearchCache.get(normalized);
    }

    const patients = await window.InfirmierAPI.searchPatients(normalized);
    const mapped = patients.map(mapApiPatient);
    patientSearchCache.set(normalized, mapped);
    return mapped;
}

function renderPatientSearchResults(resultsContainer, patients, onSelect) {
    if (!resultsContainer) return;

    if (!patients.length) {
        resultsContainer.innerHTML = '<div class="patient-search-empty">Aucun patient trouvé.</div>';
        resultsContainer.classList.add("open");
        return;
    }

    resultsContainer.innerHTML = patients.map(patient => `
        <div class="patient-search-item" data-patient-id="${patient.id}">
            <div class="patient-search-name">${patient.nom}</div>
            <div class="patient-search-meta">${patient.cmu || "CMU non renseigné"}</div>
        </div>
    `).join("");

    resultsContainer.querySelectorAll("[data-patient-id]").forEach(item => {
        item.addEventListener("click", () => {
            const patient = patients.find(entry => String(entry.id) === item.dataset.patientId);
            if (patient) {
                onSelect(patient);
            }
            resultsContainer.classList.remove("open");
        });
    });

    resultsContainer.classList.add("open");
}

function syncSelectedPatientToModal() {
    if (!soinsPatientSelection) {
        return;
    }

    const hiddenInput = document.getElementById("soin-patient");
    const searchInput = document.getElementById("soin-patient-search");
    if (hiddenInput) hiddenInput.value = soinsPatientSelection.id;
    if (searchInput) searchInput.value = soinsPatientSelection.cmu || "";
}

function syncDashboardPatientSelection() {
    if (!dashboardPatientSelection) {
        return;
    }

    const hiddenInput = document.getElementById("dashboard-soin-patient");
    const searchInput = document.getElementById("dashboard-soin-patient-search");
    if (hiddenInput) hiddenInput.value = dashboardPatientSelection.id;
    if (searchInput) searchInput.value = dashboardPatientSelection.cmu || "";
}

function updateVitauxPatientUI(patient) {
    const banner = document.getElementById("patient-banner-vitaux");
    const section = document.getElementById("section-vitaux");
    const emptyState = document.getElementById("vitaux-empty");
    const nameElement = document.getElementById("vit-nom");
    const metaElement = document.getElementById("vit-meta");
    const avatarElement = document.getElementById("vit-ava");
    const modalNameElement = document.getElementById("modal-vit-nom");

    if (!patient) {
        if (banner) banner.style.display = "none";
        if (section) section.style.display = "none";
        if (emptyState) emptyState.style.display = "";
        if (modalNameElement) modalNameElement.textContent = "—";
        return;
    }

    if (banner) banner.style.display = "flex";
    if (section) section.style.display = "block";
    if (emptyState) emptyState.style.display = "none";
    if (nameElement) nameElement.textContent = patient.nom || "Patient";
    if (metaElement) metaElement.textContent = patient.cmu || "";
    if (avatarElement) avatarElement.textContent = getPatientInitiales(patient);
    if (modalNameElement) modalNameElement.textContent = patient.nom || "Patient";
}

function initPatientSearchField(config) {
    const searchInput = document.getElementById(config.inputId);
    const hiddenInput = document.getElementById(config.hiddenInputId);
    const resultsContainer = document.getElementById(config.resultsId);
    if (!searchInput || !hiddenInput || !resultsContainer) {
        return;
    }

    let lastTerm = "";

    const selectPatient = patient => {
        hiddenInput.value = patient.id;
        searchInput.value = patient.cmu || "";
        if (typeof config.onSelect === "function") {
            config.onSelect(patient);
        }
    };

    searchInput.addEventListener("input", async () => {
        const term = searchInput.value.trim();
        hiddenInput.value = "";
        if (typeof config.onClear === "function") {
            config.onClear();
        }

        if (term.length < 2) {
            resultsContainer.classList.remove("open");
            resultsContainer.innerHTML = "";
            return;
        }

        lastTerm = term;

        try {
            const patients = await searchPatientsFromBackend(term);
            if (searchInput.value.trim() !== lastTerm) {
                return;
            }
            renderPatientSearchResults(resultsContainer, patients, selectPatient);
        } catch (error) {
            console.error(error);
            resultsContainer.innerHTML = `<div class="patient-search-empty">${error.message}</div>`;
            resultsContainer.classList.add("open");
        }
    });

    searchInput.addEventListener("focus", async () => {
        const term = searchInput.value.trim();
        if (term.length < 2 || hiddenInput.value) {
            return;
        }

        try {
            const patients = await searchPatientsFromBackend(term);
            renderPatientSearchResults(resultsContainer, patients, selectPatient);
        } catch (error) {
            console.error(error);
        }
    });

    document.addEventListener("click", event => {
        if (!event.target.closest(`#${config.wrapperId}`)) {
            resultsContainer.classList.remove("open");
        }
    });
}

// ========== FONCTIONS UPLOAD GLOBALES ==========
window.fichierEnAttente = null;

window.handleFichierSelectionne = function(fichier) {
    if (!fichier) return;
    if (fichier.size > 20 * 1024 * 1024) {
        alert("Le fichier dépasse 20 MB.");
        return;
    }
    window.fichierEnAttente = fichier;
    const ext = fichier.name.split('.').pop().toLowerCase();
    const icones = { pdf: "📄", jpg: "🖼️", jpeg: "🖼️", png: "🖼️" };
    const icone = icones[ext] || "📎";
    const taille = fichier.size < 1024*1024
        ? (fichier.size/1024).toFixed(0) + " KB"
        : (fichier.size/(1024*1024)).toFixed(1) + " MB";

    const iconeEl = document.getElementById("fichier-icone");
    const nomEl = document.getElementById("fichier-nom");
    const tailleEl = document.getElementById("fichier-taille");
    const selectionDiv = document.getElementById("fichier-selectionne");
    const zoneDiv = document.getElementById("upload-zone");
    if (iconeEl) iconeEl.textContent = icone;
    if (nomEl) nomEl.textContent = fichier.name;
    if (tailleEl) tailleEl.textContent = taille;
    if (selectionDiv) selectionDiv.style.display = "flex";
    if (zoneDiv) zoneDiv.style.display = "none";
};

window.fichierSelectionne = function(inputElement) {
    if (inputElement && inputElement.files && inputElement.files[0]) {
        window.handleFichierSelectionne(inputElement.files[0]);
    }
};

window.retirerFichier = function() {
    window.fichierEnAttente = null;
    const selectionDiv = document.getElementById("fichier-selectionne");
    const zoneDiv = document.getElementById("upload-zone");
    const fileInput = document.getElementById("file-input");
    if (selectionDiv) selectionDiv.style.display = "none";
    if (zoneDiv) zoneDiv.style.display = "";
    if (fileInput) fileInput.value = "";
};

window.soumettreFichier = async function() {

    const patientId = document.getElementById("up-patient")?.value;
    const type = document.getElementById("up-type")?.value;
    console.log("TYPE =", type);
    const description = document.getElementById("up-description")?.value || "";

    if (!patientId) {
        alert("Veuillez sélectionner un patient.");
        return;
    }

    if (!type) {
        alert("Veuillez choisir un type de document.");
        return;
    }

    if (!window.fichierEnAttente) {
        alert("Veuillez sélectionner un fichier.");
        return;
    }

    // 🔥 FORM DATA (TRÈS IMPORTANT)
    const formData = new FormData();
    formData.append("file", window.fichierEnAttente);
    formData.append("type", type);
    formData.append("description", description);
    formData.append("patientId", patientId);

    try {
        const result = await window.InfirmierAPI.uploadDocument(formData);
        alert("✅ Document enregistré en base (ID " + result.id + ")");
        window.resetUpload();
    } catch (error) {
        console.error(error);
        alert("❌ " + error.message);
    }
};

window.afficherFeedback = function(msg, type) {
    const el = document.getElementById("upload-msg");
    if (!el) return;
    el.textContent = msg;
    el.className = "upload-feedback " + type;
    el.style.display = "block";
    setTimeout(() => el.style.display = "none", 4000);
};

window.resetUpload = function() {
    window.retirerFichier();
    ["up-patient", "up-consultation", "up-type", "up-description"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    const uploadSearchInput = document.getElementById("up-patient-search");
    if (uploadSearchInput) uploadSearchInput.value = "";
    uploadPatientSelection = null;
};

window.renderTableDocuments = function() {
    const tbody = document.getElementById("tbody-documents");
    const badge = document.getElementById("badge-total-docs");
    if (!tbody) return;
    if (badge) badge.textContent = mockDocumentsUploades.length + " documents";
    tbody.innerHTML = "";
    mockDocumentsUploades.forEach(d => {
        tbody.innerHTML += `
            <table>
                <td style="font-weight:600">${d.nom}</td>
                <td>${d.patientNom}</td>
                <td><span class="badge">${d.type}</span></td>
                <td>${d.date}</td>
                <td>${d.taille}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="window.telechargerDoc(${d.id})">Télécharger</button>
                    <button class="btn btn-danger btn-sm" onclick="window.supprimerDoc(${d.id})">Supprimer</button>
                </td>
            </tr>
        `;
    });
};

window.telechargerDoc = function(id) {
    const doc = mockDocumentsUploades.find(d => d.id === id);
    if (!doc) return;
    alert("Téléchargement simulé : " + doc.nom);
};

window.supprimerDoc = function(id) {
    if (confirm("Supprimer ce document ?")) {
        mockDocumentsUploades = mockDocumentsUploades.filter(d => d.id !== id);
        window.renderTableDocuments();
        alert("Document supprimé.");
    }
};

// Drag & drop
window.dragOver = function(e) {
    e.preventDefault();
    const zone = document.getElementById("upload-zone");
    if (zone) zone.classList.add("dragover");
};
window.dragLeave = function() {
    const zone = document.getElementById("upload-zone");
    if (zone) zone.classList.remove("dragover");
};
window.dropFichier = function(e) {
    e.preventDefault();
    const zone = document.getElementById("upload-zone");
    if (zone) zone.classList.remove("dragover");
    const fichier = e.dataTransfer?.files[0];
    if (fichier) window.handleFichierSelectionne(fichier);
};

// ========== LISTE DES PATIENTS ==========
window.initListePatients = function() {
    const tbody = document.getElementById("tbody-patients");
    if (!tbody) return;

    function afficherPatients(liste) {
        tbody.innerHTML = "";
        const emptyDiv = document.getElementById("empty-patients");
        if (liste.length === 0) {
            if (emptyDiv) emptyDiv.style.display = "block";
            return;
        }
        if (emptyDiv) emptyDiv.style.display = "none";

        const couleurs = ["#0D8E94", "#7c3aed", "#059669", "#dc2626", "#f59e0b"];
        liste.forEach(p => {
            const initiales = p.nom.split(' ').map(n => n[0]).join('').toUpperCase();
            const couleur = couleurs[p.id % couleurs.length];
            const age = Math.floor(Math.random() * (65 - 25 + 1) + 25);
            const conditions = p.id === 1 ? '<span class="badge badge-amber">HTA</span>' : '';
            const derniereMesure = "Aujourd'hui";
            tbody.innerHTML += `
                <tr>
                    <td>
                        <div style="display:flex; align-items:center; gap:10px">
                            <div style="width:36px;height:36px;background:${couleur};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold">${initiales}</div>
                            ${p.nom}
                        </div>
                    </td>
                    <td>${p.cmu}</td>
                    <td>${age} ans</td>
                    <td>${conditions || '<span class="badge badge-slate">Aucune</span>'}</td>
                    <td>${derniereMesure}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="window.location.href='signes-vitaux.html?id=${p.id}'">Vitaux</button>
                        <button class="btn btn-secondary btn-sm" onclick="window.location.href='soins-infirmiers.html?id=${p.id}'">Soins</button>
                    </td>
                </tr>
            `;
        });
    }

    afficherPatients(mockPatients);

    const champRecherche = document.getElementById("search-input");
    if (champRecherche) {
        champRecherche.addEventListener("input", function() {
            const texte = this.value.toLowerCase();
            const filtre = mockPatients.filter(p =>
                p.nom.toLowerCase().includes(texte) ||
                p.cmu.toLowerCase().includes(texte)
            );
            afficherPatients(filtre);
        });
    }
};

// ========== FONCTIONS MODALES ==========
window.ouvrirModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("open");
    if (id === "modal-soin-form") {
        syncSelectedPatientToModal();
    }
    if (id === "modal-soin") {
        syncDashboardPatientSelection();
    }
    if (id === "modal-vitaux") {
        updateVitauxPatientUI(vitauxPatientSelection);
    }
};

window.fermerModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("open");
};

window.fermerModalOverlay = function(event, id) {
    if (event.target === document.getElementById(id)) {
        window.fermerModal(id);
    }
};

// ========== SOUMISSION NOUVEAU SOIN (modale) ==========
window.soumettreNouveauSoin = function() {
    console.log("soumettreNouveauSoin appelée");
    const selectPatient = document.getElementById("sf-patient");
    if (!selectPatient) {
        alert("Le champ patient n'existe pas dans le DOM (id 'sf-patient' introuvable)");
        return;
    }
    const patientId = selectPatient.value;
    console.log("Valeur patient lue :", patientId);

    const type = document.getElementById("sf-type")?.value;
    const detail = document.getElementById("sf-detail")?.value;
    const date = document.getElementById("sf-date")?.value;
    const heure = document.getElementById("sf-heure")?.value;
    const observations = document.getElementById("sf-obs")?.value;

    if (!patientId) {
        alert("Veuillez sélectionner un patient.");
        return;
    }
    if (!type) {
        alert("Veuillez choisir un type de soin.");
        return;
    }

    alert(`Simulation : Soin "${type}" enregistré pour patient ${patientId}`);
    window.fermerModal("modal-soin-form");
};

// ========== ENREGISTRER SOIN DEPUIS LE DASHBOARD ==========
window.enregisterSoin = async function() {
    const patientId = document.getElementById("soin-patient")?.value || document.getElementById("dashboard-soin-patient")?.value;
    const typeSoin = document.getElementById("soin-type")?.value;
    const detail = document.getElementById("soin-detail")?.value;
    const date = document.getElementById("soin-date")?.value;
    const heure = document.getElementById("soin-heure")?.value;
    const observations = document.getElementById("soin-obs")?.value;

    if (!patientId) { alert("Veuillez sélectionner un patient."); return; }
    if (!typeSoin) { alert("Veuillez choisir un type de soin."); return; }
    if (!date || !heure) { alert("Veuillez renseigner la date et l'heure."); return; }

    const dateHeure = `${date}T${heure}:00`;

    let description = detail || "";
    if (observations) {
        description += " - Observations : " + observations;
    }

    console.log("PATIENT ID ENVOYÉ :", patientId); // 🔥 ICI

    const soinData = {
        typeSoin: typeSoin,
        description: description,
        dateHeure: dateHeure,
        infirmierId: 2,
        patientId: Number(patientId)
    };

    console.log("DATA ENVOYÉE :", soinData); // 🔥 ICI



    try {
        const result = await window.InfirmierAPI.createSoin(soinData);
        alert(`✅ Soin enregistré en base (ID ${result.id})`);

        const modal = document.getElementById("modal-soin-form");
        if (modal) modal.classList.remove("open");
        const dashboardModal = document.getElementById("modal-soin");
        if (dashboardModal) dashboardModal.classList.remove("open");

        if (typeof window.initSoins === 'function') {
            window.initSoins();
        }
    } catch (error) {
        console.error(error);
        alert("❌ " + error.message);
    }
};
// ========== ENREGISTRER SIGNES VITAUX ==========

window.enregistrerSigneVital = async function () {

    // 🔥 CORRECTION ICI
    const patientId = document.getElementById("select-patient-vitaux")?.value;

    const taSyst = document.getElementById("vit-ta-sys")?.value;
    const taDiast = document.getElementById("vit-ta-dia")?.value;
    const temperature = document.getElementById("vit-temp")?.value;
    const fc = document.getElementById("vit-fc")?.value;
    const poids = document.getElementById("vit-poids")?.value;
    const taille = document.getElementById("vit-taille")?.value;
    const spo2 = document.getElementById("vit-spo2")?.value;
    const glycemie = document.getElementById("vit-glycemie")?.value;
    const fr = document.getElementById("vit-fr")?.value;
    const notes = document.getElementById("vit-notes")?.value;

    if (!patientId) {
        alert("Veuillez sélectionner un patient");
        return;
    }

    const data = {
        patientId: Number(patientId),
        infirmierId: 2,

        taSystolique: Number(taSyst),
        taDiastolique: Number(taDiast),
        temperature: Number(temperature),
        frequenceCardiaque: Number(fc),
        poids: Number(poids),
        taille: Number(taille),
        spo2: Number(spo2),
        glycemie: Number(glycemie),
        frequenceRespiratoire: Number(fr),
        notes: notes,

        // 🔥 AJOUT IMPORTANT
        dateHeure: new Date().toISOString()
    };

    console.log("DATA SIGNES VITAUX :", data);

    try {
        const result = await window.InfirmierAPI.createSigneVital(data);
        alert("✅ Signes vitaux enregistrés (ID " + result.id + ")");
        fermerModal("modal-vitaux");
    } catch (error) {
        console.error(error);
        alert("❌ " + error.message);
    }
};
// ========== INITIALISATION AU CHARGEMENT ==========
document.addEventListener("DOMContentLoaded", function() {
    window.renderTableDocuments();
    window.initListePatients();
    initPatientSearchField({
        wrapperId: "select-patient-soins-search-box",
        inputId: "select-patient-soins-search",
        hiddenInputId: "select-patient-soins",
        resultsId: "select-patient-soins-results",
        onSelect: patient => {
            soinsPatientSelection = patient;
            syncSelectedPatientToModal();
        },
        onClear: () => {
            soinsPatientSelection = null;
            const modalHiddenInput = document.getElementById("soin-patient");
            const modalSearchInput = document.getElementById("soin-patient-search");
            if (modalHiddenInput) modalHiddenInput.value = "";
            if (modalSearchInput) modalSearchInput.value = "";
        }
    });
    initPatientSearchField({
        wrapperId: "soin-patient-search-box",
        inputId: "soin-patient-search",
        hiddenInputId: "soin-patient",
        resultsId: "soin-patient-results",
        onSelect: patient => {
            soinsPatientSelection = patient;
            const pageHiddenInput = document.getElementById("select-patient-soins");
            const pageSearchInput = document.getElementById("select-patient-soins-search");
            if (pageHiddenInput) pageHiddenInput.value = patient.id;
            if (pageSearchInput) pageSearchInput.value = patient.cmu || "";
        },
        onClear: () => {
            soinsPatientSelection = null;
            const pageHiddenInput = document.getElementById("select-patient-soins");
            const pageSearchInput = document.getElementById("select-patient-soins-search");
            if (pageHiddenInput) pageHiddenInput.value = "";
            if (pageSearchInput) pageSearchInput.value = "";
        }
    });
    initPatientSearchField({
        wrapperId: "dashboard-soin-patient-search-box",
        inputId: "dashboard-soin-patient-search",
        hiddenInputId: "dashboard-soin-patient",
        resultsId: "dashboard-soin-patient-results",
        onSelect: patient => {
            dashboardPatientSelection = patient;
        },
        onClear: () => {
            dashboardPatientSelection = null;
        }
    });
    initPatientSearchField({
        wrapperId: "select-patient-vitaux-search-box",
        inputId: "select-patient-vitaux-search",
        hiddenInputId: "select-patient-vitaux",
        resultsId: "select-patient-vitaux-results",
        onSelect: patient => {
            vitauxPatientSelection = patient;
            updateVitauxPatientUI(patient);
        },
        onClear: () => {
            vitauxPatientSelection = null;
            updateVitauxPatientUI(null);
        }
    });
    initPatientSearchField({
        wrapperId: "up-patient-search-box",
        inputId: "up-patient-search",
        hiddenInputId: "up-patient",
        resultsId: "up-patient-results",
        onSelect: patient => {
            uploadPatientSelection = patient;
        },
        onClear: () => {
            uploadPatientSelection = null;
        }
    });
    const sbAvatar = document.getElementById("sb-avatar");
    if (sbAvatar) sbAvatar.textContent = mockInfirmier.initiales;
    const sbName = document.getElementById("sb-name");
    if (sbName) sbName.textContent = mockInfirmier.prenom + " " + mockInfirmier.nom;
});
