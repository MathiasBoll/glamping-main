const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3042';

/**
 * Uploader ét billedfil til backend og returnerer den offentlige URL.
 * @param {File} file - Fil-objektet fra <input type="file">
 * @returns {Promise<string>} - URL til det uploadede billede
 */
export const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${BASE_URL}/upload`, { method: 'POST', body: fd });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Upload fejlede');
    }
    const data = await res.json();
    return data.url;
};
