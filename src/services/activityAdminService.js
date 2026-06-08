// src/services/activityAdminService.js
// ─────────────────────────────────────────────────────────
// Servicefunktioner til backoffice aktivitetsstyring.
// Backend-routes (singular):
//   GET    /activities        → hent alle
//   GET    /activity/:id      → hent én
//   POST   /activity          → opret
//   PUT    /activity/:id      → opdater
//   DELETE /activity/:id      → slet
// ─────────────────────────────────────────────────────────

import apiClient from './apiClient';

// Hent alle aktiviteter (bruges i backoffice-tabellen)
export const getAdminActivities = () => {
    return apiClient('/activities');
};

// Opret ny aktivitet
// data = { title, date, time, description, image }
export const createActivity = (data) => {
    return apiClient('/activity', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// Opdater eksisterende aktivitet via id
// data = de felter der skal ændres
export const updateActivity = (id, data) => {
    return apiClient(`/activity/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

// Slet aktivitet via id
export const deleteActivity = (id) => {
    return apiClient(`/activity/${id}`, {
        method: 'DELETE',
    });
};

// Slå aktivitet til/fra (isActive: true/false)
export const toggleActivityActive = (id, isActive) => {
    return apiClient(`/activity/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive }),
    });
};
