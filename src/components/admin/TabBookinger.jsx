// src/components/admin/TabBookinger.jsx
// ─────────────────────────────────────────────────────────
// Backoffice-fanen til visning og håndtering af bookinger.
// Gæster indsender bookinger via opholdsdetaljersiden.
// Admin kan opdatere status og slette bookinger.
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { getAdminBookings, updateBookingStatus, deleteBooking } from '../../services/bookingService';
import styles from '../../pages/Backoffice.module.css';

const STATUS_LABELS = {
    ny: { label: 'Ny', color: '#1d4ed8', bg: '#dbeafe' },
    bekræftet: { label: 'Bekræftet', color: '#15803d', bg: '#dcfce7' },
    aflyst: { label: 'Aflyst', color: '#991b1b', bg: '#fee2e2' },
};

const StatusBadge = ({ status }) => {
    const s = STATUS_LABELS[status] || STATUS_LABELS['ny'];
    return (
        <span style={{
            display: 'inline-block',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: s.color,
            background: s.bg,
            border: `1px solid ${s.color}33`,
        }}>
            {s.label}
        </span>
    );
};

const TabBookinger = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => { loadBookings(); }, []);

    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(null), 3000);
        return () => clearTimeout(t);
    }, [success]);

    const loadBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminBookings();
            setBookings(Array.isArray(data) ? data : []);
        } catch {
            setError('Kunne ikke hente bookinger. Er backend-serveren kørende på port 3042?');
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (booking, newStatus) => {
        try {
            await updateBookingStatus(booking.id, newStatus);
            setSuccess(`Booking opdateret til "${STATUS_LABELS[newStatus]?.label ?? newStatus}".`);
            loadBookings();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (booking) => {
        if (!window.confirm(`Er du sikker på at du vil slette bookingen fra "${booking.name}"?`)) return;
        try {
            await deleteBooking(booking.id);
            setSuccess('Booking slettet!');
            loadBookings();
        } catch (err) {
            setError(err.message);
        }
    };

    const formatDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('da-DK', {
            day: '2-digit', month: '2-digit', year: 'numeric',
        });
    };

    const formatDateTime = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('da-DK', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const nyCount = bookings.filter(b => b.status === 'ny' || !b.status).length;

    return (
        <div>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.successMsg}>{success}</p>}

            <section className={styles.tableSection}>
                <h2>
                    Bookinger ({bookings.length})
                    {nyCount > 0 && (
                        <span style={{
                            marginLeft: '0.6rem',
                            background: '#2563eb',
                            color: '#fff',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.55rem',
                            borderRadius: '999px',
                        }}>
                            {nyCount} ny
                        </span>
                    )}
                </h2>

                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>
                    Bookinger sendes af gæster via opholdssiderne og gemmes herinde.
                </p>

                {loading && <p className={styles.loading}>Henter bookinger...</p>}

                {!loading && bookings.length === 0 && (
                    <p className={styles.empty}>
                        Ingen bookinger endnu. Bookinger vises her når gæster bruger bookingformularen.
                    </p>
                )}

                {!loading && bookings.length > 0 && (
                    <div className={styles.bookingCards}>
                        {bookings.map((b) => {
                            const status = b.status || 'ny';
                            const borderColor = status === 'bekræftet' ? '#22c55e' : status === 'aflyst' ? '#ef4444' : '#3b82f6';
                            return (
                                <div key={b.id} className={styles.bookingCard} style={{ borderLeftColor: borderColor }}>
                                    <div className={styles.bookingCardTop}>
                                        <div className={styles.bookingCardInfo}>
                                            <span className={styles.bookingCardName}>{b.name}</span>
                                            <a href={`mailto:${b.email}`} className={styles.bookingCardEmail}>
                                                {b.email}
                                            </a>
                                        </div>
                                        <div className={styles.bookingCardRight}>
                                            <StatusBadge status={status} />
                                            <span className={styles.bookingCardDate}>
                                                {formatDateTime(b.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.bookingCardStayRow}>
                                        <span className={styles.bookingCardStayLabel}>Ophold</span>
                                        <span className={styles.bookingCardStayName}>{b.stayTitle || b.stayId || '—'}</span>
                                    </div>

                                    <div className={styles.bookingCardChips}>
                                        <span className={styles.bookingChip}>
                                            <span className={styles.bookingChipLabel}>Check-in</span>
                                            <span className={styles.bookingChipValue}>{formatDate(b.checkIn)}</span>
                                        </span>
                                        <span className={styles.bookingChip}>
                                            <span className={styles.bookingChipLabel}>Check-ud</span>
                                            <span className={styles.bookingChipValue}>{formatDate(b.checkOut)}</span>
                                        </span>
                                        <span className={styles.bookingChip}>
                                            <span className={styles.bookingChipLabel}>Gæster</span>
                                            <span className={styles.bookingChipValue}>{b.guests ?? 1}</span>
                                        </span>
                                    </div>

                                    {b.message && (
                                        <p className={styles.bookingCardMessage}>
                                            &ldquo;{b.message}&rdquo;
                                        </p>
                                    )}

                                    <div className={styles.bookingCardActions}>
                                        {(status === 'ny') && (
                                            <button
                                                onClick={() => handleStatus(b, 'bekræftet')}
                                                className={styles.bookingBtnConfirm}
                                            >
                                                ✓ Bekræft
                                            </button>
                                        )}
                                        {status !== 'aflyst' && (
                                            <button
                                                onClick={() => handleStatus(b, 'aflyst')}
                                                className={styles.bookingBtnCancel}
                                            >
                                                ✕ Aflys
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(b)} className={styles.bookingBtnDelete}>
                                            Slet
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default TabBookinger;
