// src/components/EksamenCard.jsx
import { useState } from 'react';

const styles = {
    card: {
        background: '#2a3f2a',
        border: '1px solid #3a5a3a',
        borderRadius: '10px',
        marginBottom: '1rem',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        padding: '1.2rem 1.5rem',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'background 0.2s',
    },
    number: {
        fontSize: '2rem',
        fontWeight: '800',
        color: '#c8a96e',
        minWidth: '3rem',
        lineHeight: 1,
    },
    title: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#f5f0e8',
        flex: 1,
    },
    chevron: {
        color: '#c8a96e',
        fontSize: '1.2rem',
        transition: 'transform 0.25s',
    },
    body: {
        padding: '0 1.5rem 1.5rem',
        color: '#f5f0e8',
    },
    answer: {
        lineHeight: '1.75',
        marginBottom: '1rem',
        fontSize: '0.97rem',
    },
    codeLabel: {
        color: '#c8a96e',
        fontWeight: '600',
        fontSize: '0.85rem',
        marginBottom: '0.4rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    pre: {
        background: '#111',
        color: '#a8ff78',
        borderRadius: '6px',
        padding: '1rem 1.2rem',
        overflowX: 'auto',
        fontSize: '0.85rem',
        lineHeight: '1.6',
        marginBottom: '1rem',
        fontFamily: "'Fira Code', 'Courier New', monospace",
    },
    errorsLabel: {
        color: '#e87070',
        fontWeight: '600',
        fontSize: '0.85rem',
        marginBottom: '0.4rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    errorList: {
        paddingLeft: '1.4rem',
        margin: 0,
        fontSize: '0.93rem',
        lineHeight: '1.7',
        color: '#f5d0d0',
    },
};

const EksamenCard = ({ number, title, answer, codeExample, errors }) => {
    const [open, setOpen] = useState(false);

    return (
        <div style={styles.card}>
            <div
                style={{
                    ...styles.header,
                    background: open ? '#1e331e' : 'transparent',
                }}
                onClick={() => setOpen((o) => !o)}
            >
                <span style={styles.number}>{number}</span>
                <span style={styles.title}>{title}</span>
                <span style={{ ...styles.chevron, transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                </span>
            </div>

            {open && (
                <div style={styles.body}>
                    <p style={styles.answer} dangerouslySetInnerHTML={{ __html: answer }} />

                    {codeExample && (
                        <>
                            <p style={styles.codeLabel}>Kode-eksempel</p>
                            <pre style={styles.pre}><code>{codeExample}</code></pre>
                        </>
                    )}

                    {errors && errors.length > 0 && (
                        <>
                            <p style={styles.errorsLabel}>Typiske fejl</p>
                            <ul style={styles.errorList}>
                                {errors.map((e, i) => <li key={i}>{e}</li>)}
                            </ul>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default EksamenCard;
