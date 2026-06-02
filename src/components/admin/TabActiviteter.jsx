// src/components/admin/TabActiviteter.jsx
// ─────────────────────────────────────────────────────────
// Backoffice-fanen til styring af aktiviteter (Vis, Tilføj, Rediger, Slet).
// ─────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';
import {
    getAdminActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    toggleActivityActive,
} from '../../services/activityAdminService';
import { uploadImage } from '../../services/uploadService';
import styles from '../../pages/Backoffice.module.css';

const EMPTY_FORM = { title: '', date: '', time: '', description: '', image: '' };

const TabActiviteter = () => {
    const [activities, setActivities] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

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

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            const url = await uploadImage(file);
            setForm(prev => ({ ...prev, image: url }));
        } catch (err) {
            setError('Billedet kunne ikke uploades: ' + err.message);
        } finally {
            setUploading(false);
            // Nulstil input så samme fil kan vælges igen
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
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
                    <div className={styles.imageField}>
                        <input
                            name="image"
                            placeholder="Billed-URL (indsæt link, eller upload herunder)"
                            value={form.image}
                            onChange={handleChange}
                        />
                        <label className={styles.fileInputBtn}>
                            📷 Vælg billede fra enhed / kamerarulle
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                        {uploading && <span className={styles.uploadingText}>Uploader...</span>}
                        {form.image && !uploading && (
                            <img src={form.image} alt="Forhåndsvisning" className={styles.imagePreview} />
                        )}
                    </div>
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
                    <div className={styles.adminCards}>
                        {activities.map((activity) => (
                            <div
                                key={activity._id || activity.id}
                                className={`${styles.adminCard} ${activity.isActive === false ? styles.adminCardHidden : ''}`}
                            >
                                <div className={styles.adminCardRow}>
                                    {activity.image && (
                                        <img src={activity.image} alt={activity.title} className={styles.adminCardImg} />
                                    )}
                                    <div className={styles.adminCardBody}>
                                        <div className={styles.adminCardTop}>
                                            <span className={styles.adminCardName}>{activity.title}</span>
                                            <span className={activity.isActive === false ? styles.adminBadgeHidden : styles.adminBadgeVisible}>
                                                {activity.isActive === false ? 'Skjult' : 'Synlig'}
                                            </span>
                                        </div>
                                        <div className={styles.adminCardChips}>
                                            <span className={styles.adminChip}>
                                                <span className={styles.adminChipLabel}>Dato</span>
                                                <span className={styles.adminChipValue}>{activity.date}</span>
                                            </span>
                                            <span className={styles.adminChip}>
                                                <span className={styles.adminChipLabel}>Tid</span>
                                                <span className={styles.adminChipValue}>{activity.time}</span>
                                            </span>
                                        </div>
                                        <div className={styles.adminCardActions}>
                                            <button
                                                onClick={() => handleToggleActive(activity)}
                                                className={activity.isActive === false ? styles.adminBtnShow : styles.adminBtnHide}
                                            >
                                                {activity.isActive === false ? 'Vis' : 'Skjul'}
                                            </button>
                                            <button onClick={() => handleEditClick(activity)} className={styles.adminBtnEdit}>Rediger</button>
                                            <button onClick={() => handleDelete(activity)} className={styles.adminBtnDanger}>Slet</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default TabActiviteter;
