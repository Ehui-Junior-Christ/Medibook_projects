/**
 * MediBook Admin - Logique JavaScript
 * Connecte chaque page admin au backend Spring Boot via AdminAPI.
 */

document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop() || "";

    /* ── Navigation sidebar ── */
    document.querySelectorAll(".sb-item").forEach(item => item.classList.remove("active"));
    if (currentPage) {
        const active = document.querySelector(`.sb-item[href="${currentPage}"]`);
        if (active) active.classList.add("active");
    }

    /* ── Routage par page ── */
    if (currentPage.includes("dashboard.html"))          loadDashboard();
    if (currentPage.includes("comptes-pending.html"))    loadComptesPending();
    if (currentPage.includes("gestion-patients.html"))   loadGestion("PATIENT");
    if (currentPage.includes("gestion-medecins.html"))   loadGestion("MEDECIN");
    if (currentPage.includes("gestion-infirmiers.html")) loadGestion("INFIRMIER");
    if (currentPage.includes("statistiques.html"))       loadStatistiques();
    if (currentPage.includes("configuration.html"))      initConfiguration();
    if (currentPage.includes("login.html"))              initAdminLogin();

    /* ── Notifications (commun a toutes les pages) ── */
    initNotifications();
});


/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

function getInitials(prenom, nom) {
    const p = (prenom || "").trim().charAt(0);
    const n = (nom || "").trim().charAt(0);
    return (p + n).toUpperCase() || "MB";
}

function formatDate(dateStr) {
    if (!dateStr) return "\u2014";
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatRelative(dateStr) {
    if (!dateStr) return "\u2014";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    const diffH   = Math.floor(diffMs / 3600000);
    const diffJ   = Math.floor(diffMs / 86400000);
    if (diffMin < 1)  return "A l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffH < 24)   return `Il y a ${diffH}h`;
    if (diffJ === 1)  return "Hier";
    if (diffJ < 7)    return `Il y a ${diffJ} jours`;
    return formatDate(dateStr);
}

function roleBadge(role) {
    const cls = { PATIENT: "badge-teal", MEDECIN: "badge-amber", INFIRMIER: "badge-green", ADMINISTRATEUR: "badge-blue" };
    const lbl = { PATIENT: "Patient", MEDECIN: "Medecin", INFIRMIER: "Infirmier", ADMINISTRATEUR: "Admin" };
    return `<span class="badge ${cls[role] || "badge-slate"}">${lbl[role] || role}</span>`;
}

function statusBadge(actif) {
    return actif
        ? '<span class="badge badge-green">Actif</span>'
        : '<span class="badge badge-red">Inactif</span>';
}

function showEmptyRow(colspan, msg) {
    return `<tr><td colspan="${colspan}" style="text-align:center;color:var(--slate-500);padding:32px;">${msg}</td></tr>`;
}


/* ═══════════════════════════════════════════
   LOGIN ADMIN
   ═══════════════════════════════════════════ */

function initAdminLogin() {
    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const identifiant = document.getElementById("admin-id")?.value?.trim();
        const motDePasse  = document.getElementById("admin-password")?.value;

        if (!identifiant || !motDePasse) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifiant, motDePasse })
        })
            .then(res => {
                if (!res.ok) throw new Error("Identifiants incorrects");
                return res.json();
            })
            .then(data => {
                if (data.role !== "ADMINISTRATEUR") {
                    throw new Error("Acces reserve aux administrateurs.");
                }
                localStorage.setItem("user", JSON.stringify(data));
                window.location.href = "dashboard.html";
            })
            .catch(err => {
                alert(err.message || "Erreur de connexion.");
            });
    });
}


/* ═══════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════ */

