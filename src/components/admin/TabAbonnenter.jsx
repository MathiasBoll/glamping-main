import { useEffect, useState } from 'react';
import { getAdminSubscribers, deleteSubscriber, updateSubscriber } from '../../services/subscriberAdminService';
import styles from '../../pages/Backoffice.module.css';

const TabAbonnenter = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editEmail, setEditEmail] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => { loadSubscribers(page); }, [page]);

    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(null), 3000);
        return () => clearTimeout(t);
    }, [success]);

    const loadSubscribers = async (p = 1) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAdminSubscribers(p);
            setSubscribers(result.data || []);
            setTotalPages(result.totalPages || 1);
            setTotal(result.total || 0);
        } catch {
            setError('Kunne ikke hente abonnenter. Er backend-serveren koerende paa port 3042?');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (sub) => {
        if (!window.confirm('Er du sikker paa at du vil fjerne "' + sub.email + '" fra listen?')) return;
        try {
            await deleteSubscriber(sub.id);
            setSuccess('Abonnent fjernet!');
            loadSubscribers(page);
        } catch (err) {
            setError(err.message);
        }
    };

    const startEdit = (sub) => {
        setEditingId(sub.id);
        setEditEmail(sub.email);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditEmail('');
    };

    const handleSaveEdit = async (sub) => {
        if (!editEmail.trim() || !editEmail.includes('@')) {
            setError('Indtast en gyldig e-mail');
            return;
        }
        try {
            await updateSubscriber(sub.id, editEmail.trim());
            setSuccess('E-mail opdateret!');
            setEditingId(null);
            loadSubscribers(page);
        } catch (err) {
            setError(err.message);
        }
    };

    const formatDate = (iso) => {
        if (!iso) return '-';
        return new Date(iso).toLocaleDateString('da-DK', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.successMsg}>{success}</p>}

            <section className={styles.tableSection}>
                <h2>Nyhedsbrev-abonnenter ({total})</h2>

                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>
                    Besogende kan tilmelde sig nyhedsbrevet via footeren paa hjemmesiden.
                </p>

                {loading && <p className={styles.loading}>Henter abonnenter...</p>}

                {!loading && total === 0 && (
                    <p className={styles.empty}>
                        Ingen abonnenter endnu. E-mails vises her naar besogende tilmelder sig nyhedsbrevet.
                    </p>
                )}

                {!loading && subscribers.length > 0 && (
                    <div className={styles.adminCards}>
                        {subscribers.map((sub) => (
                            <div key={sub.id} className={styles.adminCard}>
                                <div className={styles.adminSubRow}>
                                    <div className={styles.adminCardInfo}>
                                        {editingId === sub.id ? (
                                            <input
                                                type="text"
                                                inputMode="email"
                                                autoComplete="email"
                                                value={editEmail}
                                                onChange={e => setEditEmail(e.target.value)}
                                                className={styles.adminInlineInput}
                                                autoFocus
                                            />
                                        ) : (
                                            <a href={'mailto:' + sub.email} className={styles.adminCardEmail} style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                                                {sub.email}
                                            </a>
                                        )}
                                        <span className={styles.adminCardDate}>Tilmeldt {formatDate(sub.subscribedAt)}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.45rem', flexShrink: 0 }}>
                                        {editingId === sub.id ? (
                                            <>
                                                <button onClick={() => handleSaveEdit(sub)} className={styles.adminBtnSave}>Gem</button>
                                                <button onClick={cancelEdit} className={styles.adminBtnCancel}>Annuller</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEdit(sub)} className={styles.adminBtnEdit}>Rediger</button>
                                                <button onClick={() => handleDelete(sub)} className={styles.adminBtnDanger}>Fjern</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.btnEdit}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                        >
                            Forrige
                        </button>
                        <span className={styles.pageInfo}>Side {page} af {totalPages}</span>
                        <button
                            className={styles.btnEdit}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || loading}
                        >
                            Naeste
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default TabAbonnenter;