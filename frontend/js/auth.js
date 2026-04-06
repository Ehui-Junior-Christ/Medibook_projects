let selectedRole = "patient";

function toggleRole(role) {
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
  document.querySelectorAll(".role-btn").forEach((node) => node.classList.remove("active"));
  if (button) {
    button.classList.add("active");
    button.dataset.role = role;
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
      if (dot) {
        dot.textContent = "✓";
      }
    } else if (current === step) {
      item.classList.add("active");
      if (dot) {
        dot.textContent = String(current);
      }
    } else if (dot) {
      dot.textContent = String(current);
    }
  });
}

function updateRecap() {
  const nom = document.getElementById("nom")?.value?.trim() ?? "";
  const prenom = document.getElementById("prenom")?.value?.trim() ?? "";
  const cmu = document.getElementById("cmu")?.value?.trim() ?? "";

  const fullName = [prenom, nom].filter(Boolean).join(" ");

  const nameField = document.getElementById("rc-nom");
  const cmuField = document.getElementById("rc-cmu");
  const roleField = document.getElementById("rc-role");

  if (nameField) {
    nameField.textContent = fullName || "-";
  }
  if (cmuField) {
    cmuField.textContent = cmu || "-";
  }
  if (roleField) {
    roleField.textContent = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
  }
}

function validateStep(step) {
  if (step === 1) {
    return Boolean(selectedRole);
  }

  if (step === 2) {
    const nom = document.getElementById("nom")?.value?.trim();
    const prenom = document.getElementById("prenom")?.value?.trim();
    if (!nom || !prenom) {
      alert("Renseignez au minimum le nom et le prenom.");
      return false;
    }
    updateRecap();
    return true;
  }

  if (step === 3) {
    const pw = document.getElementById("pw1")?.value ?? "";
    const confirm = document.getElementById("pw2")?.value ?? "";
    const cgu = document.getElementById("cgu")?.checked;
    const validPassword = pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[!@#$%^&*]/.test(pw);

    if (!validPassword) {
      alert("Le mot de passe ne respecte pas les regles de securite.");
      return false;
    }
    if (pw !== confirm) {
      alert("Les mots de passe ne correspondent pas.");
      return false;
    }
    if (!cgu) {
      alert("Vous devez accepter les CGU.");
      return false;
    }

    updateRecap();
    return true;
  }

  return true;
}

function isNext(current) {
  if (!validateStep(current)) {
    return;
  }
  setStep(current + 1);
}

function isPrev(current) {
  setStep(current - 1);
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
      match.textContent = "✕ Ne correspondent pas";
      match.style.color = "var(--red)";
    }
  }
}

function goInscription() {
  window.location.href = "./inscription.html";
}

function goLogin() {
  window.location.href = "./login.html";
}

function goApp() {
  window.location.href = "./patient/dashboard.html";
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".role-btn").forEach((btn) => {
    if (!btn.dataset.role) {
      const label = btn.textContent.toLowerCase();
      if (label.includes("medecin")) {
        btn.dataset.role = "medecin";
      } else if (label.includes("infirmier")) {
        btn.dataset.role = "infirmier";
      } else {
        btn.dataset.role = "patient";
      }
    }
  });

  const activeRole = document.querySelector(".role-btn.active");
  if (activeRole) {
    setRole(activeRole.dataset.role, activeRole);
  }

  const defaultCard = document.querySelector(".role-card.selected");
  if (defaultCard) {
    pickRole(defaultCard.dataset.role || "patient", defaultCard);
    setStep(1);
  }
});