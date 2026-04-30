let selectedRole = "patient";

function buildInitials(prenom = "", nom = "") {
  const initials = `${String(prenom || "").trim().charAt(0)}${String(nom || "").trim().charAt(0)}`.toUpperCase();
  return initials || "MB";
}

function syncMedecinSession({
  id = null,
  nom = "",
  prenom = "",
  telephone = "",
  email = "",
  matricule = "",
  specialiteMedicale = "",
  sexe = "",
  dateNaissance = "",
  cmu = "",
  photoProfil = ""
}) {
  const existing = JSON.parse(localStorage.getItem("medecinSession") || "null");
  const nextSession = {
    ...(existing || {}),
    id: id ?? existing?.id ?? null,
    name: [prenom, nom].filter(Boolean).join(" ").trim() || existing?.name || "Medecin",
    role: "Medecin",
    initials: buildInitials(prenom || existing?.prenom, nom || existing?.nom),
    phone: telephone || existing?.phone || "",
    email: email || existing?.email || "",
    matricule: matricule || existing?.matricule || "",
    specialty: specialiteMedicale || existing?.specialty || "Medecine generale",
    sexe: sexe || existing?.sexe || "",
    dateNaissance: dateNaissance || existing?.dateNaissance || "",
    cmu: cmu || existing?.cmu || "",
    avatar: photoProfil || existing?.avatar || "",
    nom: nom || existing?.nom || "",
    prenom: prenom || existing?.prenom || ""
  };

  localStorage.setItem("medecinSession", JSON.stringify(nextSession));
}

function syncInfirmierSession({
  id = null,
  nom = "",
  prenom = "",
  telephone = "",
  email = "",
  matricule = "",
  service = "",
  sexe = "",
  dateNaissance = "",
  cmu = "",
  photoProfil = ""
}) {
  const existing = JSON.parse(localStorage.getItem("infirmierSession") || "null");
  const nextSession = {
    ...(existing || {}),
    id: id ?? existing?.id ?? null,
    nom: nom || existing?.nom || "",
    prenom: prenom || existing?.prenom || "",
    initiales: buildInitials(prenom || existing?.prenom, nom || existing?.nom),
    role: "Infirmier",
    telephone: telephone || existing?.telephone || "",
    email: email || existing?.email || "",
    matricule: matricule || existing?.matricule || "",
    service: service || existing?.service || "Urgences",
    sexe: sexe || existing?.sexe || "",
    dateNaissance: dateNaissance || existing?.dateNaissance || "",
    cmu: cmu || existing?.cmu || "",
    avatar: photoProfil || existing?.avatar || "",
    bio: existing?.bio || "Infirmier en charge du suivi des soins, des signes vitaux et de la coordination terrain."
  };

  localStorage.setItem("infirmierSession", JSON.stringify(nextSession));
}

function syncPatientSession({
  id = null,
  nom = "",
  prenom = "",
  telephone = "",
  email = "",
  sexe = "",
  dateNaissance = "",
  cmu = "",
  photoProfil = ""
}) {
  const existing = JSON.parse(localStorage.getItem("medibook.patient.profile") || "null");
  const nextSession = {
    ...(existing || {}),
    backendId: id ?? existing?.backendId ?? null,
    id: cmu || existing?.id || "N/A",
    numeroAssure: cmu || existing?.numeroAssure || "",
    nom: nom || existing?.nom || "",
    prenoms: prenom || existing?.prenoms || existing?.prenom || "",
    telephone: telephone || existing?.telephone || "",
    email: email || existing?.email || "",
    sexe: sexe || existing?.sexe || "",
    dateNaissance: dateNaissance || existing?.dateNaissance || "",
    avatar: photoProfil || existing?.avatar || ""
  };
  localStorage.setItem("medibook.patient.profile", JSON.stringify(nextSession));
}

function toggleRole(role) {
  selectedRole = role;
  const patientForm = document.getElementById("form-patient");
  const proForm = document.getElementById("form-pro");
  document.querySelectorAll(".role-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.role === role);
  });
  if (patientForm && proForm) {
    const isPro = role === "medecin" || role === "infirmier";
    patientForm.style.display = isPro ? "none" : "block";
    proForm.style.display = isPro ? "block" : "none";
  }
}

function setRole(role, button) {
  selectedRole = role;
  document.querySelectorAll(".role-btn").forEach((node) => {
    node.classList.remove("active");
  });
  if (button) {
    button.classList.add("active");
  }
  toggleRole(role);
}

