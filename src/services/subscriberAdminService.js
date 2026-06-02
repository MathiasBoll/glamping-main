// src/services/subscriberAdminService.js
// ─────────────────────────────────────────────────────────
// Servicefunktioner til nyhedsbrev-abonnenter.
// ─────────────────────────────────────────────────────────

import apiClient from './apiClient';

// Tilmeld e-mail til nyhedsbrev (offentlig)
export const subscribeNewsletter = (email) => {
    return apiClient('/subscribers', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
};

// Hent alle abonnenter (backoffice) — støtter ?page=&limit=
export const getAdminSubscribers = (page = 1, limit = 20) => {
    return apiClient(`/admin/subscribers?page=${page}&limit=${limit}`);
};

// Opdater abonnent-email (backoffice)
export const updateSubscriber = (id, email) => {
    return apiClient(`/admin/subscribers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ email }),
    });
};

// Slet abonnent (backoffice)
export const deleteSubscriber = (id) => {
    return apiClient(`/admin/subscribers/${id}`, {
        method: 'DELETE',
    });
};
