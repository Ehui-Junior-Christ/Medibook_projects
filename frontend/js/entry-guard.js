/**
 * MediBook - Entry guard
 *
 * Goal:
 * - If a protected page is opened directly (no in-app referrer) and user is not authenticated,
 *   redirect to the home page (frontend/index.html).
 * - Keep normal in-app navigation working (links between pages should not bounce back to home).
 * - Store the intended page so that after login we can resume navigation.
 *
 * Note: This is a front-end convenience guard. Real protection must still be enforced server-side.
 */

(function () {
  const PUBLIC_PAGES = new Set([
    "index.html",
    "pages/login.html",
    "pages/inscription.html",
    "pages/admin/login.html"
  ]);

  function safeJsonParse(value) {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  function getRequiredRole(relPath) {
    const rel = String(relPath || "").replace(/^\/+/, "");
    if (rel.startsWith("pages/patient/")) return "PATIENT";
    if (rel.startsWith("pages/medecin/")) return "MEDECIN";
    if (rel.startsWith("pages/infirmier/")) return "INFIRMIER";
    if (rel.startsWith("pages/admin/")) return "ADMINISTRATEUR";
    return null;
  }

  function getRelFromFrontend(pathname) {
    // We support two common setups:
    // 1) server root is the repo/project root: /frontend/pages/...
    // 2) server root is already frontend/: /pages/...
    const raw = String(pathname || "");
    const lower = raw.toLowerCase();

    const marker = "/frontend/";
    const idx = lower.lastIndexOf(marker);
    if (idx !== -1) {
      return raw.slice(idx + marker.length).replace(/^\/+/, "");
    }

    // When frontend is the web root, pathname starts with "/pages/..." or "/index.html".
    const trimmed = raw.replace(/^\/+/, "");
    if (!trimmed) return null;
    if (trimmed.startsWith("pages/") || trimmed === "index.html") return trimmed;
    return null;
  }

  function getFrontendRootUrl() {
    const rel = getRelFromFrontend(window.location.pathname);
    if (!rel) return null;

    // Resolve index.html relative to the current document.
    // If rel = "pages/patient/dashboard.html", we need "../../index.html".
    const depth = rel.split("/").length - 1; // number of path segments before the filename
    let up = "";
    for (let i = 0; i < depth; i += 1) up += "../";
    return new URL(`${up}index.html`, window.location.href).toString();
  }

  function isPublic(relFromFrontend) {
    if (!relFromFrontend) return false;
    const rel = relFromFrontend.replace(/^\/+/, "");
    return PUBLIC_PAGES.has(rel);
  }

  function getUserSession() {
    const user = safeJsonParse(localStorage.getItem("user") || "null");
    if (!user || typeof user !== "object") return null;
    const role = String(user.role || "").toUpperCase();
    const okRole = ["PATIENT", "MEDECIN", "INFIRMIER", "ADMINISTRATEUR"].includes(role);    // Backend seems to return `id`; accept other common keys too to avoid false negatives.
    const id = user.id ?? user.userId ?? user.utilisateurId ?? null;
    const okId = typeof id === "number" || (typeof id === "string" && id.trim() !== "");
    if (!okRole || !okId) return null;
    return { role, id };
  }


  const rel = getRelFromFrontend(window.location.pathname);
  if (!rel) return;

  if (isPublic(rel)) return;

  const session = getUserSession();
  const requiredRole = getRequiredRole(rel);
  const hasSession = Boolean(session);

  // Debug aid (useful when one browser behaves differently, e.g. cache/storage).
  // This is intentionally quiet: no console logs, just a global you can inspect.
  window.__mb_entry_guard = {
    pathname: window.location.pathname,
    rel,
    isPublic: isPublic(rel),
    hasSession,
    requiredRole,
    sessionRole: session?.role || null,
    root: null
  };

  // If authenticated but tries to open another role's area, force back to home.
  if (hasSession && requiredRole && session.role !== requiredRole) {
    const root = getFrontendRootUrl();
    if (root) {
      window.__mb_entry_guard.root = root;
      window.location.replace(root);
    }
    return;
  }

  if (hasSession) return;

  // Remember where the user tried to go.
  sessionStorage.setItem("mb_intended_rel", rel);
  const root = getFrontendRootUrl();
  if (!root) return;
  window.__mb_entry_guard.root = root;
  sessionStorage.setItem("mb_intended_url", new URL(rel, root).toString());
  window.location.replace(root);
})();
