// src/services/reviewAdminService.js
// ─────────────────────────────────────────────────────────
// Servicefunktioner til backoffice anmeldelsesstyring.
// ─────────────────────────────────────────────────────────

import apiClient from './apiClient';

// Hent alle anmeldelser (bruges i backoffice-tabellen)
export const getAdminReviews = () => {
    return apiClient('/reviews');
};

// Opret ny anmeldelse
// data = { name, age, stay, review }
export const createReview = (data) => {
    return apiClient('/review', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// Opdater eksisterende anmeldelse via id
export const updateReview = (id, data) => {
    return apiClient(`/review/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

// Slet anmeldelse via id
export const deleteReview = (id) => {
    return apiClient(`/review/${id}`, {
        method: 'DELETE',
    });
};
