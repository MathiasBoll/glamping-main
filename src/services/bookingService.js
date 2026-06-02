// src/services/bookingService.js
// ─────────────────────────────────────────────────────────
// Servicefunktioner til bookinger.
// ─────────────────────────────────────────────────────────

import apiClient from './apiClient';

// Opret en booking (offentlig)
export const createBooking = (data) => {
    return apiClient('/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// Hent alle bookinger (backoffice)
export const getAdminBookings = () => {
    return apiClient('/admin/bookings');
};

// Opdater booking-status (backoffice)
export const updateBookingStatus = (id, status) => {
    return apiClient(`/admin/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
};

// Slet booking (backoffice)
export const deleteBooking = (id) => {
    return apiClient(`/admin/bookings/${id}`, {
        method: 'DELETE',
    });
};