function pickRole(role, card) {
  selectedRole = role;
  document.querySelectorAll(".role-card").forEach((node) => {
    node.classList.remove("selected");
  });
  if (card) {
    card.classList.add("selected");
  }

  const isMed = role === "medecin";
  const isInf = role === "infirmier";
  const isPat = role === "patient";

  [
    ["f-mat", isMed],
    ["f-spe", isMed],
    ["f-mat-inf", isInf],
    ["f-srv", isInf],
    ["f-sang", isPat],
    ["f-allergie", isPat]
  ].forEach(([id, visible]) => {
    const node = document.getElementById(id);
    if (node) {
      node.style.display = visible ? "flex" : "none";
    }
  });

  const fIsProPatient = document.getElementById("f-is-pro-patient");
  if (fIsProPatient) fIsProPatient.style.display = isPat ? "flex" : "none";
  const cb = document.getElementById("isProPatient");
  if (cb) cb.checked = false;
  if (window.toggleProPatientMatricule) window.toggleProPatientMatricule();

  const roleField = document.getElementById("rc-role");
  if (roleField) {
    roleField.textContent = role.charAt(0).toUpperCase() + role.slice(1);
  }
}

window.toggleProPatientMatricule = function() {
  const cb = document.getElementById("isProPatient");
  const fMat = document.getElementById("f-mat-pro-patient");
  if (fMat) fMat.style.display = (cb && cb.checked) ? "flex" : "none";
};

function setStep(step) {
  document.querySelectorAll(".inscrip-step").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.step === String(step));
  });

  document.querySelectorAll(".sp-item").forEach((item) => {
    const current = Number(item.dataset.step);
    const dot = item.querySelector(".sp-dot");
    item.classList.remove("active", "done");
    if (current < step) {
      item.classList.add("done");
      if (dot) dot.textContent = "✓";
    } else if (current === step) {
      item.classList.add("active");
      if (dot) dot.textContent = String(current);
    } else if (dot) {
      dot.textContent = String(current);
    }
  });
}

function nextStep(current) {
  setStep(current + 1);
}

function prevStep(current) {
  setStep(current - 1);
}

function isNext(current) {
  nextStep(current);
}

function isPrev(current) {
  prevStep(current);
}

function goInscription() {
  window.location.href = "./inscription.html";
}

function goLogin() {
  window.location.href = "./login.html";
}

function goApp() {
  const isPro = selectedRole === "medecin" || selectedRole === "infirmier";
  const identifiant = isPro
    ? document.getElementById("identifiant-pro")?.value
    : document.getElementById("identifiant")?.value;
  const motDePasse = isPro
    ? document.getElementById("motDePasse-pro")?.value
    : document.getElementById("motDePasse")?.value;

  fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      identifiant,
      motDePasse,
      role: selectedRole.toUpperCase()
    })
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Erreur login");
      }
      return res.json();
    })
    .then((data) => {
      localStorage.setItem("user", JSON.stringify(data));
      if (data.role === "MEDECIN") {
        syncMedecinSession({
          id: data.id,
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone,
          email: data.email,
          matricule: data.matricule,
          specialiteMedicale: data.specialiteMedicale || data.specialty,
          sexe: data.sexe,
          dateNaissance: data.dateNaissance,
          cmu: data.numeroAssure || data.cmu,
          photoProfil: data.photoProfil
        });
      }
      if (data.role === "INFIRMIER") {
        syncInfirmierSession({
          id: data.id,
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone,
          email: data.email,
          matricule: data.matricule,
          service: data.service,
          sexe: data.sexe,
          dateNaissance: data.dateNaissance,
          cmu: data.numeroAssure || data.cmu,
          photoProfil: data.photoProfil
        });
      }
      if (data.role === "PATIENT") {
        syncPatientSession({
          id: data.id,
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone,
          email: data.email,
          sexe: data.sexe,
          dateNaissance: data.dateNaissance,
          cmu: data.numeroAssure || data.cmu,
          photoProfil: data.photoProfil
        });
      }
      const dashboardByRole = {
        PATIENT: "./patient/dashboard.html",
        MEDECIN: "./medecin/dashboard.html",
        INFIRMIER: "./infirmier/dashboard.html"
      };

      // If the user tried to open a protected page directly, resume there after login.
      const intendedUrl = sessionStorage.getItem("mb_intended_url");
      if (intendedUrl) {
        sessionStorage.removeItem("mb_intended_url");
        sessionStorage.removeItem("mb_intended_rel");
        window.location.href = intendedUrl;
        return;
      }

      window.location.href = dashboardByRole[data.role] || dashboardByRole.PATIENT;
    })
    .catch((err) => {
      console.error(err);
      alert("Identifiants incorrects.");
    });
}

