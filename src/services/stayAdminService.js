// src/services/stayAdminService.js
// ─────────────────────────────────────────────────────────
// Servicefunktioner til backoffice opholdsstyring.
// ─────────────────────────────────────────────────────────

import apiClient from './apiClient';

// Hent alle ophold (bruges i backoffice-tabellen)
export const getAdminStays = () => {
    return apiClient('/stays');
};

// Opret nyt ophold
// data = { title, numberOfPersons, price, image, teaser }
export const createStay = (data) => {
    return apiClient('/stays', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// Opdater eksisterende ophold via id
export const updateStay = (id, data) => {
    return apiClient(`/stays/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

// Slet ophold via id
export const deleteStay = (id) => {
    return apiClient(`/stays/${id}`, {
        method: 'DELETE',
    });
};

// Slå ophold til/fra (isActive: true/false)
export const toggleStayActive = (id, isActive) => {
    return apiClient(`/stays/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive }),
    });
};
