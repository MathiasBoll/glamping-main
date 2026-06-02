// src/components/admin/TabOphold.jsx
// ─────────────────────────────────────────────────────────
// Backoffice-fanen til styring af ophold (Vis, Tilføj, Rediger, Slet).
// Felter: title, teaser, numberOfPersons, price, image
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import {
    getAdminStays,
    createStay,
    updateStay,
    deleteStay,
    toggleStayActive,
} from '../../services/stayAdminService';
import styles from '../../pages/Backoffice.module.css';

const EMPTY_FORM = { title: '', teaser: '', numberOfPersons: '', price: '', image: '' };

const TabOphold = () => {
    const [stays, setStays] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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
                    <input name="image" placeholder="Billed-URL *" value={form.image} onChange={handleChange} required />
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
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Billede</th>
                                <th>Titel</th>
                                <th>Personer</th>
                                <th>Pris</th>
                                <th>Synlig</th>
                                <th>Handlinger</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stays.map((stay) => (
                                <tr key={stay._id || stay.id} style={stay.isActive === false ? { opacity: 0.5 } : {}}>
                                    <td>
                                        <img src={stay.image} alt={stay.title} className={styles.thumbnail} />
                                    </td>
                                    <td>{stay.title}</td>
                                    <td>{stay.numberOfPersons}</td>
                                    <td>{stay.price} kr.</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.2rem 0.55rem',
                                            borderRadius: '999px',
                                            fontSize: '0.78rem',
                                            fontWeight: 600,
                                            background: stay.isActive === false ? '#f3f4f6' : '#dcfce7',
                                            color: stay.isActive === false ? '#6b7280' : '#15803d',
                                        }}>
                                            {stay.isActive === false ? 'Skjult' : 'Synlig'}
                                        </span>
                                    </td>
                                    <td className={styles.actions}>
                                        <button onClick={() => handleToggleActive(stay)} className={styles.btnEdit}
                                            style={stay.isActive === false
                                                ? { background: '#f0fdf4', color: '#15803d', borderColor: '#86efac' }
                                                : { background: '#fefce8', color: '#92400e', borderColor: '#fde68a' }
                                            }>
                                            {stay.isActive === false ? 'Vis' : 'Skjul'}
                                        </button>
                                        <button onClick={() => handleEditClick(stay)} className={styles.btnEdit}>Rediger</button>
                                        <button onClick={() => handleDelete(stay)} className={styles.btnDelete}>Slet</button>
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

export default TabOphold;
