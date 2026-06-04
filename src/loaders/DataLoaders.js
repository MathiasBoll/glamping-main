// src/loaders/DataLoaders.js
// ─────────────────────────────────────────────────────────────────────────────
// React Router loader-funktioner.
// Disse kører PÅ FORHÅND når React Router navigerer til en rute.
// Data er klar til komponenten — ingen loading-spinner nødvendig.
// Brug useLoaderData() i komponenten for at hente det præ-hentede data.
// ─────────────────────────────────────────────────────────────────────────────

const localApiUrl = "http://localhost:3042";

// ── Aktiviteter ───────────────────────────────────────────────────────────────
// Bruges på /activities-ruten
export const activitiesLoader = async () => {
    const res = await fetch(`${localApiUrl}/activities`);
    if (!res.ok) throw new Error("Aktiviteter kunne ikke hentes");
    const json = await res.json();
    const list = json?.data ?? json ?? [];
    // Filtrer skjulte aktiviteter fra
    return list.filter((a) => a.isActive !== false);
};

// ── Ophold ────────────────────────────────────────────────────────────────────
// Bruges på /stays-ruten
export const staysLoader = async () => {
    const res = await fetch(`${localApiUrl}/stays`);
    if (!res.ok) throw new Error("Ophold kunne ikke hentes");
    const json = await res.json();
    const list = json?.data ?? json ?? [];
    // Filtrer skjulte ophold fra
    return list.filter((s) => s.isActive !== false);
};

// ── Anmeldelser ───────────────────────────────────────────────────────────────
// Bruges på /-ruten (forsiden)
export const reviewsLoader = async () => {
    const res = await fetch(`${localApiUrl}/reviews`);
    if (!res.ok) throw new Error("Anmeldelser kunne ikke hentes");
    const json = await res.json();
    return json?.data ?? json ?? [];
};

// ── Enkelt ophold ─────────────────────────────────────────────────────────────
// Bruges på /stay/:id-ruten — params.id kommer fra URL'en
export const stayDetailsLoader = async ({ params }) => {
    const res = await fetch(`${localApiUrl}/stays/${params.id}`);
    if (!res.ok) throw new Error("Ophold ikke fundet");
    return res.json();
};

// ── Enkelt aktivitet ──────────────────────────────────────────────────────────
// Bruges på /activity/:id-ruten
// Henter alle aktiviteter og finder den rigtige via _id
export const activityDetailsLoader = async ({ params }) => {
    const res = await fetch(`${localApiUrl}/activities`);
    if (!res.ok) throw new Error("Aktiviteter kunne ikke hentes");
    const json = await res.json();
    const list = json?.data ?? json ?? [];
    const found = list.find((a) => a._id === params.id);
    if (!found) throw new Response("Aktivitet ikke fundet", { status: 404 });
    return found;
};

// ── Backoffice ────────────────────────────────────────────────────────────────
// Bruges på /backoffice-ruten
// Promise.all henter aktiviteter, ophold og anmeldelser PARALLELT
export const backofficeLoader = async () => {
    const [activitiesRes, staysRes, reviewsRes] = await Promise.all([
        fetch(`${localApiUrl}/activities`),
        fetch(`${localApiUrl}/stays`),
        fetch(`${localApiUrl}/reviews`),
    ]);

    const activitiesJson = await activitiesRes.json();
    const staysJson = await staysRes.json();
    const reviewsJson = await reviewsRes.json();

    return {
        activities: activitiesJson?.data ?? activitiesJson ?? [],
        stays: staysJson?.data ?? staysJson ?? [],
        reviews: reviewsJson?.data ?? reviewsJson ?? [],
    };
};
