/**
 * MediBook Admin – Logique JavaScript Centralisée
 * Gère les interactions du Dashboard, des listes et de la configuration.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('MediBook Admin Interface Initialisée');

    // 1. Gestion de la navigation (Sidebar active state)
    const currentPath = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.sb-item');

    // Remove active class from all items first
    navItems.forEach(item => item.classList.remove('active'));

    // Add active class to the correct item
    if (currentPath) {
        const activeItem = document.querySelector(`.sb-item[href="${currentPath}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    // 2. Simulation de validation/rejet de comptes (comptes-pending.html)
    const pendingTable = document.querySelector('table');
    if (pendingTable && window.location.pathname.includes('comptes-pending.html')) {
        pendingTable.addEventListener('click', (e) => {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;

            const userName = row.querySelector('div[style*="font-weight:600"]').textContent.trim();

            if (target.classList.contains('btn-primary') && target.textContent.includes('Valider')) {
                if (confirm(`Voulez-vous vraiment valider le compte de ${userName} ?`)) {
                    alert(`Le compte de ${userName} a été validé avec succès.`);
                    row.style.opacity = '0.5';
                    target.textContent = 'Validé';
                    target.disabled = true;
                    target.classList.replace('btn-primary', 'btn-secondary');
                    row.querySelector('.btn-danger').remove();
                }
            } else if (target.classList.contains('btn-danger') && target.textContent.includes('Rejeter')) {
                if (confirm(`Voulez-vous vraiment rejeter la demande de ${userName} ?`)) {
                    alert(`La demande de ${userName} a été rejetée.`);
                    row.remove();
                }
            }
        });
    }

    // 3. Gestion des formulaires de configuration (configuration.html)
    const configFormButton = document.querySelector('button.btn-primary');
    if (configFormButton && window.location.pathname.includes('configuration.html')) {
        configFormButton.addEventListener('click', (e) => {
            e.preventDefault();
            alert('La configuration système a été mise à jour avec succès (simulation).');
        });
    }

    // 4. Simulation de recherche (pages de gestion)
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'table-row';
            });
        });
    }

    // 5. Animation des notifications
    const notifBtn = document.querySelector('.icon-btn');
    if (notifBtn && notifBtn.textContent.includes('🔔')) {
        notifBtn.addEventListener('click', () => {
            const dot = notifBtn.querySelector('.notif-dot');
            if (dot) {
                dot.remove();
                alert('Notifications consultées.');
            } else {
                alert('Vous n\'avez pas de nouvelles notifications.');
            }
        });
    }
});
