// src/services/messageAdminService.js
// ─────────────────────────────────────────────────────────
// Servicefunktioner til backoffice beskedhåndtering.
// Beskeder sendes via den offentlige kontaktformular (POST /contact)
// og administreres herinde (GET, PATCH status, DELETE).
// ─────────────────────────────────────────────────────────

import apiClient from './apiClient';

// Hent alle beskeder sorteret nyeste først
export const getAdminMessages = () => {
    return apiClient('/admin/messages');
};

// Opdater status på en besked (ny | læst | besvaret | arkiveret)
export const updateMessageStatus = (id, status) => {
    return apiClient(`/admin/messages/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
};

// Gem svar-tekst og markér besked som besvaret
export const replyToMessage = (id, reply) => {
    return apiClient(`/admin/messages/${id}/reply`, {
        method: 'PATCH',
        body: JSON.stringify({ reply }),
    });
};

// Slet besked via id
export const deleteMessage = (id) => {
    return apiClient(`/admin/messages/${id}`, {
        method: 'DELETE',
    });
};
