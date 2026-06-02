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
    const [replyingTo, setReplyingTo] = useState(null);   // id of message being replied to
    const [replyText, setReplyText] = useState('');
    const [replySending, setReplySending] = useState(false);

    useEffect(() => { loadMessages(); }, []);

    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(null), 3000);
        return () => clearTimeout(t);
    }, [success]);

    const loadMessages = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminMessages();
            setMessages(Array.isArray(data) ? data : []);
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
                    Kontaktbeskeder ({messages.length})
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

                {!loading && messages.length === 0 && (
                    <p className={styles.empty}>
                        Ingen beskeder endnu. Beskeder vises her når besøgende sender kontaktformularen.
                    </p>
                )}

                {!loading && messages.length > 0 && (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Navn</th>
                                <th>Email</th>
                                <th>Emne</th>
                                <th>Besked</th>
                                <th>Status</th>
                                <th>Dato</th>
                                <th>Handlinger</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((msg) => (
                                <>
                                <tr key={msg.id}>
                                    <td style={{ whiteSpace: 'nowrap' }}>{msg.name}</td>
                                    <td>
                                        <a href={`mailto:${msg.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                                            {msg.email}
                                        </a>
                                    </td>
                                    <td>{msg.category || '—'}</td>
                                    <td style={{ maxWidth: '220px' }}>
                                        <span title={msg.message}>
                                            {msg.message?.length > 60
                                                ? msg.message.slice(0, 60) + '…'
                                                : msg.message}
                                        </span>
                                    </td>
                                    <td><StatusBadge status={msg.status || 'ny'} /></td>
                                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem', color: '#6b7280' }}>
                                        {formatDate(msg.created)}
                                    </td>
                                    <td className={styles.actions}>
                                        {(msg.status === 'ny' || !msg.status) && (
                                            <button
                                                onClick={() => handleStatusChange(msg, 'læst')}
                                                className={styles.btnEdit}
                                            >
                                                Markér læst
                                            </button>
                                        )}
                                        <button
                                            onClick={() => replyingTo === msg.id ? cancelReply() : openReply(msg)}
                                            className={styles.btnEdit}
                                            style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#93c5fd' }}
                                        >
                                            {replyingTo === msg.id ? 'Annuller' : 'Svar'}
                                        </button>
                                        <button onClick={() => handleDelete(msg)} className={styles.btnDelete}>
                                            Slet
                                        </button>
                                    </td>
                                </tr>

                                {/* Eksisterende svar – vis under rækken */}
                                {msg.reply && replyingTo !== msg.id && (
                                    <tr key={`${msg.id}-reply`} style={{ background: '#f0fdf4' }}>
                                        <td colSpan={7} style={{ padding: '0.6rem 1rem' }}>
                                            <strong style={{ fontSize: '0.8rem', color: '#15803d' }}>
                                                ✓ Svar sendt {formatDate(msg.repliedAt)}:
                                            </strong>
                                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#374151', whiteSpace: 'pre-wrap' }}>
                                                {msg.reply}
                                            </p>
                                        </td>
                                    </tr>
                                )}

                                {/* Svar-formular – åbner inline under rækken */}
                                {replyingTo === msg.id && (
                                    <tr key={`${msg.id}-form`} style={{ background: '#f8faff' }}>
                                        <td colSpan={7} style={{ padding: '0.8rem 1rem' }}>
                                            <p style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', color: '#374151' }}>
                                                Skriv et svar til <strong>{msg.name}</strong> ({msg.email}):
                                            </p>
                                            <textarea
                                                value={replyText}
                                                onChange={e => setReplyText(e.target.value)}
                                                rows={4}
                                                placeholder="Skriv dit svar her…"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.5rem',
                                                    border: '1px solid #cbd5e1',
                                                    borderRadius: '6px',
                                                    fontSize: '0.9rem',
                                                    resize: 'vertical',
                                                    boxSizing: 'border-box',
                                                }}
                                            />
                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleSendReply(msg)}
                                                    disabled={replySending || !replyText.trim()}
                                                    className={styles.btnSave}
                                                >
                                                    {replySending ? 'Sender…' : 'Send svar'}
                                                </button>
                                                <button onClick={cancelReply} className={styles.btnCancel}>
                                                    Annuller
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};

export default TabBeskeder;
