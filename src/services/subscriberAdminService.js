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

// Hent alle abonnenter (backoffice)
export const getAdminSubscribers = () => {
    return apiClient('/admin/subscribers');
};

// Slet abonnent (backoffice)
export const deleteSubscriber = (id) => {
    return apiClient(`/admin/subscribers/${id}`, {
        method: 'DELETE',
    });
};
