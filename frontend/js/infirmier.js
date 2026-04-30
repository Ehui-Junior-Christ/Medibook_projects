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
        const response = await fetch("http://localhost:8080/api/documents/upload", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const result = await response.json();

            alert("✅ Document enregistré en base (ID " + result.id + ")");

            // reset UI
            window.resetUpload();

        } else {
            const err = await response.text();
            alert("❌ Erreur backend : " + err);
        }

    } catch (error) {
        console.error(error);
        alert("❌ Erreur réseau");
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
    const patientId = document.getElementById("soin-patient")?.value;
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
        const response = await fetch("http://localhost:8080/api/soins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(soinData)
        });

        if (response.ok) {
            const result = await response.json();
            alert(`✅ Soin enregistré en base (ID ${result.id})`);

            const modal = document.getElementById("modal-soin");
            if (modal) modal.classList.remove("open");

            if (typeof window.initSoins === 'function') {
                window.initSoins();
            }

        } else {
            const errorText = await response.text();
            alert("❌ Erreur backend : " + errorText);
        }

    } catch (error) {
        console.error(error);
        alert("❌ Erreur réseau : " + error.message);
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
        const response = await fetch("http://localhost:8080/api/signes-vitaux", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            alert("✅ Signes vitaux enregistrés (ID " + result.id + ")");
            fermerModal("modal-vitaux");
        } else {
            const err = await response.text();
            alert("❌ Erreur backend : " + err);
        }

    } catch (error) {
        console.error(error);
        alert("❌ Erreur réseau");
    }
};
// ========== INITIALISATION AU CHARGEMENT ==========
document.addEventListener("DOMContentLoaded", function() {
    window.renderTableDocuments();
    window.initListePatients();
    const sbAvatar = document.getElementById("sb-avatar");
    if (sbAvatar) sbAvatar.textContent = mockInfirmier.initiales;
    const sbName = document.getElementById("sb-name");
    if (sbName) sbName.textContent = mockInfirmier.prenom + " " + mockInfirmier.nom;
});