function checkPw() {
  const pw = document.getElementById("pw1")?.value ?? "";
  const confirm = document.getElementById("pw2")?.value ?? "";
  const rules = {
    len: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    num: /[0-9]/.test(pw),
    special: /[!@#$%^&*]/.test(pw)
  };
  const score = Object.values(rules).filter(Boolean).length;
  const colors = ["", "var(--red)", "var(--amber)", "var(--amber)", "var(--green)"];
  const labels = ["", "Tres faible", "Faible", "Moyen", "Fort"];

  for (let i = 1; i <= 4; i += 1) {
    const seg = document.getElementById(`ps${i}`);
    if (seg) {
      const active = i <= score;
      seg.classList.toggle("filled", active);
      seg.style.setProperty("--pw-color", active ? colors[score] : "var(--slate-200)");
      seg.style.background = active ? colors[score] : "var(--slate-200)";
      seg.style.transform = active ? "scaleY(1.15)" : "scaleY(1)";
    }
  }

  const msg = document.getElementById("pw-msg");
  if (msg) {
    msg.textContent = pw ? `Force : ${labels[score]}` : "";
    msg.style.color = colors[score] || "var(--slate-400)";
  }

  document.querySelectorAll(".pw-rule").forEach((rule) => {
    const ok = rules[rule.dataset.rule];
    const icon = rule.querySelector(".ri");
    if (icon) {
      icon.textContent = ok ? "✓" : "○";
    }
    rule.classList.toggle("ok", Boolean(ok));
    rule.style.color = ok ? "var(--green)" : "var(--slate-500)";
  });

  const match = document.getElementById("pw-match");
  if (match) {
    if (!confirm) {
      match.textContent = "";
    } else if (pw === confirm) {
      match.textContent = "✓ Les mots de passe correspondent";
      match.style.color = "var(--green)";
    } else {
      match.textContent = "✕ Ne correspondent pas";
      match.style.color = "var(--red)";
    }
  }
}

function register() {
  const nom = document.getElementById("nom")?.value?.trim();
  const prenom = document.getElementById("prenom")?.value?.trim();
  const cmu = document.getElementById("cmu")?.value?.trim();
  const telephone = document.getElementById("telephone")?.value?.trim();
  const email = document.getElementById("email")?.value?.trim();
  const dateNaissance = document.getElementById("dateNaissance")?.value;
  const sexe = document.getElementById("sexe")?.value;
  const motDePasse = document.getElementById("pw1")?.value;
  const confirmation = document.getElementById("pw2")?.value;
  const groupeSanguin = document.getElementById("groupeSanguin")?.value;
  const allergie = document.getElementById("allergie")?.value?.trim();

  let matricule = "";
  if (selectedRole === "medecin") {
    matricule = document.getElementById("matricule")?.value?.trim() || "";
  } else if (selectedRole === "infirmier") {
    matricule = document.getElementById("matriculeInfirmier")?.value?.trim() || "";
  } else if (selectedRole === "patient") {
    const isProCreatingPatient = document.getElementById("isProPatient")?.checked;
    if (isProCreatingPatient) {
      matricule = document.getElementById("matriculeProPatient")?.value?.trim() || "";
    }
  }

  const specialiteMedicale = document.getElementById("specialiteMedicale")?.value;
  const service = document.getElementById("service")?.value;
  const cgu = document.getElementById("cgu")?.checked;
  const photo = document.getElementById("photoProfil")?.files?.[0];

  if (!nom || !prenom || !cmu || !telephone || !email || !motDePasse) {
    alert("Veuillez renseigner les informations obligatoires.");
    return;
  }

  if (motDePasse !== confirmation) {
    alert("Les mots de passe ne correspondent pas.");
    return;
  }

  if (!cgu) {
    alert("Veuillez accepter les CGU et la politique de confidentialite.");
    return;
  }

  fetch("http://localhost:8080/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nom,
      prenom,
      cmu,
      telephone,
      email,
      dateNaissance,
      sexe,
      motDePasse,
      role: selectedRole.toUpperCase(),
      photoProfil: photo ? photo.name : "default.jpg",
      groupeSanguin,
      allergie,
      matricule,
      specialiteMedicale,
      service
    })
  })
    .then(async (res) => {
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Erreur inscription");
      }
      return res.text();
    })
    .then(() => {
      if (selectedRole.toUpperCase() === "MEDECIN") {
        syncMedecinSession({
          nom,
          prenom,
          telephone,
          email,
          matricule,
          specialiteMedicale,
          sexe,
          dateNaissance,
          cmu
        });
      }
      if (selectedRole.toUpperCase() === "INFIRMIER") {
        syncInfirmierSession({
          nom,
          prenom,
          telephone,
          email,
          matricule,
          service,
          sexe,
          dateNaissance,
          cmu
        });
      }
      if (selectedRole.toUpperCase() === "PATIENT") {
        syncPatientSession({
          nom,
          prenom,
          telephone,
          email,
          sexe,
          dateNaissance,
          cmu
        });
      }
      const recapNom = document.getElementById("rc-nom");
      const recapCmu = document.getElementById("rc-cmu");
      const recapRole = document.getElementById("rc-role");
      if (recapNom) recapNom.textContent = `${prenom} ${nom}`;
      if (recapCmu) recapCmu.textContent = cmu;
      if (recapRole) recapRole.textContent = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
      setStep(4);
    })
    .catch((err) => {
      console.error(err);
      alert(err.message || "Erreur lors de l'inscription.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const activeRole = document.querySelector(".role-btn.active");
  if (activeRole) {
    toggleRole(activeRole.dataset.role);
  }
  const defaultCard = document.querySelector(".role-card.selected");
  if (defaultCard) {
    pickRole(defaultCard.dataset.role, defaultCard);
  }
  if (document.querySelector(".inscrip-step")) {
    setStep(1);
    checkPw();
  }
});
