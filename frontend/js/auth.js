let selectedRole = "patient";

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

  const map = [
    ["f-mat", isMed],
    ["f-spe", isMed],
    ["f-mat-inf", isInf],
    ["f-srv", isInf],
    ["f-sang", isPat],
    ["f-allergie", isPat]
  ];

  map.forEach(([id, visible]) => {
    const node = document.getElementById(id);
    if (node) {
      node.style.display = visible ? "flex" : "none";
    }
  });

  const roleField = document.getElementById("rc-role");
  if (roleField) {
    roleField.textContent = role.charAt(0).toUpperCase() + role.slice(1);
  }
}

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
      dot.textContent = "✓";
    } else if (current === step) {
      item.classList.add("active");
      dot.textContent = String(current);
    } else {
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

  const identifiant = document.getElementById("identifiant")?.value;
  const motDePasse = document.getElementById("motDePasse")?.value;

  fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      identifiant: identifiant,
      motDePasse: motDePasse
    })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error("Erreur login");
    }
    return res.json();
  })
  .then(data => {
    console.log(data);

    // sauvegarde utilisateur
    localStorage.setItem("user", JSON.stringify(data));

    const dashboardByRole = {
      PATIENT: "./patient/dashboard.html",
      MEDECIN: "./medecin/dashboard.html",
      INFIRMIER: "./infirmier/dashboard.html"
    };

    // redirection selon rôle backend
    window.location.href = dashboardByRole[data.role] || dashboardByRole.PATIENT;
  })
  .catch(err => {
    console.error(err);
    alert("Identifiants incorrects ❌");
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
  const labels = ["", "Très faible", "Faible", "Moyen", "Fort"];

  for (let i = 1; i <= 4; i += 1) {
    const seg = document.getElementById(`ps${i}`);
    if (seg) {
      seg.style.background = i <= score ? colors[score] : "var(--slate-200)";
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
      match.textContent = "✗ Ne correspondent pas";
      match.style.color = "var(--red)";
    }
  }
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
  }
});
function register() {

  const nom = document.getElementById("nom")?.value;
  const prenom = document.getElementById("prenom")?.value;
  const cmu = document.getElementById("cmu")?.value;
  const telephone = document.getElementById("telephone")?.value;
  const email = document.getElementById("email")?.value;
  const motDePasse = document.getElementById("motDePasse")?.value;
  const photo = document.getElementById("photoProfil")?.files[0];

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
      motDePasse,
      role: selectedRole.toUpperCase(),
      photoProfil: photo ? photo.name : "default.jpg"
    })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error("Erreur inscription");
    }
    return res.text();
  })
  .then(data => {
    alert("Compte créé ✅");
    window.location.href = "./login.html";
  })
  .catch(err => {
    console.error(err);
    alert("Erreur lors de l'inscription ❌");
  });
}