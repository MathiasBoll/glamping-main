// src/components/admin/TabOphold.jsx
// ─────────────────────────────────────────────────────────
// Backoffice-fanen til styring af ophold (Vis, Tilføj, Rediger, Slet).
// Felter: title, teaser, numberOfPersons, price, image
// ─────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';
import {
    getAdminStays,
    createStay,
    updateStay,
    deleteStay,
    toggleStayActive,
} from '../../services/stayAdminService';
import { uploadImage } from '../../services/uploadService';
import styles from '../../pages/Backoffice.module.css';

const EMPTY_FORM = { title: '', teaser: '', numberOfPersons: '', price: '', image: '' };

const TabOphold = () => {
    const [stays, setStays] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => { loadStays(); }, []);

    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(null), 3000);
        return () => clearTimeout(t);
    }, [success]);

    const loadStays = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminStays();
            const normalized = (Array.isArray(data) ? data : data.data ?? []).map(s => ({
                ...s,
                _id: s.id || s._id,
            }));
            setStays(normalized);
        } catch {
            setError('Kunne ikke hente ophold. Er backend-serveren kørende på port 3042?');
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
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleEditClick = (stay) => {
        setEditing(stay);
        setForm({
            title: stay.title || '',
            teaser: stay.teaser || '',
            numberOfPersons: stay.numberOfPersons || '',
            price: stay.price || '',
            image: stay.image || '',
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
                await updateStay(editing._id || editing.id, form);
                setSuccess('Ophold opdateret!');
                setEditing(null);
            } else {
                await createStay(form);
                setSuccess('Ophold oprettet!');
            }
            setForm(EMPTY_FORM);
            loadStays();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (stay) => {
        if (!window.confirm(`Er du sikker på at du vil slette "${stay.title}"?`)) return;
        try {
            await deleteStay(stay._id || stay.id);
            setSuccess('Ophold slettet!');
            loadStays();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleActive = async (stay) => {
        const newValue = stay.isActive === false ? true : false;
        try {
            await toggleStayActive(stay._id || stay.id, newValue);
            setSuccess(newValue ? `"${stay.title}" er nu synlig.` : `"${stay.title}" er nu skjult.`);
            loadStays();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.successMsg}>{success}</p>}

            <section className={styles.formSection}>
                <h2>{editing ? 'Rediger ophold' : 'Tilføj ophold'}</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input name="title" placeholder="Titel *" value={form.title} onChange={handleChange} required />
                    <input name="teaser" placeholder="Kort beskrivelse (teaser)" value={form.teaser} onChange={handleChange} />
                    <input name="numberOfPersons" placeholder="Antal personer * (fx 2)" value={form.numberOfPersons} onChange={handleChange} required />
                    <input name="price" placeholder="Pris * (fx 4200)" type="number" min="0" value={form.price} onChange={handleChange} required />
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
                            {editing ? 'Gem ændringer' : 'Tilføj ophold'}
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
                <h2>Ophold ({stays.length})</h2>
                {loading && <p className={styles.loading}>Henter ophold...</p>}
                {!loading && stays.length === 0 && <p className={styles.empty}>Ingen ophold fundet.</p>}
                {!loading && stays.length > 0 && (
                    <div className={styles.adminCards}>
                        {stays.map((stay) => (
                            <div
                                key={stay._id || stay.id}
                                className={`${styles.adminCard} ${stay.isActive === false ? styles.adminCardHidden : ''}`}
                            >
                                <div className={styles.adminCardRow}>
                                    {stay.image && (
                                        <img src={stay.image} alt={stay.title} className={styles.adminCardImg} />
                                    )}
                                    <div className={styles.adminCardBody}>
                                        <div className={styles.adminCardTop}>
                                            <span className={styles.adminCardName}>{stay.title}</span>
                                            <span className={stay.isActive === false ? styles.adminBadgeHidden : styles.adminBadgeVisible}>
                                                {stay.isActive === false ? 'Skjult' : 'Synlig'}
                                            </span>
                                        </div>
                                        <div className={styles.adminCardChips}>
                                            <span className={styles.adminChip}>
                                                <span className={styles.adminChipLabel}>Personer</span>
                                                <span className={styles.adminChipValue}>{stay.numberOfPersons}</span>
                                            </span>
                                            <span className={styles.adminChip}>
                                                <span className={styles.adminChipLabel}>Pris</span>
                                                <span className={styles.adminChipValue}>{stay.price} kr.</span>
                                            </span>
                                        </div>
                                        <div className={styles.adminCardActions}>
                                            <button
                                                onClick={() => handleToggleActive(stay)}
                                                className={stay.isActive === false ? styles.adminBtnShow : styles.adminBtnHide}
                                            >
                                                {stay.isActive === false ? 'Vis' : 'Skjul'}
                                            </button>
                                            <button onClick={() => handleEditClick(stay)} className={styles.adminBtnEdit}>Rediger</button>
                                            <button onClick={() => handleDelete(stay)} className={styles.adminBtnDanger}>Slet</button>
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

export default TabOphold;