function loadDashboard() {
    AdminAPI.getStatistiques().then(stats => {
        const el = (id) => document.getElementById(id);
        if (el("stat-patients"))   el("stat-patients").textContent   = stats.totalPatients.toLocaleString("fr-FR");
        if (el("stat-medecins"))   el("stat-medecins").textContent   = stats.totalMedecins.toLocaleString("fr-FR");
        if (el("stat-infirmiers")) el("stat-infirmiers").textContent = stats.totalInfirmiers.toLocaleString("fr-FR");
        if (el("stat-pending"))    el("stat-pending").textContent    = stats.comptesInactifs.toLocaleString("fr-FR");
    }).catch(err => console.error("Erreur stats dashboard:", err));

    AdminAPI.getComptesEnAttente().then(users => {
        const tbody = document.getElementById("dashboard-pending-body");
        if (!tbody) return;
        if (users.length === 0) {
            tbody.innerHTML = showEmptyRow(5, "Aucun compte en attente");
            return;
        }
        tbody.innerHTML = users.slice(0, 5).map(u => `
            <tr data-id="${u.id}">
                <td>
                    <div class="user-row">
                        <div class="user-ava">${getInitials(u.prenom, u.nom)}</div>
                        <div>
                            <div style="font-weight:600">${u.nomComplet || (u.prenom + " " + u.nom)}</div>
                            <div style="font-size:11px;color:var(--slate-500)">${u.email || ""}</div>
                        </div>
                    </div>
                </td>
                <td>${roleBadge(u.role)}</td>
                <td>${formatRelative(u.createdAt)}</td>
                <td><span class="badge badge-amber">En attente</span></td>
                <td><button class="btn btn-primary btn-sm" onclick="validerDepuisDashboard(${u.id}, this)">Valider</button></td>
            </tr>
        `).join("");
    }).catch(err => console.error("Erreur pending dashboard:", err));
}

function validerDepuisDashboard(id, btn) {
    AdminAPI.activer(id).then(res => {
        if (res.succes) {
            const row = btn.closest("tr");
            btn.textContent = "Valide";
            btn.disabled = true;
            btn.classList.replace("btn-primary", "btn-secondary");
            const badge = row.querySelector(".badge-amber");
            if (badge) { badge.classList.replace("badge-amber", "badge-green"); badge.textContent = "Valide"; }
        }
    }).catch(err => alert("Erreur : " + err.message));
}


/* ═══════════════════════════════════════════
   COMPTES EN ATTENTE
   ═══════════════════════════════════════════ */

function loadComptesPending() {
    const tbody = document.getElementById("pending-body");
    if (!tbody) return;

    AdminAPI.getComptesEnAttente().then(users => {
        if (users.length === 0) {
            tbody.innerHTML = showEmptyRow(6, "Aucun compte en attente de validation");
            return;
        }
        tbody.innerHTML = users.map(u => `
            <tr data-id="${u.id}">
                <td>
                    <div class="user-row">
                        <div class="user-ava">${getInitials(u.prenom, u.nom)}</div>
                        <div>
                            <div style="font-weight:600">${u.nomComplet || (u.prenom + " " + u.nom)}</div>
                            <div style="font-size:11px;color:var(--slate-500)">${u.email || ""}</div>
                        </div>
                    </div>
                </td>
                <td>${roleBadge(u.role)}</td>
                <td><span style="font-family:monospace">${u.cmu || "\u2014"}</span></td>
                <td>\u2014</td>
                <td>${formatRelative(u.createdAt)}</td>
                <td>
                    <div style="display:flex;gap:6px">
                        <button class="btn btn-primary btn-sm" onclick="validerCompte(${u.id}, this)">Valider</button>
                        <button class="btn btn-danger btn-sm" onclick="rejeterCompte(${u.id}, this)">Rejeter</button>
                    </div>
                </td>
            </tr>
        `).join("");

        const sbBadge = document.querySelector(".sb-item[href='comptes-pending.html'] .sb-badge");
        if (sbBadge) sbBadge.textContent = users.length;
    }).catch(err => {
        tbody.innerHTML = showEmptyRow(6, "Erreur de chargement");
        console.error(err);
    });
}

function validerCompte(id, btn) {
    if (!confirm("Valider ce compte ?")) return;
    AdminAPI.activer(id).then(res => {
        if (res.succes) {
            const row = btn.closest("tr");
            row.style.opacity = "0.4";
            btn.textContent = "Valide";
            btn.disabled = true;
            btn.classList.replace("btn-primary", "btn-secondary");
            row.querySelector(".btn-danger")?.remove();
        }
    }).catch(err => alert("Erreur : " + err.message));
}

