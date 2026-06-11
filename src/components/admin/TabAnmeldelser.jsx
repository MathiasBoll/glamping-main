// src/components/admin/TabAnmeldelser.jsx
// ─────────────────────────────────────────────────────────
// Backoffice-fanen til styring af anmeldelser (Vis, Tilføj, Rediger, Slet).
// Felter: name, age, stay, review
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import {
    getAdminReviews,
    createReview,
    updateReview,
    deleteReview,
} from '../../services/reviewAdminService';
import styles from '../../pages/Backoffice.module.css';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const EMPTY_FORM = { name: '', age: '', stay: '', review: '' };

const TabAnmeldelser = () => {
    const [reviews, setReviews] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadReviews(); }, []);

    const loadReviews = async () => {
        setLoading(true);
        try {
            const data = await getAdminReviews();
            const normalized = (Array.isArray(data) ? data : data.data ?? []).map(r => ({
                ...r,
                _id: r.id || r._id,
            }));
            setReviews(normalized);
        } catch {
            toast.error('Kunne ikke hente anmeldelser. Er backend-serveren kørende på port 3042?');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEditClick = (review) => {
        setEditing(review);
        setForm({
            name: review.name || '',
            age: review.age || '',
            stay: review.stay || '',
            review: review.review || '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await updateReview(editing._id || editing.id, form);
                toast.success('Anmeldelse opdateret!');
                setEditing(null);
            } else {
                await createReview(form);
                toast.success('Anmeldelse oprettet!');
            }
            setForm(EMPTY_FORM);
            loadReviews();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (review) => {
        const result = await Swal.fire({
            title: `Slet anmeldelsen fra "${review.name}"?`,
            text: 'Denne handling kan ikke fortrydes.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ja, slet den!',
            cancelButtonText: 'Annuller',
        });
        if (!result.isConfirmed) return;
        try {
            await deleteReview(review._id || review.id);
            toast.success('Anmeldelse slettet!');
            loadReviews();
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div>
            <section className={styles.formSection}>
                <h2>{editing ? 'Rediger anmeldelse' : 'Tilføj anmeldelse'}</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input name="name" placeholder="Navn på gæst *" value={form.name} onChange={handleChange} required />
                    <input name="age" placeholder="Alder (fx 34)" type="number" min="0" max="120" value={form.age} onChange={handleChange} />
                    <input name="stay" placeholder="Opholdsnavn (fx Weekendtur)" value={form.stay} onChange={handleChange} />
                    <textarea name="review" placeholder="Anmeldelsestekst *" value={form.review} onChange={handleChange} required rows={4} />
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.btnPrimary}>
                            {editing ? 'Gem ændringer' : 'Tilføj anmeldelse'}
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
                <h2>Anmeldelser ({reviews.length})</h2>
                {loading && <p className={styles.loading}>Henter anmeldelser...</p>}
                {!loading && reviews.length === 0 && <p className={styles.empty}>Ingen anmeldelser fundet.</p>}
                {!loading && reviews.length > 0 && (
                    <div className={styles.adminCards}>
                        {reviews.map((review) => (
                            <div key={review._id || review.id} className={styles.adminCard}>
                                <div className={styles.adminCardTop}>
                                    <span className={styles.adminCardName}>{review.name}</span>
                                </div>
                                {(review.age || review.stay) && (
                                    <div className={styles.adminCardChips}>
                                        {review.age && (
                                            <span className={styles.adminChip}>
                                                <span className={styles.adminChipLabel}>Alder</span>
                                                <span className={styles.adminChipValue}>{review.age}</span>
                                            </span>
                                        )}
                                        {review.stay && (
                                            <span className={styles.adminChip}>
                                                <span className={styles.adminChipLabel}>Ophold</span>
                                                <span className={styles.adminChipValue}>{review.stay}</span>
                                            </span>
                                        )}
                                    </div>
                                )}
                                <p className={styles.adminCardQuote}>&ldquo;{review.review}&rdquo;</p>
                                <div className={styles.adminCardActions}>
                                    <button onClick={() => handleEditClick(review)} className={styles.adminBtnEdit}>Rediger</button>
                                    <button onClick={() => handleDelete(review)} className={styles.adminBtnDanger}>Slet</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default TabAnmeldelser;
