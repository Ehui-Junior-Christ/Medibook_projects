/**
 * MediBook Admin - Couche API
 * Centralise tous les appels vers le backend Spring Boot (port 8080).
 */



const API_BASE = "http://localhost:8080/api/admin";

const AdminAPI = {

    /** Test de connexion */
    ping() {
        return fetch(`${API_BASE}/ping`).then(r => r.text());
    },

    /** Statistiques globales */
    getStatistiques() {
        return fetch(`${API_BASE}/statistiques`).then(r => {
            if (!r.ok) throw new Error("Erreur chargement statistiques");
            return r.json();
        });
    },

    /** Tous les utilisateurs (filtre optionnel par role) */
    getUtilisateurs(role) {
        const url = role
            ? `${API_BASE}/utilisateurs?role=${encodeURIComponent(role)}`
            : `${API_BASE}/utilisateurs`;
        return fetch(url).then(r => {
            if (!r.ok) throw new Error("Erreur chargement utilisateurs");
            return r.json();
        });
    },

    /** Comptes en attente de validation */
    getComptesEnAttente() {
        return fetch(`${API_BASE}/utilisateurs/pending`).then(r => {
            if (!r.ok) throw new Error("Erreur chargement comptes en attente");
            return r.json();
        });
    },

    /** Un utilisateur par ID */
    getUtilisateur(id) {
        return fetch(`${API_BASE}/utilisateurs/${id}`).then(r => {
            if (!r.ok) throw new Error("Utilisateur introuvable");
            return r.json();
        });
    },

    /** Activer un compte */
    activer(id) {
        return fetch(`${API_BASE}/utilisateurs/${id}/activer`, {
            method: "PUT"
        }).then(r => {
            if (!r.ok) throw new Error("Erreur activation");
            return r.json();
        });
    },

    /** Desactiver un compte */
    desactiver(id) {
        return fetch(`${API_BASE}/utilisateurs/${id}/desactiver`, {
            method: "PUT"
        }).then(r => {
            if (!r.ok) throw new Error("Erreur desactivation");
            return r.json();
        });
    },

    /** Supprimer un compte */
    supprimer(id) {
        return fetch(`${API_BASE}/utilisateurs/${id}`, {
            method: "DELETE"
        }).then(r => {
            if (!r.ok) throw new Error("Erreur suppression");
            return r.json();
        });
    }
};
