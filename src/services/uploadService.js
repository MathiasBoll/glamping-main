const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3042';
const ENABLE_SERVER_UPLOAD = import.meta.env.VITE_ENABLE_SERVER_UPLOAD === 'true';

const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Kunne ikke læse billedfilen'));
        reader.readAsDataURL(file);
    });

/**
 * Uploader ét billedfil til backend og returnerer den offentlige URL.
 * @param {File} file - Fil-objektet fra <input type="file">
 * @returns {Promise<string>} - URL til det uploadede billede
 */
export const uploadImage = async (file) => {
    // Lokal fallback er standard, da backend ofte ikke har /upload-route i dette setup.
    if (!ENABLE_SERVER_UPLOAD) {
        return fileToDataUrl(file);
    }

    const fd = new FormData();
    fd.append('image', file);
    let res;
    try {
        res = await fetch(`${BASE_URL}/upload`, { method: 'POST', body: fd });
    } catch {
        // Fallback hvis backend ikke er tilgængelig for upload.
        return fileToDataUrl(file);
    }

    // Fallback når backend ikke implementerer /upload.
    if (res.status === 404 || res.status === 405) {
        return fileToDataUrl(file);
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Upload fejlede');
    }

    const data = await res.json();

    // Hvis backend svarer uden URL, brug lokal data-URL.
    if (!data?.url) {
        return fileToDataUrl(file);
    }

    return data.url;
};
