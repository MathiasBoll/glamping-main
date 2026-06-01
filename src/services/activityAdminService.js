// src/services/activityAdminService.js
// ─────────────────────────────────────────────────────────
// Servicefunktioner til backoffice aktivitetsstyring.
// Al kommunikation med backend sker HER — ikke direkte i components.
// Det gør det nemt at skifte API-url eller tilføje auth senere.
// ─────────────────────────────────────────────────────────

import apiClient from './apiClient';

// Hent alle aktiviteter (bruges i backoffice-tabellen)
export const getAdminActivities = () => {
    return apiClient('/activities');
};

// Opret ny aktivitet
// data = { title, date, time, description, image }
export const createActivity = (data) => {
    return apiClient('/activities', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// Opdater eksisterende aktivitet via id
// data = de felter der skal ændres
export const updateActivity = (id, data) => {
    return apiClient(`/activities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

// Slet aktivitet via id
export const deleteActivity = (id) => {
    return apiClient(`/activities/${id}`, {
        method: 'DELETE',
    });
};
