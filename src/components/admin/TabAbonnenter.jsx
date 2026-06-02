// src/components/admin/TabAbonnenter.jsx
// ─────────────────────────────────────────────────────────
// Backoffice-fanen til visning og styring af nyhedsbrev-abonnenter.
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { getAdminSubscribers, deleteSubscriber } from '../../services/subscriberAdminService';
import styles from '../../pages/Backoffice.module.css';

const TabAbonnenter = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => { loadSubscribers(); }, []);

    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(null), 3000);
        return () => clearTimeout(t);
    }, [success]);

    const loadSubscribers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminSubscribers();
            setSubscribers(Array.isArray(data) ? data : []);
        } catch {
            setError('Kunne ikke hente abonnenter. Er backend-serveren kørende på port 3042?');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (sub) => {
        if (!window.confirm(`Er du sikker på at du vil fjerne "${sub.email}" fra listen?`)) return;
        try {
            await deleteSubscriber(sub.id);
            setSuccess('Abonnent fjernet!');
            loadSubscribers();
        } catch (err) {
            setError(err.message);
        }
    };

    const formatDate = (iso) => {
        if (!iso) return '—';
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
                <h2>Nyhedsbrev-abonnenter ({subscribers.length})</h2>

                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>
                    Besøgende kan tilmelde sig nyhedsbrevet via footeren på hjemmesiden.
                </p>

                {loading && <p className={styles.loading}>Henter abonnenter...</p>}

                {!loading && subscribers.length === 0 && (
                    <p className={styles.empty}>
                        Ingen abonnenter endnu. E-mails vises her når besøgende tilmelder sig nyhedsbrevet.
                    </p>
                )}

                {!loading && subscribers.length > 0 && (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>E-mail</th>
                                <th>Tilmeldt</th>
                                <th>Handlinger</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map((sub) => (
                                <tr key={sub.id}>
                                    <td>
                                        <a href={`mailto:${sub.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                                            {sub.email}
                                        </a>
                                    </td>
                                    <td style={{ fontSize: '0.82rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                                        {formatDate(sub.subscribedAt)}
                                    </td>
                                    <td className={styles.actions}>
                                        <button onClick={() => handleDelete(sub)} className={styles.btnDelete}>
                                            Fjern
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

export default TabAbonnenter;
