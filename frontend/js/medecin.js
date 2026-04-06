function setCert(type, el) {
  document.querySelectorAll("#certTypePills .dpill").forEach((pill) => {
    pill.classList.toggle("sel", pill === el);
  });

  const start = document.getElementById("fArretD");
  const end = document.getElementById("fArretF");
  if (start && end) {
    const visible = type === "arret";
    start.style.display = visible ? "flex" : "none";
    end.style.display = visible ? "flex" : "none";
  }

  updateCert(type);
}

function updateCert(explicitType) {
  const type = explicitType || document.querySelector("#certTypePills .dpill.sel")?.dataset.type || "apt";
  const dateValue = document.getElementById("cDate")?.value || "";
  const motif = document.getElementById("cMotif")?.value || "pour raisons de santé";
  const restrictions = document.getElementById("cRestr")?.value || "";
  const title = document.getElementById("cpTitle");
  const main = document.getElementById("cpMain");
  const restr = document.getElementById("cpRestr");
  const date = document.getElementById("cpDate");
  const titles = {
    apt: "Certificat d'aptitude au travail",
    arret: "Certificat d'arrêt de travail",
    dispense: "Certificat de dispense",
    general: "Certificat médical général"
  };

  if (title) {
    title.textContent = titles[type];
  }
  if (date) {
    date.textContent = dateValue ? new Date(dateValue).toLocaleDateString("fr-FR") : "…";
  }
  if (main) {
    if (type === "arret") {
      const start = document.getElementById("arretD")?.value;
      const end = document.getElementById("arretF")?.value;
      const from = start ? new Date(start).toLocaleDateString("fr-FR") : "…";
      const to = end ? new Date(end).toLocaleDateString("fr-FR") : "…";
      main.innerHTML = `Prescrit un arrêt de travail du <strong>${from}</strong> au <strong>${to}</strong>, ${motif}.`;
    } else if (type === "dispense") {
      main.innerHTML = `Délivre une dispense d'activité scolaire / sportive, ${motif}.`;
    } else if (type === "general") {
      main.innerHTML = `Certifie avoir examiné le patient ce jour (${motif}).`;
    } else {
      main.innerHTML = "Et atteste que l'état de santé de ce patient lui permet d'exercer son activité professionnelle sans restriction particulière.";
    }
  }
  if (restr) {
    restr.innerHTML = restrictions ? `<em>Restrictions : ${restrictions}</em>` : "";
  }
}

function addRow() {
  const table = document.getElementById("ordoRows");
  if (!table) {
    return;
  }
  const row = document.createElement("tr");
  row.innerHTML = '<td><input type="text" placeholder="Médicament"></td><td><input type="text" placeholder="Dosage"></td><td><select><option>Oral</option><option>IV</option><option>IM</option></select></td><td><input type="number" value="1" min="1" max="6"></td><td><input type="text" placeholder="Matin..."></td><td><input type="number" value="7"></td><td><input type="text" placeholder="Instructions"></td><td><button class="btn-row-del" type="button" onclick="delRow(this)">✕</button></td>';
  table.appendChild(row);
}

function delRow(button) {
  const rows = document.getElementById("ordoRows")?.rows;
  if (rows && rows.length > 1) {
    button.closest("tr")?.remove();
  }
}

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

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => chip.classList.toggle("sel"));
  });

  document.querySelectorAll("#ct3 .dpill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll("#ct3 .dpill").forEach((node) => node.classList.remove("sel"));
      pill.classList.add("sel");
    });
  });

  if (document.getElementById("certTypePills")) {
    updateCert();
  }
});
