// src/pages/Backoffice.jsx
// ─────────────────────────────────────────────────────────
// Backoffice-dashboard til styring af aktiviteter.
// Understøtter: Vis, Tilføj, Rediger og Slet.
// Kommunikerer med lokal Express-backend på port 3042.
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
    getAdminActivities,
    createActivity,
    updateActivity,
    deleteActivity,
} from '../services/activityAdminService';
import styles from './Backoffice.module.css';

// Tomt formular-objekt — bruges til at nulstille formen
const EMPTY_FORM = { title: '', date: '', time: '', description: '', image: '' };

const Backoffice = () => {
    // Liste af aktiviteter fra backend
    const [activities, setActivities] = useState([]);

    // Den aktivitet der pt. redigeres (null = ingen redigering)
    const [editing, setEditing] = useState(null);

    // Formulardata (bruges både til opret og rediger)
    const [form, setForm] = useState(EMPTY_FORM);

    // UI-states: loading, fejl og succesbesked
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Hent aktiviteter fra backend når siden loader
    useEffect(() => {
        loadActivities();
    }, []);

    // Ryd succesbesked automatisk efter 3 sekunder
    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(null), 3000);
        return () => clearTimeout(t);
    }, [success]);

    // ── Hent alle aktiviteter fra backend ──
    const loadActivities = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminActivities();
            // Normaliser id så både .id og ._id virker i eksisterende komponenter
            const normalized = (Array.isArray(data) ? data : data.data ?? []).map(a => ({
                ...a,
                _id: a.id || a._id,
            }));
            setActivities(normalized);
        } catch (err) {
            setError('Kunne ikke hente aktiviteter. Er backend-serveren kørende på port 3042?');
        } finally {
            setLoading(false);
        }
    };

    // ── Opdater formularfelt ved input ──
    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // ── Klik på "Rediger" knap ──
    const handleEditClick = (activity) => {
        setEditing(activity);
        setForm({
            title: activity.title || '',
            date: activity.date || '',
            time: activity.time || '',
            description: activity.description || '',
            image: activity.image || '',
        });
        // Scroll op til formularen
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── Annuller redigering ──
    const handleCancel = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
    };

    // ── Indsend formular (opret eller opdater) ──
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (editing) {
                // Opdater eksisterende aktivitet
                await updateActivity(editing._id || editing.id, form);
                setSuccess('Aktivitet opdateret!');
                setEditing(null);
            } else {
                // Opret ny aktivitet
                await createActivity(form);
                setSuccess('Aktivitet oprettet!');
            }
            setForm(EMPTY_FORM);
            loadActivities(); // Genindlæs listen
        } catch (err) {
            setError(err.message);
        }
    };

    // ── Slet aktivitet med bekræftelse ──
    const handleDelete = async (activity) => {
        const confirmed = window.confirm(
            `Er du sikker på at du vil slette "${activity.title}"?`
        );
        if (!confirmed) return;
        try {
            await deleteActivity(activity._id || activity.id);
            setSuccess('Aktivitet slettet!');
            loadActivities();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.page}>

            {/* ── Header ── */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Backoffice</h1>
                    {/* Badge der minder om at login kommer senere */}
                    <span className={styles.badge}>Backoffice eksempel — login kommer senere</span>
                </div>
                <div className={styles.headerActions}>
                    <Link to="/" className={styles.backLink}>← Tilbage til frontend</Link>
                    <button className={styles.btnDisabled} disabled>Rediger subscribers</button>
                </div>
            </div>

            {/* ── Feedback-beskeder ── */}
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.successMsg}>{success}</p>}

            {/* ── Formular: Tilføj eller Rediger aktivitet ── */}
            <section className={styles.formSection}>
                <h2>{editing ? 'Rediger aktivitet' : 'Tilføj aktivitet'}</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        name="title"
                        placeholder="Titel *"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="date"
                        placeholder="Dato (fx Fredage og lørdage) *"
                        value={form.date}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="time"
                        placeholder="Tidspunkt (fx 15.00-17.00) *"
                        value={form.time}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Beskrivelse *"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={4}
                    />
                    <input
                        name="image"
                        placeholder="Billed-URL *"
                        value={form.image}
                        onChange={handleChange}
                        required
                    />
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.btnPrimary}>
                            {editing ? 'Gem ændringer' : 'Tilføj aktivitet'}
                        </button>
                        {editing && (
                            <button type="button" onClick={handleCancel} className={styles.btnSecondary}>
                                Annuller
                            </button>
                        )}
                    </div>
                </form>
            </section>

            {/* ── Aktivitetstabel ── */}
            <section className={styles.tableSection}>
                <h2>Aktiviteter</h2>

                {loading && <p className={styles.loading}>Henter aktiviteter...</p>}

                {!loading && activities.length === 0 && (
                    <p className={styles.empty}>Ingen aktiviteter fundet.</p>
                )}

                {!loading && activities.length > 0 && (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Billede</th>
                                <th>Titel</th>
                                <th>Dato</th>
                                <th>Tidspunkt</th>
                                <th>Handlinger</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map((activity) => (
                                <tr key={activity._id || activity.id}>
                                    <td>
                                        <img
                                            src={activity.image}
                                            alt={activity.title}
                                            className={styles.thumbnail}
                                        />
                                    </td>
                                    <td>{activity.title}</td>
                                    <td>{activity.date}</td>
                                    <td>{activity.time}</td>
                                    <td className={styles.actions}>
                                        <button
                                            onClick={() => handleEditClick(activity)}
                                            className={styles.btnEdit}
                                        >
                                            Rediger
                                        </button>
                                        <button
                                            onClick={() => handleDelete(activity)}
                                            className={styles.btnDelete}
                                        >
                                            Slet
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};

export default Backoffice;
