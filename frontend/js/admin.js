/**
 * MediBook Admin - Logique JavaScript Centralisee
 * Gere les interactions du dashboard, des listes et de la configuration.
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("MediBook Admin Interface Initialisee");

    const adminNotificationCount = 5;
    const adminNotifications = [
        { title: "Comptes en attente", body: "Cinq demandes d'acces professionnel attendent une verification.", time: "Aujourd'hui · 08:30", tag: "validation" },
        { title: "Sauvegarde cloud", body: "La derniere sauvegarde systeme est terminee avec succes.", time: "Aujourd'hui · 06:10", tag: "systeme" },
        { title: "Nouveau medecin", body: "Un nouveau profil medecin a ete ajoute a la plateforme.", time: "Hier · 18:00", tag: "utilisateur" },
        { title: "Audit securite", body: "Le rapport d'audit mensuel est pret pour consultation.", time: "Hier · 15:20", tag: "securite" },
        { title: "Alerte capacite", body: "L'espace documentaire atteint 78% de sa capacite.", time: "Lundi · 11:45", tag: "stockage" }
    ];
    const currentPage = window.location.pathname.split("/").pop() || "";

    const applyTableSearch = () => {
        const searchInput = document.querySelector(".search-bar input");
        if (!searchInput) return;

        const term = searchInput.value.toLowerCase().trim();
        const rows = document.querySelectorAll("tbody tr");

        rows.forEach((row) => {
            const text = row.textContent.toLowerCase();
            row.style.display = !term || text.includes(term) ? "table-row" : "none";
        });
    };

    const getRowUserName = (row) => {
        return row?.querySelector('div[style*="font-weight:600"]')?.textContent.trim() || "cet utilisateur";
    };

    // 1. Gestion de la navigation (Sidebar active state)
    const currentPath = currentPage;
    const navItems = document.querySelectorAll(".sb-item");

    navItems.forEach((item) => item.classList.remove("active"));

    if (currentPath) {
        const activeItem = document.querySelector(`.sb-item[href="${currentPath}"]`);
        if (activeItem) {
            activeItem.classList.add("active");
        }
    }

    // 2. Simulation de validation/rejet de comptes (comptes-pending.html)
    const pendingTable = document.querySelector("table");
    if (pendingTable && currentPage.includes("comptes-pending.html")) {
        pendingTable.addEventListener("click", (event) => {
            const target = event.target;
            const row = target.closest("tr");
            if (!row) return;

            const userName = getRowUserName(row);
            if (!userName) return;

            if (target.classList.contains("btn-primary") && target.textContent.includes("Valider")) {
                if (confirm(`Voulez-vous vraiment valider le compte de ${userName} ?`)) {
                    alert(`Le compte de ${userName} a ete valide avec succes.`);
                    row.style.opacity = "0.5";
                    target.textContent = "Valide";
                    target.disabled = true;
                    target.classList.replace("btn-primary", "btn-secondary");
                    row.querySelector(".btn-danger")?.remove();
                }
            } else if (target.classList.contains("btn-danger") && target.textContent.includes("Rejeter")) {
                if (confirm(`Voulez-vous vraiment rejeter la demande de ${userName} ?`)) {
                    alert(`La demande de ${userName} a ete rejetee.`);
                    row.remove();
                }
            }
        });
    }

    // 3. Gestion des formulaires de configuration (configuration.html)
    const configFormButton = document.querySelector("button.btn-primary");
    if (configFormButton && currentPage.includes("configuration.html")) {
        configFormButton.addEventListener("click", (event) => {
            event.preventDefault();
            alert("La configuration systeme a ete mise a jour avec succes (simulation).");
        });
    }

    // 4. Simulation de recherche (pages de gestion)
    const searchInput = document.querySelector(".search-bar input");
    if (searchInput) {
        searchInput.addEventListener("input", applyTableSearch);
        document.querySelector(".search-bar .btn.btn-secondary")?.addEventListener("click", applyTableSearch);
    }

    // 5. Actions des pages de gestion
    const managementPages = ["gestion-patients.html", "gestion-medecins.html", "gestion-infirmiers.html"];
    if (managementPages.includes(currentPage)) {
        const title = document.querySelector(".topbar-title")?.textContent.trim() || "utilisateur";
        const table = document.querySelector("tbody");
        const addButton = document.querySelector(".card-header .btn.btn-primary");

        addButton?.addEventListener("click", () => {
            const name = window.prompt(`Nom du nouveau ${title.toLowerCase().replace("gestion des ", "").replace("gestion de ", "").slice(0, -1) || "profil"} :`);
            if (!name || !table) return;

            const columnCount = document.querySelectorAll("thead th").length || 6;
            const row = document.createElement("tr");
            const cells = new Array(columnCount).fill('<td>Nouveau</td>');
            cells[0] = `
                <td>
                    <div class="user-row">
                        <div class="user-ava">MB</div>
                        <div>
                            <div style="font-weight:600">${name}</div>
                            <div style="font-size:11px;color:var(--slate-500)">profil.genere@medibook.ci</div>
                        </div>
                    </div>
                </td>
            `;
            cells[columnCount - 2] = '<td><span class="badge badge-amber">Brouillon</span></td>';
            cells[columnCount - 1] = `
                <td>
                    <div style="display:flex;gap:6px">
                        <button class="btn btn-secondary btn-sm">Modifier</button>
                        <button class="btn btn-danger btn-sm">Suspendre</button>
                    </div>
                </td>
            `;
            row.innerHTML = cells.join("");
            table.prepend(row);
        });

        table?.addEventListener("click", (event) => {
            const target = event.target;
            const row = target.closest("tr");
            if (!row) return;

            const userName = getRowUserName(row);
            const statusBadge = row.querySelector(".badge:last-of-type");

            if (target.classList.contains("btn-secondary") && target.textContent.includes("Modifier")) {
                const nextName = window.prompt(`Modifier le nom de ${userName}`, userName);
                if (nextName) {
                    const nameNode = row.querySelector('div[style*="font-weight:600"]');
                    if (nameNode) nameNode.textContent = nextName;
                }
            }

            if (target.classList.contains("btn-danger") && (target.textContent.includes("Suspendre") || target.textContent.includes("Désactiver") || target.textContent.includes("Desactiver"))) {
                const isActive = target.textContent.includes("Suspendre") || target.textContent.includes("Désactiver") || target.textContent.includes("Desactiver");
                if (isActive) {
                    target.textContent = "Reactiver";
                    target.classList.replace("btn-danger", "btn-primary");
                    if (statusBadge) {
                        statusBadge.className = "badge badge-red";
                        statusBadge.textContent = "Inactif";
                    }
                }
                return;
            }

            if (target.classList.contains("btn-primary") && target.textContent.includes("Reactiver")) {
                target.textContent = currentPage.includes("patients") ? "Désactiver" : "Suspendre";
                target.classList.replace("btn-primary", "btn-danger");
                if (statusBadge) {
                    statusBadge.className = "badge badge-green";
                    statusBadge.textContent = "Actif";
                }
            }
        });
    }

    if (currentPage.includes("dashboard.html")) {
        document.querySelectorAll("table .btn.btn-primary.btn-sm").forEach((button) => {
            button.addEventListener("click", (event) => {
                const row = event.target.closest("tr");
                const userName = getRowUserName(row);
                event.target.textContent = "Valide";
                event.target.disabled = true;
                event.target.classList.replace("btn-primary", "btn-secondary");
                row?.querySelector(".badge-amber")?.classList.replace("badge-amber", "badge-green");
                const badge = row?.querySelector(".badge");
                if (badge) badge.textContent = "Valide";
                alert(`${userName} a ete valide depuis le tableau de bord.`);
            });
        });
    }

    // 6. Animation des notifications
    const topbarRight = document.querySelector(".topbar-right");
    if (topbarRight) {
        let notifBtn = topbarRight.querySelector("[data-admin-notifications]");

        if (!notifBtn) {
            notifBtn = topbarRight.querySelector(".icon-btn:not([href])");
        }

        if (!notifBtn) {
            notifBtn = document.createElement("button");
            notifBtn.type = "button";
            notifBtn.className = "icon-btn";
            notifBtn.textContent = String.fromCodePoint(128276);
            topbarRight.prepend(notifBtn);
        }

        notifBtn.classList.add("icon-btn-count");
        notifBtn.setAttribute("data-admin-notifications", "");
        notifBtn.setAttribute("data-count", String(adminNotificationCount));
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
                    <strong>Notifications admin</strong>
                    <span>${adminNotifications.length} element(s) a consulter</span>
                </div>
                <div class="notif-menu-list">
                    ${adminNotifications.map((item) => `
                        <article class="notif-item">
                            <div class="notif-item-head">
                                <div class="notif-item-title">${item.title}</div>
                                <div class="notif-item-time">${item.time}</div>
                            </div>
                            <div class="notif-item-copy">${item.body}</div>
                            <div class="notif-item-meta">
                                <span class="notif-item-tag">${item.tag}</span>
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

        document.addEventListener("click", (event) => {
            document.querySelectorAll(".notif-shell").forEach((shell) => {
                if (!shell.contains(event.target)) {
                    shell.classList.remove("open");
                }
            });
        });
    }
});
