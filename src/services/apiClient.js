// src/services/apiClient.js
// ─────────────────────────────────────────────────────────
// Central HTTP-klient for alle API-kald.
// Base-URL hentes fra .env så det er nemt at skifte
// mellem lokal server og produktion.
// ─────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3042';

// Hjælpefunktion der wrapper fetch med fejlhåndtering
// og automatisk JSON-parsing.
const apiClient = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `HTTP fejl: ${response.status}`);
    }

    // DELETE returnerer ingen body — tjek om der er indhold
    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

export default apiClient;
