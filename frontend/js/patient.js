/* ============================================================
   MediBook – patient.js
   Logique complète du module Patient
   Auteur : Bie Jacquy Sergine

   Pages gérées :
     - dashboard.html
     - profil.html
     - carnet-medical.html
     - consultation.html
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
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const wrapper = button.closest("[data-tabs]");
      if (!wrapper) {
        return;
      }
      wrapper.querySelectorAll(".tab-btn").forEach((node) => node.classList.remove("active"));
      wrapper.querySelectorAll(".tab-content").forEach((node) => node.classList.remove("active"));
      button.classList.add("active");
      const target = wrapper.querySelector(`#${button.dataset.target}`);
      if (target) {
        target.classList.add("active");
      }
    });
  });
});
