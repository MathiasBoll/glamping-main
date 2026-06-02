// src/components/admin/TabActiviteter.jsx
// ─────────────────────────────────────────────────────────
// Backoffice-fanen til styring af aktiviteter (Vis, Tilføj, Rediger, Slet).
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import {
    getAdminActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    toggleActivityActive,
} from '../../services/activityAdminService';
import styles from '../../pages/Backoffice.module.css';

const EMPTY_FORM = { title: '', date: '', time: '', description: '', image: '' };

const TabActiviteter = () => {
    const [activities, setActivities] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => { loadActivities(); }, []);

    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(null), 3000);
        return () => clearTimeout(t);
    }, [success]);

    const loadActivities = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminActivities();
            const normalized = (Array.isArray(data) ? data : data.data ?? []).map(a => ({
                ...a,
                _id: a.id || a._id,
            }));
            setActivities(normalized);
        } catch {
            setError('Kunne ikke hente aktiviteter. Er backend-serveren kørende på port 3042?');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEditClick = (activity) => {
        setEditing(activity);
        setForm({
            title: activity.title || '',
            date: activity.date || '',
            time: activity.time || '',
            description: activity.description || '',
            image: activity.image || '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (editing) {
                await updateActivity(editing._id || editing.id, form);
                setSuccess('Aktivitet opdateret!');
                setEditing(null);
            } else {
                await createActivity(form);
                setSuccess('Aktivitet oprettet!');
            }
            setForm(EMPTY_FORM);
            loadActivities();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (activity) => {
        if (!window.confirm(`Er du sikker på at du vil slette "${activity.title}"?`)) return;
        try {
            await deleteActivity(activity._id || activity.id);
            setSuccess('Aktivitet slettet!');
            loadActivities();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleActive = async (activity) => {
        const newValue = activity.isActive === false ? true : false;
        try {
            await toggleActivityActive(activity._id || activity.id, newValue);
            setSuccess(newValue ? `"${activity.title}" er nu synlig.` : `"${activity.title}" er nu skjult.`);
            loadActivities();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.successMsg}>{success}</p>}

            <section className={styles.formSection}>
                <h2>{editing ? 'Rediger aktivitet' : 'Tilføj aktivitet'}</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input name="title" placeholder="Titel *" value={form.title} onChange={handleChange} required />
                    <input name="date" placeholder="Dato (fx Fredage og lørdage) *" value={form.date} onChange={handleChange} required />
                    <input name="time" placeholder="Tidspunkt (fx 15.00-17.00) *" value={form.time} onChange={handleChange} required />
                    <textarea name="description" placeholder="Beskrivelse *" value={form.description} onChange={handleChange} required rows={4} />
                    <input name="image" placeholder="Billed-URL *" value={form.image} onChange={handleChange} required />
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

            <section className={styles.tableSection}>
                <h2>Aktiviteter ({activities.length})</h2>
                {loading && <p className={styles.loading}>Henter aktiviteter...</p>}
                {!loading && activities.length === 0 && <p className={styles.empty}>Ingen aktiviteter fundet.</p>}
                {!loading && activities.length > 0 && (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Billede</th>
                                <th>Titel</th>
                                <th>Dato</th>
                                <th>Tidspunkt</th>
                                <th>Synlig</th>
                                <th>Handlinger</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map((activity) => (
                                <tr key={activity._id || activity.id} style={activity.isActive === false ? { opacity: 0.5 } : {}}>
                                    <td>
                                        <img src={activity.image} alt={activity.title} className={styles.thumbnail} />
                                    </td>
                                    <td>{activity.title}</td>
                                    <td>{activity.date}</td>
                                    <td>{activity.time}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.2rem 0.55rem',
                                            borderRadius: '999px',
                                            fontSize: '0.78rem',
                                            fontWeight: 600,
                                            background: activity.isActive === false ? '#f3f4f6' : '#dcfce7',
                                            color: activity.isActive === false ? '#6b7280' : '#15803d',
                                        }}>
                                            {activity.isActive === false ? 'Skjult' : 'Synlig'}
                                        </span>
                                    </td>
                                    <td className={styles.actions}>
                                        <button onClick={() => handleToggleActive(activity)} className={styles.btnEdit}
                                            style={activity.isActive === false
                                                ? { background: '#f0fdf4', color: '#15803d', borderColor: '#86efac' }
                                                : { background: '#fefce8', color: '#92400e', borderColor: '#fde68a' }
                                            }>
                                            {activity.isActive === false ? 'Vis' : 'Skjul'}
                                        </button>
                                        <button onClick={() => handleEditClick(activity)} className={styles.btnEdit}>Rediger</button>
                                        <button onClick={() => handleDelete(activity)} className={styles.btnDelete}>Slet</button>
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

export default TabActiviteter;
