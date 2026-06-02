// src/components/admin/TabBeskeder.jsx
// ─────────────────────────────────────────────────────────
// Backoffice-fanen til visning og håndtering af kontaktbeskeder.
// Beskeder sendes af besøgende via kontaktformularen (POST /contact).
// Admin kan markere status, svare og slette beskeder.
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import {
    getAdminMessages,
    updateMessageStatus,
    deleteMessage,
    replyToMessage,
} from '../../services/messageAdminService';
import styles from '../../pages/Backoffice.module.css';

// Status-labels på dansk
const STATUS_LABELS = {
    ny: { label: 'Ny', color: '#1d4ed8', bg: '#dbeafe' },
    læst: { label: 'Læst', color: '#374151', bg: '#f3f4f6' },
    besvaret: { label: 'Besvaret', color: '#15803d', bg: '#dcfce7' },
    arkiveret: { label: 'Arkiveret', color: '#6b7280', bg: '#f9fafb' },
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

const TabBeskeder = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replySending, setReplySending] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => { loadMessages(page); }, [page]);

    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(null), 3000);
        return () => clearTimeout(t);
    }, [success]);

    const loadMessages = async (p = 1) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAdminMessages(p);
            setMessages(result.data || []);
            setTotalPages(result.totalPages || 1);
            setTotal(result.total || 0);
        } catch {
            setError('Kunne ikke hente beskeder. Er backend-serveren kørende på port 3042?');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (msg, newStatus) => {
        try {
            await updateMessageStatus(msg.id, newStatus);
            setSuccess(`Besked markeret som "${STATUS_LABELS[newStatus]?.label ?? newStatus}".`);
            loadMessages();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (msg) => {
        if (!window.confirm(`Er du sikker på at du vil slette beskeden fra "${msg.name}"?`)) return;
        try {
            await deleteMessage(msg.id);
            setSuccess('Besked slettet!');
            loadMessages();
        } catch (err) {
            setError(err.message);
        }
    };

    const openReply = (msg) => {
        setReplyingTo(msg.id);
        setReplyText('');
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setReplyText('');
    };

    const handleSendReply = async (msg) => {
        if (!replyText.trim()) return;
        setReplySending(true);
        try {
            await replyToMessage(msg.id, replyText);
            setSuccess(`Svar sendt til ${msg.name}.`);
            setReplyingTo(null);
            setReplyText('');
            loadMessages();
        } catch (err) {
            setError(err.message);
        } finally {
            setReplySending(false);
        }
    };

    const formatDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('da-DK', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const nyCount = messages.filter(m => m.status === 'ny' || !m.status).length;

    return (
        <div>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.successMsg}>{success}</p>}

            <section className={styles.tableSection}>
                <h2>
                    Kontaktbeskeder ({total})
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
                    Beskeder sendes af besøgende via kontaktformularen og gemmes herinde.
                </p>

                {loading && <p className={styles.loading}>Henter beskeder...</p>}

                {!loading && total === 0 && (
                    <p className={styles.empty}>
                        Ingen beskeder endnu. Beskeder vises her når besøgende sender kontaktformularen.
                    </p>
                )}

                {!loading && messages.length > 0 && (
                    <div className={styles.adminCards}>
                        {messages.map((msg) => {
                            const status = msg.status || 'ny';
                            const borderColor = status === 'besvaret' ? '#22c55e' : status === 'arkiveret' ? '#9ca3af' : status === 'læst' ? '#6b7280' : '#3b82f6';
                            return (
                                <div key={msg.id} className={styles.adminCard} style={{ borderLeft: `4px solid ${borderColor}` }}>
                                    <div className={styles.adminCardTop}>
                                        <div className={styles.adminCardInfo}>
                                            <span className={styles.adminCardName}>{msg.name}</span>
                                            <a href={`mailto:${msg.email}`} className={styles.adminCardEmail}>{msg.email}</a>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem', flexShrink: 0 }}>
                                            <StatusBadge status={status} />
                                            <span className={styles.adminCardDate}>{formatDate(msg.created)}</span>
                                        </div>
                                    </div>

                                    {msg.category && (
                                        <div className={styles.adminCardChips}>
                                            <span className={styles.adminChip}>
                                                <span className={styles.adminChipLabel}>Emne</span>
                                                <span className={styles.adminChipValue}>{msg.category}</span>
                                            </span>
                                        </div>
                                    )}

                                    <p className={styles.adminCardMessage}>{msg.message}</p>

                                    {msg.reply && replyingTo !== msg.id && (
                                        <div className={styles.adminExistingReply}>
                                            <div className={styles.adminExistingReplyLabel}>✓ Svar sendt {formatDate(msg.repliedAt)}:</div>
                                            <p className={styles.adminExistingReplyText}>{msg.reply}</p>
                                        </div>
                                    )}

                                    {replyingTo === msg.id && (
                                        <div className={styles.adminReplyForm}>
                                            <p className={styles.adminReplyMeta}>
                                                Svar til <strong>{msg.name}</strong> ({msg.email}):
                                            </p>
                                            <textarea
                                                value={replyText}
                                                onChange={e => setReplyText(e.target.value)}
                                                rows={4}
                                                placeholder="Skriv dit svar her…"
                                            />
                                            <div className={styles.adminReplyActions}>
                                                <button
                                                    onClick={() => handleSendReply(msg)}
                                                    disabled={replySending || !replyText.trim()}
                                                    className={styles.adminBtnSave}
                                                >
                                                    {replySending ? 'Sender…' : 'Send svar'}
                                                </button>
                                                <button onClick={cancelReply} className={styles.adminBtnCancel}>
                                                    Annuller
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.adminCardActions}>
                                        {status === 'ny' && (
                                            <button
                                                onClick={() => handleStatusChange(msg, 'læst')}
                                                className={styles.adminBtnEdit}
                                            >
                                                Markér læst
                                            </button>
                                        )}
                                        <button
                                            onClick={() => replyingTo === msg.id ? cancelReply() : openReply(msg)}
                                            className={styles.adminBtnInfo}
                                        >
                                            {replyingTo === msg.id ? 'Luk svar' : 'Svar'}
                                        </button>
                                        <button onClick={() => handleDelete(msg)} className={styles.adminBtnDanger}>
                                            Slet
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.btnEdit}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                        >
                            ← Forrige
                        </button>
                        <span className={styles.pageInfo}>Side {page} af {totalPages}</span>
                        <button
                            className={styles.btnEdit}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || loading}
                        >
                            Næste →
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default TabBeskeder;