function rejeterCompte(id, btn) {
    if (!confirm("Rejeter et supprimer ce compte ?")) return;
    AdminAPI.supprimer(id).then(res => {
        if (res.succes) {
            btn.closest("tr").remove();
        }
    }).catch(err => alert("Erreur : " + err.message));
}


/* ═══════════════════════════════════════════
   GESTION (Patients / Medecins / Infirmiers)
   ═══════════════════════════════════════════ */

function loadGestion(role) {
    const tbody = document.getElementById("gestion-body");
    if (!tbody) return;

    AdminAPI.getUtilisateurs(role).then(users => {
        if (users.length === 0) {
            tbody.innerHTML = showEmptyRow(6, "Aucun utilisateur trouve");
            return;
        }
        tbody.innerHTML = users.map(u => {
            const actionBtn = u.actif
                ? `<button class="btn btn-danger btn-sm" onclick="toggleActif(${u.id}, false, this)">Suspendre</button>`
                : `<button class="btn btn-primary btn-sm" onclick="toggleActif(${u.id}, true, this)">Reactiver</button>`;

            let extraCols = "";
            if (role === "PATIENT") {
                extraCols = `
                    <td><span style="font-family:monospace">${u.cmu || "\u2014"}</span></td>
                    <td>${formatDate(u.createdAt)}</td>
                    <td>${u.telephone || "\u2014"}</td>
                `;
            } else {
                extraCols = `
                    <td><span style="font-family:monospace">${u.cmu || "\u2014"}</span></td>
                    <td>\u2014</td>
                    <td>\u2014</td>
                `;
            }

            return `
                <tr data-id="${u.id}">
                    <td>
                        <div class="user-row">
                            <div class="user-ava">${getInitials(u.prenom, u.nom)}</div>
                            <div>
                                <div style="font-weight:600">${u.nomComplet || (u.prenom + " " + u.nom)}</div>
                                <div style="font-size:11px;color:var(--slate-500)">${u.email || ""}</div>
                            </div>
                        </div>
                    </td>
                    ${extraCols}
                    <td>${statusBadge(u.actif)}</td>
                    <td>
                        <div style="display:flex;gap:6px">
                            ${actionBtn}
                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    }).catch(err => {
        tbody.innerHTML = showEmptyRow(6, "Erreur de chargement");
        console.error(err);
    });

    const searchInput = document.querySelector(".search-bar input");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const term = searchInput.value.toLowerCase().trim();
            document.querySelectorAll("tbody tr").forEach(row => {
                row.style.display = !term || row.textContent.toLowerCase().includes(term) ? "table-row" : "none";
            });
        });
    }
}

function toggleActif(id, activer, btn) {
    const msg = activer ? "Reactiver ce compte ?" : "Suspendre ce compte ?";
    if (!confirm(msg)) return;

    const action = activer ? AdminAPI.activer : AdminAPI.desactiver;
    action(id).then(res => {
        if (res.succes) {
            const row = btn.closest("tr");
            const badge = row.querySelector(".badge-green, .badge-red");
            if (activer) {
                btn.textContent = "Suspendre";
                btn.classList.replace("btn-primary", "btn-danger");
                btn.setAttribute("onclick", `toggleActif(${id}, false, this)`);
                if (badge) { badge.className = "badge badge-green"; badge.textContent = "Actif"; }
            } else {
                btn.textContent = "Reactiver";
                btn.classList.replace("btn-danger", "btn-primary");
                btn.setAttribute("onclick", `toggleActif(${id}, true, this)`);
                if (badge) { badge.className = "badge badge-red"; badge.textContent = "Inactif"; }
            }
        }
    }).catch(err => alert("Erreur : " + err.message));
}


/* ═══════════════════════════════════════════
   STATISTIQUES
   ═══════════════════════════════════════════ */

function loadStatistiques() {
    AdminAPI.getStatistiques().then(stats => {
        const el = (id) => document.getElementById(id);
        if (el("kpi-patients"))    el("kpi-patients").textContent    = stats.totalPatients.toLocaleString("fr-FR");
        if (el("kpi-medecins"))    el("kpi-medecins").textContent    = stats.totalMedecins.toLocaleString("fr-FR");
        if (el("kpi-infirmiers"))  el("kpi-infirmiers").textContent  = stats.totalInfirmiers.toLocaleString("fr-FR");
        if (el("kpi-total"))       el("kpi-total").textContent       = stats.totalUtilisateurs.toLocaleString("fr-FR");
        if (el("kpi-actifs"))      el("kpi-actifs").textContent      = stats.comptesActifs.toLocaleString("fr-FR");
        if (el("kpi-inactifs"))    el("kpi-inactifs").textContent    = stats.comptesInactifs.toLocaleString("fr-FR");

        const total = stats.totalUtilisateurs || 1;
        const pctPatients   = Math.round((stats.totalPatients / total) * 100);
        const pctMedecins   = Math.round((stats.totalMedecins / total) * 100);
        const pctInfirmiers = 100 - pctPatients - pctMedecins;

        const pie = document.getElementById("user-pie");
        if (pie) {
            pie.style.background = `conic-gradient(
                var(--teal-500) 0% ${pctPatients}%,
                var(--amber) ${pctPatients}% ${pctPatients + pctMedecins}%,
                var(--green) ${pctPatients + pctMedecins}% 100%
            )`;
        }
        const legend = document.getElementById("user-legend");
        if (legend) {
            legend.innerHTML = `
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;"><div style="width:10px;height:10px;background:var(--teal-500);"></div> Patients (${pctPatients}%)</div>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;"><div style="width:10px;height:10px;background:var(--amber);"></div> Medecins (${pctMedecins}%)</div>
                <div style="display:flex;align-items:center;gap:8px;"><div style="width:10px;height:10px;background:var(--green);"></div> Infirmiers (${pctInfirmiers}%)</div>
            `;
        }
    }).catch(err => console.error("Erreur stats:", err));
}


/* ═══════════════════════════════════════════
   CONFIGURATION (pas d'endpoint backend)
   ═══════════════════════════════════════════ */

function initConfiguration() {
    const saveBtn = document.querySelector("button.btn-primary");
    if (saveBtn) {
        saveBtn.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Configuration sauvegardee (simulation - aucun endpoint backend pour cette fonctionnalite).");
        });
    }
}


/* ═══════════════════════════════════════════
   NOTIFICATIONS
   ═══════════════════════════════════════════ */

function initNotifications() {
    const notifications = [
        { title: "Comptes en attente", body: "Des demandes d'acces professionnel attendent validation.", time: "Aujourd'hui", tag: "validation" },
        { title: "Sauvegarde cloud", body: "La derniere sauvegarde systeme est terminee.", time: "Aujourd'hui", tag: "systeme" },
        { title: "Alerte capacite", body: "L'espace documentaire atteint 78% de sa capacite.", time: "Lundi", tag: "stockage" }
    ];

    const topbarRight = document.querySelector(".topbar-right");
    if (!topbarRight) return;

    let notifBtn = topbarRight.querySelector("[data-admin-notifications]");
    if (!notifBtn) notifBtn = topbarRight.querySelector(".icon-btn:not([href])");
    if (!notifBtn) return;

    if (!notifBtn.parentElement?.classList.contains("notif-shell")) {
        const shell = document.createElement("div");
        shell.className = "notif-shell";
        notifBtn.parentNode?.insertBefore(shell, notifBtn);
        shell.appendChild(notifBtn);

        const menu = document.createElement("div");
        menu.className = "notif-menu";
        menu.innerHTML = `
            <div class="notif-menu-head">
                <strong>Notifications admin</strong>
                <span>${notifications.length} element(s)</span>
            </div>
            <div class="notif-menu-list">
                ${notifications.map(n => `
                    <article class="notif-item">
                        <div class="notif-item-head">
                            <div class="notif-item-title">${n.title}</div>
                            <div class="notif-item-time">${n.time}</div>
                        </div>
                        <div class="notif-item-copy">${n.body}</div>
                        <div class="notif-item-meta">
                            <span class="notif-item-tag">${n.tag}</span>
                            <span class="badge badge-amber">A suivre</span>
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

    document.addEventListener("click", (e) => {
        document.querySelectorAll(".notif-shell").forEach(shell => {
            if (!shell.contains(e.target)) shell.classList.remove("open");
        });
    });
}
