/**
 * MediBook Frontend - Couche API
 * Centralise les appels vers le backend Spring Boot.
 */

const DEFAULT_BACKEND_ORIGIN = "http://localhost:8080";

function getBackendOrigin() {
    if (window.location.origin === DEFAULT_BACKEND_ORIGIN) {
        return window.location.origin;
    }

    return window.localStorage.getItem("medibookApiOrigin") || DEFAULT_BACKEND_ORIGIN;
}

const API_ROOT = `${getBackendOrigin()}/api`;
const ADMIN_API_BASE = `${API_ROOT}/admin`;

async function parseApiResponse(response, defaultMessage) {
    if (response.ok) {
        const contentType = response.headers.get("content-type") || "";
        return contentType.includes("application/json") ? response.json() : response.text();
    }

    const errorText = await response.text();
    throw new Error(errorText || defaultMessage);
}

async function apiRequest(path, options = {}, defaultMessage = "Erreur API") {
    let response;

    try {
        response = await fetch(`${API_ROOT}${path}`, options);
    } catch (error) {
        throw new Error("Le backend Spring Boot est inaccessible sur http://localhost:8080.");
    }

    return parseApiResponse(response, defaultMessage);
}

window.AdminAPI = {
    ping() {
        return fetch(`${ADMIN_API_BASE}/ping`).then(r => r.text());
    },

    getStatistiques() {
        return fetch(`${ADMIN_API_BASE}/statistiques`).then(r => {
            if (!r.ok) throw new Error("Erreur chargement statistiques");
            return r.json();
        });
    },

    getUtilisateurs(role) {
        const url = role
            ? `${ADMIN_API_BASE}/utilisateurs?role=${encodeURIComponent(role)}`
            : `${ADMIN_API_BASE}/utilisateurs`;
        return fetch(url).then(r => {
            if (!r.ok) throw new Error("Erreur chargement utilisateurs");
            return r.json();
        });
    },

    getComptesEnAttente() {
        return fetch(`${ADMIN_API_BASE}/utilisateurs/pending`).then(r => {
            if (!r.ok) throw new Error("Erreur chargement comptes en attente");
            return r.json();
        });
    },

    getUtilisateur(id) {
        return fetch(`${ADMIN_API_BASE}/utilisateurs/${id}`).then(r => {
            if (!r.ok) throw new Error("Utilisateur introuvable");
            return r.json();
        });
    },

    activer(id) {
        return fetch(`${ADMIN_API_BASE}/utilisateurs/${id}/activer`, {
            method: "PUT"
        }).then(r => {
            if (!r.ok) throw new Error("Erreur activation");
            return r.json();
        });
    },

    desactiver(id) {
        return fetch(`${ADMIN_API_BASE}/utilisateurs/${id}/desactiver`, {
            method: "PUT"
        }).then(r => {
            if (!r.ok) throw new Error("Erreur desactivation");
            return r.json();
        });
    },

    supprimer(id) {
        return fetch(`${ADMIN_API_BASE}/utilisateurs/${id}`, {
            method: "DELETE"
        }).then(r => {
            if (!r.ok) throw new Error("Erreur suppression");
            return r.json();
        });
    }
};

window.InfirmierAPI = {
    searchPatients(query) {
        return apiRequest(`/patients/search?q=${encodeURIComponent(query)}`, {
            method: "GET"
        }, "Erreur recherche patients");
    },

    createSoin(payload) {
        return apiRequest("/soins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }, "Erreur enregistrement soin");
    },

    createSigneVital(payload) {
        return apiRequest("/signes-vitaux", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }, "Erreur enregistrement signes vitaux");
    },

    uploadDocument(formData) {
        return apiRequest("/documents/upload", {
            method: "POST",
            body: formData
        }, "Erreur upload document");
    }
};
